import React, { useState } from 'react';
import { Quest } from '../types';
import { Star } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

interface StickyQuestCardProps {
    quest: Quest;
    onAccept: () => void;
}

const renderAvatar = (avatarStr: string) => {
    if (avatarStr.startsWith('/')) {
        return <img src={avatarStr} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />;
    }
    return <span>{avatarStr}</span>;
};

export const StickyQuestCard: React.FC<StickyQuestCardProps> = ({ quest, onAccept }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const { users } = useGame();

    // Find who is working on this
    const activeUsers = users.filter(u => u.activeQuestIds.includes(quest.id));

    // Random rotation for "messy" look
    const rotation = Math.floor(Math.random() * 6) - 3;

    return (
        <div
            style={{
                perspective: '1000px',
                width: '100%',
                height: '250px',
                margin: '10px'
            }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : `rotate(${rotation}deg)`,
                cursor: 'pointer'
            }}>

                {/* FRONT */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: '#fef3c7', // Yellow-100
                    padding: '20px',
                    boxShadow: '2px 4px 8px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    fontFamily: '"Kalam", cursive, sans-serif'
                }}>
                    <div>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            borderRadius: '50%',
                            marginBottom: '10px'
                        }} />
                        <h3 style={{ fontSize: '1.4rem', lineHeight: 1.2, color: '#451a03' }}>{quest.title}</h3>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', color: '#b45309' }}>
                            <Star size={20} fill="#b45309" /> {quest.rewardPoints}
                        </div>
                        {activeUsers.length > 0 && (
                            <div style={{ display: 'flex', gap: '-8px' }}>
                                {activeUsers.slice(0, 3).map(u => (
                                    <div key={u.id} style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        backgroundColor: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem',
                                        border: '2px solid #fef3c7',
                                        marginLeft: '-10px',
                                        overflow: 'hidden'
                                    }}>
                                        {renderAvatar(u.avatar)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#92400e', marginTop: '10px' }}>
                        Tap to see details
                    </div>
                </div>

                {/* BACK */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: '#fffbeb', // Slightly lighter yellow
                    padding: '20px',
                    transform: 'rotateY(180deg)',
                    boxShadow: '2px 4px 8px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{quest.title}</h3>
                        <p style={{ color: '#78350f' }}>{quest.description}</p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAccept();
                        }}
                        className="btn-primary"
                        style={{ width: '100%' }}
                    >
                        I'll do it!
                    </button>
                </div>

            </div>
        </div>
    );
};
