
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows,
  Float
} from '@react-three/drei';
import { GameState, AdData, Reward, PlayerRank, CharacterType } from './types';
import { 
  MOCK_ADS, 
  TOTAL_SQUARES, 
  INITIAL_LEADERBOARD, 
  POINTS_PER_AD, 
  POINTS_PER_LAP, 
  TOKENS_PER_LAP, 
  STREAK_BONUS_MULTIPLIER 
} from './constants';
import Square from './components/Square';
import Player from './components/Player';
import UIOverlay from './components/UIOverlay';
import AdModal from './components/AdModal';
import RewardModal from './components/RewardModal';
import Leaderboard from './components/Leaderboard';
import ChallengeOverlay from './components/ChallengeOverlay';
import ReferralModal from './components/ReferralModal';
import AdManager from './components/AdManager';

const App: React.FC = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [showAdManager, setShowAdManager] = useState(false);
  const [customAds, setCustomAds] = useState<AdData[]>([]);

  const [gameState, setGameState] = useState<GameState>({
    currentPosition: 0,
    score: 0,
    tokens: 100,
    loopsCompleted: 0,
    streak: 0,
    visitedCount: 1,
    selectedAd: null,
    pendingReward: null,
    activeChallenge: null,
    isMoving: false,
    history: [0],
    leaderboard: INITIAL_LEADERBOARD,
    referralCode: "AD-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
    characterType: 'EXPLORER'
  });

  // Load custom ads on mount and updates
  const loadCustomAds = useCallback(() => {
    const saved = localStorage.getItem('adopoly_custom_ads');
    if (saved) setCustomAds(JSON.parse(saved));
  }, []);

  useEffect(() => {
    loadCustomAds();
  }, [loadCustomAds]);

  // Merge custom ads with mock ads for the board
  // We replace the standard "Brand X" squares with custom ones
  const boardAds = useMemo(() => {
    const combined = [...MOCK_ADS];
    customAds.forEach((custom, index) => {
      // Find a non-corner square to replace, starting from index 1
      let targetIdx = 1;
      let count = 0;
      while (targetIdx < TOTAL_SQUARES && count < index) {
        if (targetIdx % 10 !== 0) count++;
        targetIdx++;
      }
      // Ensure we don't replace corners
      while (targetIdx % 10 === 0 && targetIdx < TOTAL_SQUARES) targetIdx++;
      
      if (targetIdx < TOTAL_SQUARES) {
        combined[targetIdx] = { ...combined[targetIdx], ...custom, id: targetIdx };
      }
    });
    return combined;
  }, [customAds]);

  const handleSquareClick = (index: number) => {
    if (gameState.isMoving) return;
    const previousPos = gameState.currentPosition;
    setGameState(prev => ({ ...prev, currentPosition: index, isMoving: true, selectedAd: null }));

    setTimeout(() => {
      setGameState(prev => {
        const ad = boardAds[index];
        const isNewAd = !prev.history.includes(index);
        let updatedScore = prev.score + (isNewAd ? POINTS_PER_AD : Math.floor(POINTS_PER_AD / 5));
        let updatedTokens = prev.tokens;
        let updatedLoops = prev.loopsCompleted;
        let updatedStreak = prev.streak;
        let loopReward: Reward | null = null;

        const completedLoop = index < previousPos || (previousPos > 30 && index === 0);

        if (completedLoop) {
          updatedLoops += 1;
          updatedStreak += 1;
          const baseBonus = TOKENS_PER_LAP;
          const streakBonus = Math.floor(baseBonus * (updatedStreak - 1) * STREAK_BONUS_MULTIPLIER);
          const totalRewardTokens = baseBonus + streakBonus;
          updatedTokens += totalRewardTokens;
          updatedScore += POINTS_PER_LAP * updatedStreak;
          loopReward = {
            type: 'TOKEN',
            amount: totalRewardTokens,
            label: 'Cycle Rewards & Bonus Credits',
            bonus: updatedStreak > 2 ? 'New Challenger Badge Unlocked' : undefined
          };
        }

        const newLeaderboard = prev.leaderboard.map(rank => 
          rank.isPlayer ? { ...rank, score: updatedScore, loops: updatedLoops } : rank
        );

        return {
          ...prev,
          isMoving: false,
          score: updatedScore,
          tokens: updatedTokens,
          loopsCompleted: updatedLoops,
          streak: updatedStreak,
          visitedCount: isNewAd ? prev.visitedCount + 1 : prev.visitedCount,
          history: [...new Set([...prev.history, index])],
          selectedAd: ad,
          pendingReward: loopReward,
          activeChallenge: ad.isChallenge ? 'CLICKER' : null,
          leaderboard: newLeaderboard
        };
      });
    }, 1200);
  };

  const handleChallengeComplete = (bonusScore: number) => {
    setGameState(prev => {
      const newScore = prev.score + bonusScore;
      return {
        ...prev,
        activeChallenge: null,
        score: newScore,
        leaderboard: prev.leaderboard.map(r => r.isPlayer ? { ...r, score: newScore } : r)
      };
    });
  };

  const handleRandomMove = () => {
    const jump = Math.floor(Math.random() * 9) + 3;
    const nextIdx = (gameState.currentPosition + jump) % TOTAL_SQUARES;
    handleSquareClick(nextIdx);
  };

  return (
    <div className="relative w-full h-screen bg-slate-50 overflow-hidden font-sans">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={36} />
        <OrbitControls enablePan={false} minDistance={8} maxDistance={25} maxPolarAngle={Math.PI / 2.1} />
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 20, 10]} angle={0.25} penumbra={1} intensity={1.5} castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={0.6} />

        <group rotation={[0, 0, 0]} position={[0, -1, 0]}>
          {boardAds.map((ad, idx) => (
            <Square 
              key={ad.id + '-' + idx} 
              data={ad} 
              index={idx}
              isActive={gameState.currentPosition === idx}
              onClick={() => handleSquareClick(idx)}
            />
          ))}
          <Player 
            positionIndex={gameState.currentPosition} 
            characterType={gameState.characterType}
          />
          <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1}>
            <mesh position={[0, 2.5, 0]}>
              <icosahedronGeometry args={[0.7, 0]} />
              <meshStandardMaterial color="#3b82f6" roughness={0} metalness={1} emissive="#3b82f6" emissiveIntensity={0.5} />
            </mesh>
            <pointLight position={[0, 2.5, 0]} color="#3b82f6" intensity={3} distance={7} />
          </Float>
          <ContactShadows opacity={0.3} scale={30} blur={3} far={10} resolution={512} color="#000000" />
        </group>
        <Environment preset="city" />
      </Canvas>

      <UIOverlay 
        gameState={gameState} 
        onRandomMove={handleRandomMove} 
        onToggleLeaderboard={() => setShowLeaderboard(!showLeaderboard)}
        onOpenReferral={() => setShowReferral(true)}
        onOpenAdManager={() => setShowAdManager(true)}
      />
      
      {gameState.selectedAd && !gameState.pendingReward && !gameState.activeChallenge && (
        <AdModal ad={gameState.selectedAd} onClose={() => setGameState(p => ({ ...p, selectedAd: null }))} />
      )}

      {gameState.activeChallenge && (
        <ChallengeOverlay onComplete={handleChallengeComplete} onCancel={() => setGameState(p => ({ ...p, activeChallenge: null }))} />
      )}

      {gameState.pendingReward && (
        <RewardModal reward={gameState.pendingReward} streak={gameState.streak} onClose={() => setGameState(p => ({ ...p, pendingReward: null }))} />
      )}

      {showLeaderboard && (
        <Leaderboard ranks={gameState.leaderboard} onClose={() => setShowLeaderboard(false)} />
      )}

      {showReferral && (
        <ReferralModal code={gameState.referralCode} onClose={() => setShowReferral(false)} />
      )}

      {showAdManager && (
        <AdManager onUpdate={loadCustomAds} onClose={() => setShowAdManager(false)} />
      )}

      <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter drop-shadow-sm select-none">
          AD<span className="text-blue-600">OPOLY</span>
        </h1>
        <p className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase opacity-80">Interactive Ads Redefined</p>
      </div>
    </div>
  );
};

export default App;
