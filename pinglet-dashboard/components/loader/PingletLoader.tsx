import React from 'react';
import { Bell, Zap } from 'lucide-react';

interface PingletLoaderProps {
    variant?: 'page' | 'component' | 'small';
    message?: string;
    showBrand?: boolean;
}

const PingletLoader: React.FC<PingletLoaderProps> = ({
    variant = 'component',
    message = 'Loading notifications...',
    showBrand = true
}) => {
    const getContainerClasses = () => {
        switch (variant) {
            case 'page':
                return 'fixed inset-0 bg-white bg-opacity-95 dark:bg-opacity-90 dark:bg-gray-900 backdrop-blur-sm flex items-center justify-center z-50';
            case 'small':
                return 'flex items-center justify-center p-4';
            default:
                return 'flex items-center justify-center p-8';
        }
    };

    const getLoaderSize = () => {
        switch (variant) {
            case 'page':
                return 'w-16 h-16';
            case 'small':
                return 'w-6 h-6';
            default:
                return 'w-12 h-12';
        }
    };

    const getTextSize = () => {
        switch (variant) {
            case 'page':
                return 'text-xl';
            case 'small':
                return 'text-sm';
            default:
                return 'text-lg';
        }
    };

    return (
        <div className={getContainerClasses()}>
            <div className="flex flex-col items-center space-y-4">
                {/* Main loader animation */}
                <div className="relative">
                    {/* Outer rotating ring */}
                    <div className={`${getLoaderSize()} relative`}>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-blue-400 border-l-purple-400 animate-spin animation-delay-150" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>

                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            <Bell className={`${variant === 'small' ? 'w-3 h-3' : variant === 'page' ? 'w-8 h-8' : 'w-6 h-6'} text-blue-600 animate-pulse`} />
                            <Zap className={`absolute -top-1 -right-1 ${variant === 'small' ? 'w-2 h-2' : variant === 'page' ? 'w-4 h-4' : 'w-3 h-3'} text-yellow-500 animate-bounce`} />
                        </div>
                    </div>
                </div>

                {/* Brand and message */}
                {showBrand && (
                    <div className="text-center space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${variant === 'small' ? 'text-lg' : variant === 'page' ? 'text-2xl' : 'text-xl'}`}>
                                Pinglet
                            </span>
                            {variant !== 'small' && (
                                <span className={`text-gray-500 ${variant === 'page' ? 'text-lg' : 'text-base'}`}>
                                    Push Notifications
                                </span>
                            )}
                        </div>

                        {message && variant !== 'small' && (
                            <p className={`text-gray-600 ${getTextSize()} animate-pulse`}>
                                {message}
                            </p>
                        )}
                    </div>
                )}

                {/* Loading dots indicator */}
                {variant !== 'small' && (
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-100"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PingletLoader;