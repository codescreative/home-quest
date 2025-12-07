import React, { useMemo } from 'react';
import { useGame } from '../contexts/GameContext';
import { QuestCard } from './QuestCard';
import { LogOut, Trophy, Clock } from 'lucide-react';

const renderAvatar = (avatarStr: string) => {
    if (avatarStr.startsWith('/')) {
        return <img src={avatarStr} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />;
    }
    return <div style={{ fontSize: '3rem' }}>{avatarStr}</div>;
};

export const QuestBoard: React.FC = () => {
    const { users, quests, currentUser, selectUser, acceptQuest, markQuestDone } = useGame();

    const user = users.find(u => u.id === currentUser);

    const { activeQuests, availableQuests, pendingQuests } = useMemo(() => {
        if (!user) return { activeQuests: [], availableQuests: [], pendingQuests: [] };

        const active = quests.filter(q => user.activeQuestIds.includes(q.id));
        const pending = quests.filter(q => (user.pendingQuestIds || []).includes(q.id));

        const available = quests.filter(q => {
            if (user.activeQuestIds.includes(q.id)) return false;
            if ((user.pendingQuestIds || []).includes(q.id)) return false;
            if (user.completedQuestIds.includes(q.id) && !q.isRepeatable) return false;
            return true;
        });

        return { activeQuests: active, availableQuests: available, pendingQuests: pending };
    }, [quests, user]);

    if (!user) return null;

    return (
        <div className="layout-container">
            {/* Header */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                padding: '20px',
                background: 'var(--bg-glass)',
                borderRadius: 'var(--radius-md)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.6)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
                        {renderAvatar(user.avatar)}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', lineHeight: 1 }}>{user.name}</h2>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'var(--accent)',
                            fontWeight: 800,
                            fontSize: '1.2rem',
                            marginTop: '5px'
                        }}>
                            <Trophy size={20} style={{ marginRight: '5px' }} />
                            <span>{user.totalPoints} pts</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => selectUser(null as any)}
                    style={{
                        padding: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#e2e8f0',
                        color: 'var(--text-muted)'
                    }}
                >
                    <LogOut size={24} />
                </button>
            </header>

            {/* Pending (Warning: only if pending exists) */}
            {pendingQuests.length > 0 && (
                <section style={{ marginBottom: '40px', opacity: 0.8 }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--text-muted)', display: 'flex', gap: '10px' }}>
                        <Clock /> Waiting for Approval
                    </h2>
                    <div>
                        {pendingQuests.map(quest => (
                            <QuestCard
                                key={quest.id}
                                quest={quest}
                                userStatus="pending_verification"
                                onAction={() => { }}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Active Quests Section */}
            <section style={{ marginBottom: '40px' }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    marginBottom: '20px',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    In Progress
                </h2>

                {activeQuests.length === 0 && pendingQuests.length === 0 ? (
                    <div style={{
                        padding: '40px',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        borderRadius: 'var(--radius-md)',
                        borderStyle: 'dashed',
                        borderWidth: '2px'
                    }}>
                        No active quests. Pick one below!
                    </div>
                ) : (
                    <div>
                        {activeQuests.map(quest => (
                            <QuestCard
                                key={quest.id}
                                quest={quest}
                                userStatus="active"
                                onAction={() => markQuestDone(quest.id)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Available Quests Section */}
            <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--text-main)' }}>Available Quests</h2>
                <div>
                    {availableQuests.map(quest => (
                        <QuestCard
                            key={quest.id}
                            quest={quest}
                            userStatus="available"
                            onAction={() => acceptQuest(quest.id)}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};
