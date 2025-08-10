// stores/useSceneStore.ts
import { create } from 'zustand'
import { ReactNode } from 'react'

interface SceneStore {
  scene: ReactNode | null
  sceneType: string
  setScene: (scene: ReactNode | null, type?: string) => void
}

export const useSceneStore = create<SceneStore>((set) => ({
  scene: null,
  sceneType: 'viewer',
  setScene: (scene, type = 'viewer') => set({ scene, sceneType: type }),
}))
