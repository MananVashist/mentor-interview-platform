import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  show: (message: string, type?: ToastType) => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'success',
  show: (message, type = 'success') => {
    // Reset if already showing to restart animation
    set((state) => (state.visible ? { visible: false } : {}));
    
    // Small delay to ensure UI unmounts/remounts or animates correctly
    setTimeout(() => {
      set({ visible: true, message, type });
    }, 50);
  },
  hide: () => set({ visible: false }),
}));