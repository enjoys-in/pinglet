"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { API } from "@/lib/api/handler"

const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [tokenError, setTokenError] = useState<string | null>(null)
    const { toast } = useToast()
    const router = useRouter()
    const searchParams = useSearchParams()

    const token = searchParams.get("token")
    const email = searchParams.get("email")

    useEffect(() => {
        if (!token || !email) {
            setTokenError("Invalid or missing reset link. Please request a new password reset.")
        }
    }, [token, email])

    const form = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (data: ResetPasswordForm) => {
        if (!token || !email) {
            toast({
                title: "Error",
                description: "Invalid reset link",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)
        try {
            const { data: res } = await API.resetPassword(token, email, { password: data.password, confirmPassword: data.confirmPassword })
            if (res.success) {
                setIsSuccess(true)
                toast({
                    title: "Success",
                    description: "Your password has been reset successfully",
                })
                setTimeout(() => {
                    router.push("/auth/login")
                }, 3000)
            } else {
                throw new Error(res.message || "Failed to reset password")
            }
        } catch (error: Error | any) {
            toast({
                title: "Error",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (tokenError) {
        return (
            <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="size-7 text-destructive" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Invalid Reset Link</h1>
                <p className="mt-2 text-sm text-muted-foreground">{tokenError}</p>

                <div className="mt-6 rounded-xl bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                        The password reset link may have expired or is invalid. Please request a new one.
                    </p>
                </div>

                <div className="mt-6 space-y-3">
                    <Link href="/forgot-password" className="block">
                        <Button className="w-full rounded-xl font-medium shadow-sm shadow-primary/20">
                            Request New Reset Link
                        </Button>
                    </Link>
                    <Link href="/auth/login" className="inline-flex items-center text-sm text-primary hover:underline">
                        <ArrowLeft className="mr-1.5 size-3.5" />
                        Back to login
                    </Link>
                </div>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2 className="size-7 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Password Reset Successful</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Your password has been reset successfully
                </p>

                <div className="mt-6 rounded-xl bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">Redirecting you to login page...</p>
                </div>

                <Link href="/auth/login" className="mt-4 block">
                    <Button className="w-full rounded-xl font-medium shadow-sm shadow-primary/20">
                        Go to Login
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-border/50 bg-card p-8">
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <Lock className="size-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">Enter your new password below</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium">New Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            className="rounded-xl pl-10 pr-10"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            className="rounded-xl pl-10 pr-10"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="rounded-xl bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">
                            Password must be at least 8 characters long
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full rounded-xl font-medium shadow-sm shadow-primary/20"
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting password..." : "Reset Password"}
                    </Button>
                </form>
            </Form>

            <div className="mt-6 text-center">
                <Link href="/auth/login" className="inline-flex items-center text-sm text-primary hover:underline">
                    <ArrowLeft className="mr-1.5 size-3.5" />
                    Back to login
                </Link>
            </div>
        </div>
    )
}