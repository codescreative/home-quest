import React from 'react';
import { Quest, QuestStatus } from '../types';
import { Bed, Utensils, BookOpen, Dog, Star, CheckCircle, Clock } from 'lucide-react';

const IconMap: Record<string, React.FC<{ size?: number; color?: string }>> = {
    Bed,
    Utensils,
    BookOpen,
    Dog,
    Star
};

interface QuestCardProps {
    quest: Quest;
    userStatus: 'available' | 'active' | 'completed' | 'pending_verification';
    onAction: () => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, userStatus, onAction }) => {
    const Icon = (quest.icon && IconMap[quest.icon]) ? IconMap[quest.icon] : Star;

    const isPending = userStatus === 'pending_verification';
    const isCompleted = userStatus === 'completed';
    const isActive = userStatus === 'active';

    return (
        <div className="card" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '20px',
            marginBottom: '15px',
            borderLeft: isCompleted ? '5px solid #22c55e' :
                isActive ? '5px solid var(--primary)' :
                    isPending ? '5px solid #fbbf24' : '5px solid #e2e8f0',
            opacity: (isCompleted || isPending) ? 0.8 : 1
        }}>
            <div style={{
                padding: '15px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-app)',
                marginRight: '20px',
                color: 'var(--primary)'
            }}>
                <Icon size={32} />
            </div>

            <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '5px' }}>{quest.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{quest.description}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}>
                    <span>+{quest.rewardPoints}</span>
                    <Star size={16} fill="var(--accent)" />
                </div>

                {userStatus === 'available' && (
                    <button onClick={onAction} className="btn-primary" style={{ padding: '8px 16px', fontSize: '1rem' }}>
                        Accept
                    </button>
                )}

                {isActive && (
                    <button
                        onClick={onAction}
                        className="btn-primary"
                        style={{
                            padding: '8px 16px',
                            fontSize: '1rem',
                            backgroundColor: '#22c55e',
                            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                        }}
                    >
                        I'm Done!
                    </button>
                )}

                {isPending && (
                    <div style={{ color: '#fbbf24', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={20} /> Waiting...
                    </div>
                )}

                {isCompleted && (
                    <div style={{ color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CheckCircle size={20} /> Done
                    </div>
                )}
            </div>
        </div>
    );
};
