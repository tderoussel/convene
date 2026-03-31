import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MemberProfile, Room, Notification } from '@/types';

// ── State shape ──

interface AppState {
  // Auth
  currentUser: MemberProfile | null;
  isAuthenticated: boolean;

  // Navigation
  currentView: string;

  // Rooms
  rooms: Room[];
  joinedRoomIds: string[];

  // Notifications
  notifications: Notification[];
  unreadCount: number;

  // Toast messages
  toastMessage: string | null;

  // Actions
  login: (user: MemberProfile) => void;
  logout: () => void;
  setView: (view: string) => void;
  setRooms: (rooms: Room[]) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  updateUserTier: (tier: MemberProfile['tier']) => void;
  updateUserReputation: (score: number) => void;
}

// ── Store ──

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // ── Defaults ──
      currentUser: null,
      isAuthenticated: false,
      currentView: 'dashboard',
      rooms: [],
      joinedRoomIds: [],
      notifications: [],
      unreadCount: 0,
      toastMessage: null,

      // ── Actions ──

      login: (user) =>
        set((state) => ({
          currentUser: user,
          isAuthenticated: true,
          joinedRoomIds: state.joinedRoomIds.length > 0
            ? state.joinedRoomIds
            : ['r1', 'r4', 'r7', 'r8', 'r9'], // AI Founders, Angel Investors, Fundraising, Ship It, Catalyst Lounge
        })),

      logout: () =>
        set({
          currentUser: null,
          isAuthenticated: false,
          currentView: 'dashboard',
          rooms: [],
          joinedRoomIds: [],
          notifications: [],
          unreadCount: 0,
        }),

      setView: (view) =>
        set({ currentView: view }),

      setRooms: (rooms) =>
        set({ rooms }),

      joinRoom: (roomId) =>
        set((state) => ({
          joinedRoomIds: state.joinedRoomIds.includes(roomId)
            ? state.joinedRoomIds
            : [...state.joinedRoomIds, roomId],
        })),

      leaveRoom: (roomId) =>
        set((state) => ({
          joinedRoomIds: state.joinedRoomIds.filter((id) => id !== roomId),
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + (notification.read ? 0 : 1),
        })),

      markNotificationRead: (notificationId) =>
        set((state) => {
          const target = state.notifications.find((n) => n.id === notificationId);
          if (!target || target.read) return state;

          return {
            notifications: state.notifications.map((n) =>
              n.id === notificationId ? { ...n, read: true } : n,
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          };
        }),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      showToast: (message) =>
        set({ toastMessage: message }),

      clearToast: () =>
        set({ toastMessage: null }),

      updateUserTier: (tier) =>
        set((state) => ({
          currentUser: state.currentUser ? { ...state.currentUser, tier } : null,
        })),

      updateUserReputation: (score) =>
        set((state) => ({
          currentUser: state.currentUser ? { ...state.currentUser, reputation_score: score } : null,
        })),
    }),
    {
      name: 'alyned-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        joinedRoomIds: state.joinedRoomIds,
      }),
    },
  ),
);
