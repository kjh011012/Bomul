import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type RuneType = 'wave' | 'ember' | 'trail' | 'knot';
export type RelicItem = {
  id: string;
  name: string;
  type: RuneType;
  icon: string;
  obtained: boolean;
  stageObtained?: number;
};

export type EndingType =
  | 'forest_listener' | 'path_weaver' | 'wave_guardian' | 'ember_pioneer'
  | 'knot_treasure' | 'phoenix_guide' | 'balance_heir' | 'family_guard'
  | 'hidden_1' | 'hidden_2';

export interface GameState {
  teamName: string;
  flowRelic: number;
  emberRelic: number;
  trailRelic: number;
  bondRelic: number;
  sealCount: number;
  inventory: RelicItem[];
  routeHistory: string[];
  hintUseCount: number;
  stageIndex: number;
  chestProgress: number;
  endingType: EndingType | null;
  hasNecklace: boolean;
  necklaceCombo: string[];
  roleSwapSuccess: number;
  stagesCleared: boolean[];
  mapFragments: number;
}

const initialRelics: RelicItem[] = [
  { id: 'r1', name: '물결의 파편', type: 'wave', icon: '🌊', obtained: false },
  { id: 'r2', name: '불씨의 파편', type: 'ember', icon: '🔥', obtained: false },
  { id: 'r3', name: '발자국의 파편', type: 'trail', icon: '👣', obtained: false },
  { id: 'r4', name: '매듭의 파편', type: 'knot', icon: '🪢', obtained: false },
  { id: 'r5', name: '물빛 유물', type: 'wave', icon: '💧', obtained: false },
  { id: 'r6', name: '숲잎 유물', type: 'trail', icon: '🍃', obtained: false },
  { id: 'r7', name: '화전 유물', type: 'ember', icon: '✨', obtained: false },
  { id: 'r8', name: '돌결 유물', type: 'knot', icon: '💎', obtained: false },
  { id: 'r9', name: '봉황 깃털', type: 'wave', icon: '🪶', obtained: false },
  { id: 'r10', name: '수호자의 인장', type: 'knot', icon: '🏵️', obtained: false },
];

const defaultState: GameState = {
  teamName: '',
  flowRelic: 0,
  emberRelic: 0,
  trailRelic: 0,
  bondRelic: 0,
  sealCount: 0,
  inventory: initialRelics,
  routeHistory: [],
  hintUseCount: 0,
  stageIndex: 0,
  chestProgress: 0,
  endingType: null,
  hasNecklace: false,
  necklaceCombo: [],
  roleSwapSuccess: 0,
  stagesCleared: Array(10).fill(false),
  mapFragments: 0,
};

interface GameContextType {
  state: GameState;
  setTeamName: (name: string) => void;
  addRelic: (type: RuneType, amount?: number) => void;
  obtainItem: (id: string, stage: number) => void;
  useHint: () => void;
  clearStage: (index: number) => void;
  addRoute: (route: string) => void;
  setNecklace: (combo: string[]) => void;
  addRoleSwap: () => void;
  resetGame: () => void;
  goToStage: (index: number) => void;
  calculateEnding: () => EndingType;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(defaultState);

  const setTeamName = useCallback((name: string) => {
    setState(s => ({ ...s, teamName: name }));
  }, []);

  const addRelic = useCallback((type: RuneType, amount = 1) => {
    setState(s => {
      const key = type === 'wave' ? 'flowRelic' : type === 'ember' ? 'emberRelic' : type === 'trail' ? 'trailRelic' : 'bondRelic';
      return { ...s, [key]: s[key] + amount };
    });
  }, []);

  const obtainItem = useCallback((id: string, stage: number) => {
    setState(s => ({
      ...s,
      inventory: s.inventory.map(item =>
        item.id === id ? { ...item, obtained: true, stageObtained: stage } : item
      ),
    }));
  }, []);

  const useHint = useCallback(() => {
    setState(s => ({ ...s, hintUseCount: s.hintUseCount + 1 }));
  }, []);

  const clearStage = useCallback((index: number) => {
    setState(s => {
      const cleared = [...s.stagesCleared];
      cleared[index] = true;
      const sealCount = cleared.filter(Boolean).length;
      return {
        ...s,
        stagesCleared: cleared,
        sealCount,
        chestProgress: Math.min(100, sealCount * 10),
        mapFragments: s.mapFragments + 1,
      };
    });
  }, []);

  const addRoute = useCallback((route: string) => {
    setState(s => ({ ...s, routeHistory: [...s.routeHistory, route] }));
  }, []);

  const setNecklace = useCallback((combo: string[]) => {
    setState(s => ({ ...s, hasNecklace: true, necklaceCombo: combo }));
  }, []);

  const addRoleSwap = useCallback(() => {
    setState(s => ({ ...s, roleSwapSuccess: s.roleSwapSuccess + 1 }));
  }, []);

  const goToStage = useCallback((index: number) => {
    setState(s => ({ ...s, stageIndex: index }));
  }, []);

  const calculateEnding = useCallback((): EndingType => {
    const { flowRelic, emberRelic, trailRelic, bondRelic, hintUseCount, roleSwapSuccess } = state;
    const total = flowRelic + emberRelic + trailRelic + bondRelic;
    const isBalanced = Math.max(flowRelic, emberRelic, trailRelic, bondRelic) - Math.min(flowRelic, emberRelic, trailRelic, bondRelic) <= 2;

    if (hintUseCount <= 2 && isBalanced) return 'hidden_1';
    if (bondRelic >= 4 && roleSwapSuccess >= 3) return 'hidden_2';
    if (flowRelic >= total * 0.35) return 'wave_guardian';
    if (emberRelic >= total * 0.35) return 'ember_pioneer';
    if (trailRelic >= total * 0.35) return 'forest_listener';
    if (bondRelic >= total * 0.35) return 'knot_treasure';
    if (isBalanced) return 'balance_heir';
    if (roleSwapSuccess >= 2) return 'family_guard';
    if (flowRelic + trailRelic > emberRelic + bondRelic) return 'path_weaver';
    return 'phoenix_guide';
  }, [state]);

  const resetGame = useCallback(() => {
    setState(defaultState);
  }, []);

  return (
    <GameContext.Provider value={{
      state, setTeamName, addRelic, obtainItem, useHint, clearStage,
      addRoute, setNecklace, addRoleSwap, resetGame, goToStage, calculateEnding,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
