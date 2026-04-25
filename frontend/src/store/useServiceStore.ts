import { create } from 'zustand'

export interface Environment {
  id: string
  name: string
  equipmentDescription: string
  maintenanceType: 'preventive' | 'corrective'
  repairDescription: string
  evidencePhotos: string[]
}

export interface ServiceOrder {
  id: string
  number: string
  location: string
  description: string
  initialPhotos: string[]
  environments: Environment[]
  status: 'draft' | 'completed'
  createdAt: string
}

interface ServiceStore {
  currentOrder: ServiceOrder | null
  history: ServiceOrder[]
  
  // Actions
  startNewOrder: () => void
  updateOrderDetails: (details: Partial<Omit<ServiceOrder, 'id' | 'environments'>>) => void
  addEnvironment: (env: Omit<Environment, 'id'>) => void
  removeEnvironment: (id: string) => void
  completeOrder: () => void
  resetCurrentOrder: () => void
}

export const useServiceStore = create<ServiceStore>((set) => ({
  currentOrder: null,
  history: [],

  startNewOrder: () => set({
    currentOrder: {
      id: Math.random().toString(36).substr(2, 9),
      number: '',
      location: '',
      description: '',
      initialPhotos: [],
      environments: [],
      status: 'draft',
      createdAt: new Date().toISOString()
    }
  }),

  updateOrderDetails: (details) => set((state) => ({
    currentOrder: state.currentOrder ? { ...state.currentOrder, ...details } : null
  })),

  addEnvironment: (env) => set((state) => ({
    currentOrder: state.currentOrder ? {
      ...state.currentOrder,
      environments: [...state.currentOrder.environments, { ...env, id: Math.random().toString(36).substr(2, 9) }]
    } : null
  })),

  removeEnvironment: (id) => set((state) => ({
    currentOrder: state.currentOrder ? {
      ...state.currentOrder,
      environments: state.currentOrder.environments.filter(e => e.id !== id)
    } : null
  })),

  completeOrder: () => set((state) => {
    if (!state.currentOrder) return state
    const completedOrder = { ...state.currentOrder, status: 'completed' as const }
    return {
      history: [completedOrder, ...state.history],
      currentOrder: null
    }
  }),

  resetCurrentOrder: () => set({ currentOrder: null })
}))
