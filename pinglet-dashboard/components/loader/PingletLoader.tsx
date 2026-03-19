import React from 'react';
import { Sparkles } from 'lucide-react';

interface PingletLoaderProps {
    variant?: 'page' | 'component' | 'small';
    message?: string;
    showBrand?: boolean;
}

const PingletLoader: React.FC<PingletLoaderProps> = ({
    variant = 'component',
    message = 'Loading...',
    showBrand = true
}) => {
    const isPage = variant === 'page';
    const isSmall = variant === 'small';

    const containerCls = isPage
        ? 'fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50'
        : isSmall
            ? 'flex items-center justify-center p-4'
            : 'flex items-center justify-center p-8';

    const ringSize = isPage ? 'w-14 h-14' : isSmall ? 'w-6 h-6' : 'w-10 h-10';
    const iconSize = isPage ? 'w-5 h-5' : isSmall ? 'w-3 h-3' : 'w-4 h-4';

    return (
        <div className={containerCls}>
            <div className="flex flex-col items-center gap-5">
                {/* Spinner */}
                <div className="relative">
                    <div className={`${ringSize} relative`}>
                        <div className="absolute inset-0 rounded-full border-2 border-primary/10" />
                        <div
                            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"
                            style={{ animationDuration: '0.8s' }}
                        />
                        {!isSmall && (
                            <div
                                className="absolute inset-[4px] rounded-full border-[1.5px] border-transparent border-b-primary/40 animate-spin"
                                style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
                            />
                        )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className={`${iconSize} text-primary animate-pulse`} style={{ animationDuration: '2s' }} />
                    </div>
                </div>

                {/* Brand + message */}
                {showBrand && !isSmall && (
                    <div className="text-center space-y-2">
                        <span className="font-semibold text-foreground/90 text-sm tracking-wide">
                            Pinglet
                        </span>
                        {message && (
                            <p className="text-xs text-muted-foreground/70">
                                {message}
                            </p>
                        )}
                    </div>
                )}

                {/* Progress bar */}
                {!isSmall && (
                    <div className="w-24 h-[2px] rounded-full bg-primary/10 overflow-hidden">
                        <div
                            className="h-full w-2/5 rounded-full bg-primary/50 animate-[shimmer_1.5s_ease-in-out_infinite]"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PingletLoader;