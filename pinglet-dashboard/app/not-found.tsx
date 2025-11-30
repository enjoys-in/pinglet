"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
            <Card className="w-full max-w-2xl border-2 shadow-2xl">
                <CardContent className="pt-12 pb-12 px-8">
                    <div className="flex flex-col items-center text-center space-y-8">
                        {/* 404 Animation */}
                        <div className="relative">
                            <div className="text-[150px] md:text-[200px] font-bold leading-none bg-gradient-to-br from-primary via-primary to-primary/60 bg-clip-text text-transparent animate-pulse">
                                404
                            </div>
                            <div className="absolute inset-0 blur-3xl bg-primary/20 -z-10 animate-pulse"></div>
                        </div>

                        {/* Icon */}
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center animate-bounce">
                            <Search className="w-10 h-10 text-muted-foreground" />
                        </div>

                        {/* Text Content */}
                        <div className="space-y-3 max-w-md">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                                Page Not Found
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Oops! The page you're looking for doesn't exist or has been moved.
                            </p>
                        </div>

                        {/* Helpful Info */}
                        <div className="bg-muted/50 p-6 rounded-lg max-w-md w-full">
                            <p className="text-sm text-muted-foreground">
                                This could be because:
                            </p>
                            <ul className="mt-3 space-y-2 text-sm text-muted-foreground text-left list-disc list-inside">
                                <li>The URL was typed incorrectly</li>
                                <li>The page has been removed or relocated</li>
                                <li>You followed an outdated link</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md pt-4">
                            <Link href="/" className="flex-1">
                                <Button className="w-full" size="lg">
                                    <Home className="mr-2 h-5 w-5" />
                                    Go to Homepage
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => window.history.back()}
                                className="flex-1"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Go Back
                            </Button>
                        </div>

                        {/* Additional Help */}
                        <div className="text-sm text-muted-foreground pt-4">
                            Need help?{" "}
                            <Link href="/support" className="text-primary hover:underline font-medium">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
