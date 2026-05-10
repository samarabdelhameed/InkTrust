import { create } from 'zustand';

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  userRole: 'ADMIN' | 'CAREGIVER' | 'VIEWER' | null;
  setUserRole: (role: 'ADMIN' | 'CAREGIVER' | 'VIEWER') => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  userRole: null,
  setUserRole: (role) => set({ userRole: role }),
}));
