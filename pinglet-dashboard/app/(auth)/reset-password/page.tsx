"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react"
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

export default function ResetPasswordPage() {
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
        // Check if token and email exist in URL
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
                // Redirect to login after 3 seconds
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

    // Show error state if token is invalid
    if (tokenError) {
        return (
            <Card className="w-full">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Invalid Reset Link</CardTitle>
                    <CardDescription className="text-center">
                        {tokenError}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                            The password reset link may have expired or is invalid. Please request a new password reset link.
                        </p>
                    </div>

                    <Link href="/forgot-password" className="block">
                        <Button className="w-full">
                            Request New Reset Link
                        </Button>
                    </Link>

                    <div className="text-center">
                        <Link href="/auth/login" className="text-sm text-primary hover:underline">
                            Back to login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Show success state
    if (isSuccess) {
        return (
            <Card className="w-full">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Password Reset Successful</CardTitle>
                    <CardDescription className="text-center">
                        Your password has been reset successfully
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground text-center">
                            Redirecting you to login page...
                        </p>
                    </div>

                    <Link href="/auth/login" className="block">
                        <Button className="w-full">
                            Go to Login
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    // Show reset password form
    return (
        <Card className="w-full">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Lock className="text-primary-foreground h-6 w-6" />
                    </div>
                </div>
                <CardTitle className="text-2xl text-center">Reset your password</CardTitle>
                <CardDescription className="text-center">
                    Enter your new password below
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                                className="pl-10 pr-10"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
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
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm new password"
                                                className="pl-10 pr-10"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="bg-muted p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground">
                                Password must be at least 8 characters long
                            </p>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Resetting password..." : "Reset Password"}
                        </Button>
                    </form>
                </Form>

                <div className="text-center">
                    <Link href="/auth/login" className="text-sm text-primary hover:underline">
                        Back to login
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}