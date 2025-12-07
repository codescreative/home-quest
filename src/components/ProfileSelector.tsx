import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Plus } from 'lucide-react';
import { PinPad } from './PinPad';

// Config for new avatars
const AVATAR_OPTIONS = [
    { id: 'boy', src: '/avatars/boy.png', label: 'Demon Slayer Boy' },
    { id: 'girl', src: '/avatars/girl.png', label: 'Demon Slayer Girl' },
    { id: 'boar', src: '/avatars/boar.png', label: 'Boar Mask' },
    { id: 'fox', src: '/avatars/fox.png', label: 'Fox Mask' },
];

export const ProfileSelector: React.FC = () => {
    const { users, selectUser, createUser } = useGame();

    const [mode, setMode] = useState<'selecting' | 'admin_auth' | 'creating_user'>('selecting');

    const [newName, setNewName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].src);

    const handleAdminSuccess = (pin: string) => {
        const admin = users.find(u => u.role === 'admin');
        if (admin && admin.pin === pin) {
            setMode('creating_user');
        } else {
            alert('Incorrect PIN');
        }
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim()) {
            createUser(newName, selectedAvatar, 'child');
            setMode('selecting');
            setNewName('');
        }
    };

    const renderAvatar = (avatarStr: string) => {
        // Check if it's an image path (starts with /) or emoji
        if (avatarStr.startsWith('/')) {
            return <img src={avatarStr} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />;
        }
        return <div style={{ fontSize: '4rem' }}>{avatarStr}</div>;
    };

    return (
        <div className="layout-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '10px' }}>HomeQuest</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Who is questing today?</p>
            </div>

            {mode === 'selecting' && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '20px',
                    width: '100%',
                    maxWidth: '800px'
                }}>
                    {users.map(user => (
                        <button
                            key={user.id}
                            className="card"
                            onClick={() => selectUser(user.id)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '30px',
                                border: '2px solid transparent',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                        >
                            {user.role === 'admin' && (
                                <div style={{ position: 'absolute', top: 10, right: 10, fontSize: '1rem' }}>🛡️</div>
                            )}
                            <div style={{ width: '80px', height: '80px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {renderAvatar(user.avatar)}
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{user.name}</span>
                            {user.role === 'child' && (
                                <div style={{
                                    marginTop: '10px',
                                    padding: '4px 12px',
                                    backgroundColor: 'rgba(234, 179, 8, 0.2)',
                                    color: 'var(--text-main)',
                                    borderRadius: '20px',
                                    fontWeight: 700
                                }}>
                                    {user.totalPoints} pts
                                </div>
                            )}
                        </button>
                    ))}

                    <button
                        className="card"
                        onClick={() => setMode('admin_auth')}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '30px',
                            border: '2px dashed var(--text-muted)',
                            backgroundColor: 'transparent',
                            opacity: 0.7
                        }}
                    >
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '10px'
                        }}>
                            <Plus size={40} color="var(--text-muted)" />
                        </div>
                        <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Parent Access</span>
                    </button>
                </div>
            )}

            {mode === 'admin_auth' && (
                <div className="card" style={{ padding: '40px' }}>
                    <PinPad title="Parent Approval Required" onSuccess={handleAdminSuccess} />
                    <button
                        onClick={() => setMode('selecting')}
                        style={{ marginTop: '20px', color: 'var(--text-muted)', textDecoration: 'underline', width: '100%' }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {mode === 'creating_user' && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    backdropFilter: 'blur(5px)'
                }}>
                    <form onSubmit={handleCreate} className="card" style={{ padding: '30px', width: '90%', maxWidth: '500px' }}>
                        <h2 style={{ marginBottom: '20px' }}>New Hero Profile</h2>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 500 }}>Choose Hero Avatar</label>
                            <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                                {AVATAR_OPTIONS.map(opt => (
                                    <button
                                        type="button"
                                        key={opt.id}
                                        onClick={() => setSelectedAvatar(opt.src)}
                                        style={{
                                            padding: '5px',
                                            borderRadius: '12px',
                                            backgroundColor: selectedAvatar === opt.src ? 'var(--primary)' : 'transparent',
                                            border: selectedAvatar === opt.src ? 'none' : '1px solid #ddd',
                                            flexShrink: 0,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <img
                                            src={opt.src}
                                            alt={opt.label}
                                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 500 }}>Hero Name</label>
                            <input
                                autoFocus
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="Name"
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    border: '1px solid #ccc',
                                    fontSize: '1.1rem'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setMode('selecting')}
                                className="btn-primary"
                                style={{ flex: 1, backgroundColor: '#94a3b8', boxShadow: 'none' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ flex: 1 }}
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};
