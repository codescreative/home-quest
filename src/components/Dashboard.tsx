import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { StickyQuestCard } from './StickyQuestCard';
import { Plus } from 'lucide-react';
import { PinPad } from './PinPad';

// Helper for rendering avatar (image vs emoji)
const renderAvatar = (avatarStr: string) => {
    if (avatarStr.startsWith('/')) {
        return <img src={avatarStr} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />;
    }
    return <div style={{ fontSize: '3rem' }}>{avatarStr}</div>; // Sized relative to container usually
};

export const Dashboard: React.FC = () => {
    const { users, quests, selectUser } = useGame();

    const [adminMode, setAdminMode] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Note: Creation logic is minimal here to avoid code duplication with ProfileSelector. 
    // Ideally we refactor 'ProfileCreator' to a separate component. 
    // For V2, we assume creation happens via "Add Profile" which routes to simpler flow or reusing ProfileSelector.
    // Actually, clicking "Add" (New) on Dashboard should probably just trigger the generic 'Admin Mode' -> 'Create' flow.
    // I will leave the "New" button logic simple: Alert "Use Profile Screen to add users" or redirect?
    // Since `ProfileSelector` is the fallback login screen, let's keep it simple.

    return (
        <div className="layout-container" style={{ padding: '0' }}>

            {/* Top Section: Profiles (Horizontal Scroll) */}
            <div style={{
                padding: '20px',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0))',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <h2 style={{ marginBottom: '10px', color: 'var(--text-muted)' }}>Heroes</h2>
                <div style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '15px',
                    paddingBottom: '10px',
                    scrollbarWidth: 'none'
                }}>
                    {users.map(user => (
                        <button
                            key={user.id}
                            onClick={() => selectUser(user.id)}
                            style={{
                                flex: '0 0 auto',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                minWidth: '80px',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                background: 'white',
                                borderRadius: '50%',
                                width: '70px',
                                height: '70px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                marginBottom: '5px',
                                border: user.role === 'admin' ? '2px solid gold' : 'none',
                                overflow: 'hidden'
                            }}>
                                {renderAvatar(user.avatar)}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</span>
                        </button>
                    ))}

                    {/* Add Profile Btn - Placeholder for V2 */}
                    <button
                        onClick={() => alert('Please log out to add new profiles!')}
                        style={{
                            flex: '0 0 auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: '80px',
                            opacity: 0.6
                        }}
                    >
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            border: '2px dashed #999',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '5px'
                        }}>
                            <Plus />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>New</span>
                    </button>
                </div>
            </div>

            {/* Main Board: Sticky Notes */}
            <div style={{ padding: '20px' }}>
                <h2 style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>Quest Board</h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '20px'
                }}>
                    {quests.map(quest => (
                        <StickyQuestCard
                            key={quest.id}
                            quest={quest}
                            onAccept={() => {
                                alert('Select your Hero from the top bar first!');
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
