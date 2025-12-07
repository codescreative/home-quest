import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppState, Quest, User, UserRole } from '../types';
import { StorageService } from '../services/storage';

interface GameContextType extends AppState {
    selectUser: (userId: string) => void;
    acceptQuest: (questId: string) => void;
    // Mark done (by child) -> Pending
    markQuestDone: (questId: string) => void;
    // Admin only
    verifyQuest: (questId: string, userId: string, approved: boolean) => void;
    createUser: (name: string, avatar: string, role: UserRole, pin?: string) => void;
    isAdminSetup: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>(StorageService.load());
    const [isAdminSetup, setIsAdminSetup] = useState(StorageService.hasAdmin());

    // Auto-save whenever state changes
    useEffect(() => {
        StorageService.save(state);
        setIsAdminSetup(state.users.some(u => u.role === 'admin'));
    }, [state]);

    const selectUser = (userId: string) => {
        setState(prev => ({ ...prev, currentUser: userId }));
    };

    const createUser = (name: string, avatar: string, role: UserRole, pin?: string) => {
        const newUser: User = {
            id: Date.now().toString(),
            name,
            avatar,
            role,
            pin,
            totalPoints: 0,
            activeQuestIds: [],
            pendingQuestIds: [],
            completedQuestIds: [],
        };
        setState(prev => ({
            ...prev,
            users: [...prev.users, newUser],
            currentUser: newUser.id
        }));
    };

    const acceptQuest = (questId: string) => {
        if (!state.currentUser) return;

        setState(prev => {
            const users = prev.users.map(u => {
                if (u.id === prev.currentUser) {
                    if (u.activeQuestIds.includes(questId)) return u;
                    return { ...u, activeQuestIds: [...u.activeQuestIds, questId] };
                }
                return u;
            });
            return { ...prev, users };
        });
    };

    const markQuestDone = (questId: string) => {
        if (!state.currentUser) return;

        setState(prev => {
            const users = prev.users.map(u => {
                if (u.id === prev.currentUser) {
                    const newActive = u.activeQuestIds.filter(id => id !== questId);
                    const newPending = [...(u.pendingQuestIds || []), questId];
                    return { ...u, activeQuestIds: newActive, pendingQuestIds: newPending };
                }
                return u;
            });
            return { ...prev, users };
        });
    };

    const verifyQuest = (questId: string, userId: string, approved: boolean) => {
        const quest = state.quests.find(q => q.id === questId);
        if (!quest) return;

        setState(prev => {
            const users = prev.users.map(u => {
                if (u.id === userId) {
                    const newPending = (u.pendingQuestIds || []).filter(id => id !== questId);

                    if (approved) {
                        const newCompleted = [...u.completedQuestIds, questId];
                        return {
                            ...u,
                            pendingQuestIds: newPending,
                            completedQuestIds: newCompleted,
                            totalPoints: u.totalPoints + quest.rewardPoints
                        };
                    } else {
                        // Reject: Move back to active so custom can try again?
                        const newActive = [...u.activeQuestIds, questId];
                        return { ...u, pendingQuestIds: newPending, activeQuestIds: newActive };
                    }
                }
                return u;
            });
            return { ...prev, users };
        });
    };

    return (
        <GameContext.Provider value={{
            ...state,
            isAdminSetup,
            selectUser,
            createUser,
            acceptQuest,
            markQuestDone,
            verifyQuest
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within a GameProvider');
    return context;
};
