import { create } from 'zustand';

export interface EnvironmentPhoto {
  label: string;
  file: File;
  previewUrl: string;
}

export interface Environment {
  id: string;
  designatedSystem: string;
  description?: string;
  setPoint?: number;
  photos: EnvironmentPhoto[];
}

export interface ServiceOrder {
  osNumber: string;
  agency: string;
  agencyName?: string;
  state: string;
  company?: string;
  assetNumber?: string;
  protocolType: string;
  environmentName: string;
  latitude: string;
  longitude: string;
  description: string;
  
  environments: Environment[];
}

interface ServiceStore {
  currentOrder: ServiceOrder;
  
  // Actions
  updateOrderDetails: (details: Partial<Omit<ServiceOrder, 'environments'>>) => void;
  addEnvironment: (env: Omit<Environment, 'id'>) => void;
  removeEnvironment: (id: string) => void;
  resetOrder: () => void;
}

const INITIAL_STATE: ServiceOrder = {
  osNumber: '',
  agency: '',
  agencyName: '',
  state: '',
  company: '',
  assetNumber: '',
  protocolType: 'corrective',
  environmentName: '',
  latitude: '15.7939',
  longitude: '-47.8828',
  description: '',
  environments: [],
};

export const useServiceStore = create<ServiceStore>((set) => ({
  currentOrder: { ...INITIAL_STATE },

  updateOrderDetails: (details) => set((state) => ({
    currentOrder: { ...state.currentOrder, ...details }
  })),

  addEnvironment: (env) => set((state) => ({
    currentOrder: {
      ...state.currentOrder,
      environments: [...state.currentOrder.environments, { 
        ...env, 
        id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11) 
      }]
    }
  })),

  removeEnvironment: (id) => set((state) => ({
    currentOrder: {
      ...state.currentOrder,
      environments: state.currentOrder.environments.filter(e => e.id !== id)
    }
  })),

  resetOrder: () => set({ currentOrder: { ...INITIAL_STATE } }),
}))
