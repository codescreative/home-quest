export type QuestStatus = 'available' | 'active' | 'pending_verification' | 'completed';

export interface Quest {
    id: string;
    title: string;
    description: string;
    rewardPoints: number;
    status: QuestStatus;
    icon?: string;
    isRepeatable: boolean;
}

export type UserRole = 'admin' | 'child';

export interface User {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
    pin?: string; // Only for admin
    totalPoints: number;
    activeQuestIds: string[];
    pendingQuestIds: string[]; // Waiting for admin approval
    completedQuestIds: string[];
}

export interface AppState {
    users: User[];
    quests: Quest[];
    currentUser: string | null;
}
