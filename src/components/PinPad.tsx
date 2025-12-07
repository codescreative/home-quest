import React, { useState } from 'react';
import { Delete } from 'lucide-react';

interface PinPadProps {
    onSuccess: (pin: string) => void;
    title?: string;
    isSettingUp?: boolean; // If true, might ask to confirm (omitted for speed in V1)
}

export const PinPad: React.FC<PinPadProps> = ({ onSuccess, title = "Enter PIN" }) => {
    const [pin, setPin] = useState('');

    const handleNum = (num: number) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            if (newPin.length === 4) {
                // Small delay for UX
                setTimeout(() => onSuccess(newPin), 300);
            }
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    return (
        <div style={{ textAlign: 'center', maxWidth: '300px', margin: '0 auto' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>{title}</h3>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '15px',
                marginBottom: '30px',
                height: '20px'
            }}>
                {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: i < pin.length ? 'var(--primary)' : '#cbd5e1',
                        transition: 'background-color 0.2s'
                    }} />
                ))}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px'
            }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                        key={num}
                        onClick={() => handleNum(num)}
                        style={{
                            width: '100%',
                            aspectRatio: '1',
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            backgroundColor: 'var(--bg-card)',
                            borderRadius: '50%',
                            boxShadow: 'var(--shadow-sm)',
                            color: 'var(--text-main)'
                        }}
                    >
                        {num}
                    </button>
                ))}

                <div /> {/* Spacer */}

                <button
                    onClick={() => handleNum(0)}
                    style={{
                        width: '100%',
                        aspectRatio: '1',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: '50%',
                        boxShadow: 'var(--shadow-sm)',
                        color: 'var(--text-main)'
                    }}
                >
                    0
                </button>

                <button
                    onClick={handleDelete}
                    style={{
                        width: '100%',
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                        color: 'var(--text-muted)'
                    }}
                >
                    <Delete size={24} />
                </button>
            </div>
        </div>
    );
};
