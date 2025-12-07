import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { PinPad } from './PinPad';
import { ShieldCheck } from 'lucide-react';

export const AdminSetup: React.FC = () => {
    const { createUser } = useGame();
    const [step, setStep] = useState<'welcome' | 'name' | 'pin'>('welcome');
    const [name, setName] = useState('');

    const handlePinSuccess = (pin: string) => {
        // Validate pin? 
        // Create admin user
        createUser(name, '🛡️', 'admin', pin);
    };

    return (
        <div className="layout-container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="card" style={{ padding: '40px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>

                {step === 'welcome' && (
                    <>
                        <div style={{ color: 'var(--primary)', marginBottom: '20px' }}><ShieldCheck size={64} /></div>
                        <h1 style={{ marginBottom: '10px' }}>Welcome to HomeQuest</h1>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                            To get started, we need to set up a **Parent Account**. This account will approve quests and manage settings.
                        </p>
                        <button className="btn-primary" onClick={() => setStep('name')}>Get Started</button>
                    </>
                )}

                {step === 'name' && (
                    <>
                        <h2 style={{ marginBottom: '20px' }}>What's your name?</h2>
                        <input
                            autoFocus
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Mom, Dad, Captain"
                            style={{
                                width: '100%',
                                padding: '15px',
                                fontSize: '1.2rem',
                                borderRadius: '12px',
                                border: '1px solid #ddd',
                                marginBottom: '20px'
                            }}
                        />
                        <button
                            className="btn-primary"
                            disabled={!name.trim()}
                            onClick={() => setStep('pin')}
                            style={{ width: '100%' }}
                        >
                            Next
                        </button>
                    </>
                )}

                {step === 'pin' && (
                    <PinPad
                        title={`Set PIN for ${name}`}
                        onSuccess={handlePinSuccess}
                    />
                )}

            </div>
        </div>
    );
};
