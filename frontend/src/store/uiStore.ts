import { create } from "zustand";

/* ═══════════════════════════════════════════
   CineVault — UI Store (Zustand)
   Global UI state: modals, search, sidebar, loading
   ═══════════════════════════════════════════ */

interface UIState {
  // Navbar
  isNavbarScrolled: boolean;
  setNavbarScrolled: (scrolled: boolean) => void;

  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Search
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  // Modal
  activeModal: string | null;
  modalData: unknown;
  openModal: (id: string, data?: unknown) => void;
  closeModal: () => void;

  // Loading
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;

  // Initial load animation
  hasInitialLoadCompleted: boolean;
  setInitialLoadCompleted: () => void;

  // Featured hero index
  heroIndex: number;
  setHeroIndex: (index: number) => void;
  nextHero: (total: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Navbar
  isNavbarScrolled: false,
  setNavbarScrolled: (scrolled) => set({ isNavbarScrolled: scrolled }),

  // Sidebar
  isSidebarOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // Search
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),

  // Modal
  activeModal: null,
  modalData: null,
  openModal: (id, data) => set({ activeModal: id, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Loading
  isPageLoading: true,
  setPageLoading: (loading) => set({ isPageLoading: loading }),

  // Initial load
  hasInitialLoadCompleted: false,
  setInitialLoadCompleted: () => set({ hasInitialLoadCompleted: true }),

  // Hero
  heroIndex: 0,
  setHeroIndex: (index) => set({ heroIndex: index }),
  nextHero: (total) =>
    set((s) => ({ heroIndex: (s.heroIndex + 1) % total })),
}));
