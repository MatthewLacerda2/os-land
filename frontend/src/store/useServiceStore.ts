import { create } from 'zustand';

export interface EnvironmentPhoto {
  label: string;
  file: File;
  previewUrl: string;
}

export interface Environment {
  id: string;
  name: string;
  protocolType: string;
  designatedSystem: string;
  photos: EnvironmentPhoto[];
}

export interface ServiceOrder {
  osNumber: string;
  agency: string;
  state: string;
  company?: string;
  latitude: string;
  longitude: string;
  description: string;
  // Main Photos
  frontalPicture?: File;
  ticketPicture?: File;
  condenserPicture?: File;
  faultPicture?: File;
  // Previews
  frontalPreview?: string;
  ticketPreview?: string;
  condenserPreview?: string;
  faultPreview?: string;
  
  environments: Environment[];
}

interface ServiceStore {
  currentOrder: ServiceOrder;
  
  // Actions
  updateOrderDetails: (details: Partial<Omit<ServiceOrder, 'environments'>>) => void;
  setInitialPhoto: (slot: 'frontal' | 'ticket' | 'condenser' | 'fault', file: File) => void;
  addEnvironment: (env: Omit<Environment, 'id'>) => void;
  removeEnvironment: (id: string) => void;
  resetOrder: () => void;
}

const INITIAL_STATE: ServiceOrder = {
  osNumber: '',
  agency: '',
  state: '',
  company: '',
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

  setInitialPhoto: (slot, file) => set((state) => {
    const previewUrl = URL.createObjectURL(file);
    const updates: Partial<ServiceOrder> = {};
    
    if (slot === 'frontal') {
      updates.frontalPicture = file;
      updates.frontalPreview = previewUrl;
    } else if (slot === 'ticket') {
      updates.ticketPicture = file;
      updates.ticketPreview = previewUrl;
    } else if (slot === 'condenser') {
      updates.condenserPicture = file;
      updates.condenserPreview = previewUrl;
    } else if (slot === 'fault') {
      updates.faultPicture = file;
      updates.faultPreview = previewUrl;
    }

    return {
      currentOrder: { ...state.currentOrder, ...updates }
    };
  }),

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
