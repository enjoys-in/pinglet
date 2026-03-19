"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, ArrowLeft, Sparkles, AlertTriangle } from "lucide-react"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Global error:", error)
    }, [error])

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
            {/* Subtle grid background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            <div className="relative flex flex-col items-center text-center max-w-lg">
                {/* Brand icon */}
                <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-8">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>

                {/* Error icon */}
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>

                {/* Message */}
                <h1 className="text-2xl font-bold text-foreground">
                    Something went wrong
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                    An unexpected error occurred. Our team has been notified. You can try again or go back.
                </p>

                {error.digest && (
                    <p className="text-xs text-muted-foreground/60 mt-3 font-mono">
                        Error ID: {error.digest}
                    </p>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-8">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </Button>
                    <Button onClick={reset} className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </Button>
                </div>
            </div>
        </div>
    )
}
