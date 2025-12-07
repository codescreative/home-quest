import type { AppState, Quest, User } from '../types';

const DB_KEY = 'homequest_db_v1';

const INITIAL_QUESTS: Quest[] = [
    {
        id: 'q1',
        title: 'Clean Your Room',
        description: 'Pick up all toys and make your bed.',
        rewardPoints: 20,
        status: 'available',
        icon: 'Bed',
        isRepeatable: true,
    },
    {
        id: 'q2',
        title: 'Wash Dishes',
        description: 'Help load and unload the dishwasher.',
        rewardPoints: 15,
        status: 'available',
        icon: 'Utensils',
        isRepeatable: true,
    },
    {
        id: 'q3',
        title: 'Read a Book',
        description: 'Read for 20 minutes.',
        rewardPoints: 10,
        status: 'available',
        icon: 'BookOpen',
        isRepeatable: true,
    },
    {
        id: 'q4',
        title: 'Walk the Dog',
        description: 'Take Buster for a walk around the block.',
        rewardPoints: 25,
        status: 'available',
        icon: 'Dog',
        isRepeatable: true,
    },
];

const INITIAL_USERS: User[] = [
    {
        id: 'u1',
        name: 'Hero',
        avatar: '🦸',
        role: 'child',
        totalPoints: 0,
        activeQuestIds: [],
        completedQuestIds: [],
    },
];

const DEFAULT_STATE: AppState = {
    users: INITIAL_USERS,
    quests: INITIAL_QUESTS,
    currentUser: null,
};

export const StorageService = {
    load: (): AppState => {
        try {
            const data = localStorage.getItem(DB_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.error('Failed to load data', e);
        }
        return DEFAULT_STATE;
    },

    save: (state: AppState) => {
        try {
            localStorage.setItem(DB_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save data', e);
        }
    },

    // Helper to reset if needed
    reset: () => {
        localStorage.removeItem(DB_KEY);
        return DEFAULT_STATE;
    },

    hasAdmin: (): boolean => {
        try {
            const data = localStorage.getItem(DB_KEY);
            if (data) {
                const state: AppState = JSON.parse(data);
                return state.users.some(u => u.role === 'admin');
            }
        } catch { return false; }
        return false;
    }
};
