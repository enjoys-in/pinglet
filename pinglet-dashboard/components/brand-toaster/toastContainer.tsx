"use client"
import React, { useState, useCallback } from 'react';
import PingletToast, { ToastProps } from './pingletToast'

interface Toast extends Omit<ToastProps, 'onClose'> {
    id: string;
}

interface ToastContainerProps {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
    maxToasts?: number;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
    position = 'top-right',
    maxToasts = 5
}) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };

        setToasts(prev => {
            const updated = [newToast, ...prev];
            return updated.slice(0, maxToasts);
        });
    }, [maxToasts]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const getPositionClasses = () => {
        switch (position) {
            case 'top-left':
                return 'top-4 left-4';
            case 'top-center':
                return 'top-4 left-1/2 transform -translate-x-1/2';
            case 'top-right':
                return 'top-4 right-4';
            case 'bottom-left':
                return 'bottom-4 left-4';
            case 'bottom-center':
                return 'bottom-4 left-1/2 transform -translate-x-1/2';
            case 'bottom-right':
                return 'bottom-4 right-4';
            default:
                return 'top-4 right-4';
        }
    };

    // Expose addToast function globally for easy access
    React.useEffect(() => {
        (window as any).pingletToast = addToast;
        return () => {
            delete (window as any).pingletToast;
        };
    }, [addToast]);

    return (
        <div className={`fixed ${getPositionClasses()} z-50 space-y-2`}>
            {toasts.map((toast) => (
                <PingletToast
                    key={toast.id}
                    {...toast}
                    onClose={removeToast}
                />
            ))}
        </div>
    );
};

export default ToastContainer;

// Helper function to show toasts programmatically
export const showToast = (toast: Omit<Toast, 'id'>) => {
    if ((window as any).pingletToast) {
        (window as any).pingletToast(toast);
    }
};