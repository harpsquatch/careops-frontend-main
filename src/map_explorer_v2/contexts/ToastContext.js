import React, { createContext, useContext, useState, useCallback } from 'react';
import styled from 'styled-components';
import Toast from '../atoms/Toast';
import { S } from '../constants';

const Container = styled.div`
    position: fixed;
    bottom: ${S.lg};
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: ${S.sm};
    align-items: center;
    pointer-events: none;
    max-width: calc(100vw - ${S.xl} * 2);
`;

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        const newToast = { id, message, type };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const value = {
        toast: {
            success: (msg, duration) => showToast(msg, 'success', duration),
            error: (msg, duration) => showToast(msg, 'error', duration),
            info: (msg, duration) => showToast(msg, 'info', duration),
        },
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Container>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </Container>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

