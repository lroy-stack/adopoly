
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit3, Image as ImageIcon, Link as LinkIcon, Save, AlertCircle, LayoutGrid, Palette, Settings2 } from 'lucide-react';
import { AdData, AdCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface AdManagerProps {
  onClose: () => void;
  onUpdate: () => void;
}

const DEFAULT_CATEGORIES: AdCategory[] = Object.entries(CATEGORY_COLORS).map(([name, color]) => ({
  name,
  color,
  isCustom: false
}));

const AdManager: React.FC<AdManagerProps> = ({ onClose, onUpdate }) => {
  const [ads, setAds] = useState<AdData[]>([]);
  const [categories, setCategories] = useState<AdCategory[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [showCatManager, setShowCatManager] = useState(false);
  
  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3b82f6');

  const [formData, setFormData] = useState<Partial<AdData>>({
    name: '',
    description: '',
    link: '',
    logo: '',
    category: 'Tech'
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedAds = localStorage.getItem('adopoly_custom_ads');
    if (savedAds) setAds(JSON.parse(savedAds));

    const savedCats = localStorage.getItem('adopoly_custom_categories');
    if (savedCats) {
      setCategories(JSON.parse(savedCats));
    } else {
      setCategories(DEFAULT_CATEGORIES);
    }
  }, []);

  const saveCategories = (newCats: AdCategory[]) => {
    setCategories(newCats);
    localStorage.setItem('adopoly_custom_categories', JSON.stringify(newCats));
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    if (categories.some(c => c.name.toLowerCase() === newCatName.toLowerCase())) {
        setError("Category name already exists");
        return;
    }
    const updated = [...categories, { name: newCatName.trim(), color: newCatColor, isCustom: true }];
    saveCategories(updated);
    setNewCatName('');
    setError(null);
  };

  const deleteCategory = (name: string) => {
    const updated = categories.filter(c => c.name !== name);
    saveCategories(updated);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.link || !formData.logo) {
      setError("Name, Link, and Image are required!");
      return;
    }

    const selectedCat = categories.find(c => c.name === formData.category) || categories[0];

    let updatedAds: AdData[];
    if (isEditing !== null) {
      updatedAds = ads.map(a => a.id === isEditing ? { ...a, ...formData, color: selectedCat.color } as AdData : a);
    } else {
      const newAd: AdData = {
        ...formData,
        id: Date.now(),
        category: formData.category || 'Tech',
        color: selectedCat.color,
        cta: 'Visit Website',
        engagementScore: 0
      } as AdData;
      updatedAds = [...ads, newAd];
    }

    setAds(updatedAds);
    localStorage.setItem('adopoly_custom_ads', JSON.stringify(updatedAds));
    setFormData({ name: '', description: '', link: '', logo: '', category: categories[0]?.name || 'Tech' });
    setIsEditing(null);
    setError(null);
    onUpdate();
  };

  const deleteAd = (id: number) => {
    const updated = ads.filter(a => a.id !== id);
    setAds(updated);
    localStorage.setItem('adopoly_custom_ads', JSON.stringify(updated));
    onUpdate();
  };

  const startEdit = (ad: AdData) => {
    setFormData(ad);
    setIsEditing(ad.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-md flex justify-center items-start overflow-y-auto p-4 md:p-10">
      <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Business Portal</h2>
            <p className="text-slate-500 font-medium">Register and manage your board advertisements</p>
          </div>
          <div className="flex gap-2">
            <button 
                onClick={() => setShowCatManager(!showCatManager)}
                className={`p-3 rounded-2xl transition-all flex items-center gap-2 font-bold text-sm ${showCatManager ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 shadow-sm border border-slate-100'}`}
            >
                <Palette size={18} />
                <span className="hidden md:block">CATEGORIES</span>
            </button>
            <button onClick={onClose} className="p-3 bg-white shadow-sm hover:shadow-md rounded-2xl text-slate-400 hover:text-slate-600 transition-all border border-slate-100">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Main Form Section */}
          <div className="lg:col-span-4 p-8 border-r border-slate-100 bg-white">
            
            {showCatManager ? (
              <div className="animate-in slide-in-from-left duration-300">
                 <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                    <Palette size={20} /> Manage Categories
                 </h3>
                 
                 <div className="space-y-4 mb-8">
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            placeholder="New category..."
                            value={newCatName}
                            onChange={e => setNewCatName(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                        />
                        <input 
                            type="color"
                            value={newCatColor}
                            onChange={e => setNewCatColor(e.target.value)}
                            className="w-12 h-11 p-1 bg-white border border-slate-200 rounded-xl cursor-pointer"
                        />
                        <button 
                            onClick={handleAddCategory}
                            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {categories.map(cat => (
                            <div key={cat.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: cat.color }} />
                                    <span className="text-sm font-bold text-slate-700">{cat.name}</span>
                                    {!cat.isCustom && <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-200 px-1.5 py-0.5 rounded">Default</span>}
                                </div>
                                {cat.isCustom && (
                                    <button onClick={() => deleteCategory(cat.name)} className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                 </div>
                 <button 
                    onClick={() => setShowCatManager(false)}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-xs tracking-widest uppercase hover:bg-black transition-all"
                 >
                    BACK TO AD FORM
                 </button>
              </div>
            ) : (
              <div className="animate-in slide-in-from-right duration-300">
                <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                  {isEditing !== null ? <Edit3 size={20} /> : <Plus size={20} />}
                  {isEditing !== null ? "Update Advertisement" : "Create New Ad"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold">
                      <AlertCircle size={18} /> {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ad Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData(p => ({...p, name: e.target.value}))}
                      className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      placeholder="e.g. Pixel Coffee"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                        <select 
                            value={formData.category}
                            onChange={e => setFormData(p => ({...p, category: e.target.value}))}
                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-sm appearance-none"
                        >
                            {categories.map(cat => (
                                <option key={cat.name} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Board Color</label>
                        <div className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                            <div 
                                className="w-6 h-6 rounded-full shadow-lg border-2 border-white" 
                                style={{ backgroundColor: categories.find(c => c.name === formData.category)?.color || '#ddd' }} 
                            />
                            <span className="text-[10px] font-black text-slate-400">Linked to category</span>
                        </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData(p => ({...p, description: e.target.value}))}
                      className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium min-h-[80px]"
                      placeholder="Tell players about your brand..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Call-to-Action Link</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="url" 
                        value={formData.link}
                        onChange={e => setFormData(p => ({...p, link: e.target.value}))}
                        className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Visual Content</label>
                    <div className="flex gap-4 items-start">
                      <label className="cursor-pointer flex-1 bg-slate-50 border-2 border-dashed border-slate-200 p-6 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all text-center group">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <ImageIcon className="mx-auto mb-2 text-slate-400 group-hover:text-blue-500" size={24} />
                        <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 uppercase">Upload Image</span>
                      </label>
                      {formData.logo && (
                        <div className="w-20 h-20 rounded-2xl border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                          <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      {isEditing !== null ? "SAVE CHANGES" : "REGISTER AD"}
                    </button>
                    {isEditing !== null && (
                      <button 
                        type="button"
                        onClick={() => { setIsEditing(null); setFormData({ name: '', description: '', link: '', logo: '', category: categories[0]?.name }); }}
                        className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 font-bold transition-all"
                      >
                        CANCEL
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* List Section */}
          <div className="lg:col-span-8 p-8 bg-slate-50/50">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <LayoutGrid size={20} />
              Active Advertisements ({ads.length})
            </h3>

            {ads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <div className="bg-slate-100 p-8 rounded-full mb-6">
                  <ImageIcon size={64} className="opacity-50" />
                </div>
                <p className="font-black text-lg text-slate-600">No custom ads yet.</p>
                <p className="text-sm">Created ads will appear dynamically on the 3D board.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {ads.map((ad) => (
                  <div key={ad.id} className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-100 group transition-all hover:shadow-xl hover:-translate-y-1 hover:border-blue-100">
                    <div className="aspect-video rounded-2xl overflow-hidden mb-4 relative shadow-inner bg-slate-100">
                      <img src={ad.logo} alt={ad.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEdit(ad)}
                          className="p-2.5 bg-white/95 backdrop-blur text-blue-600 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => deleteAd(ad.id)}
                          className="p-2.5 bg-white/95 backdrop-blur text-rose-600 rounded-xl shadow-lg hover:bg-rose-600 hover:text-white transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {/* Color indicator bubble */}
                      <div 
                        className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest shadow-lg"
                        style={{ backgroundColor: ad.color }}
                      >
                        {ad.category}
                      </div>
                    </div>
                    <div className="mb-4 min-h-[72px]">
                      <h4 className="font-black text-slate-800 text-lg leading-tight mb-2 truncate">{ad.name}</h4>
                      <p className="text-slate-500 text-xs line-clamp-2 font-medium leading-relaxed">{ad.description || 'No description provided.'}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                        <a 
                            href={ad.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 text-[10px] font-black uppercase flex items-center gap-1.5 hover:text-blue-700"
                        >
                            <LinkIcon size={12} />
                            {new URL(ad.link).hostname}
                        </a>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ad.color }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdManager;
