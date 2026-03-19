"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { API } from "@/lib/api/handler"

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submittedEmail, setSubmittedEmail] = useState("")
    const { toast } = useToast()

    const form = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async (data: ForgotPasswordForm) => {
        setIsLoading(true)
        try {
            const { data: res } = await API.forgetPassword(data.email)
            if (res.success) {
                setSubmittedEmail(data.email)
                setIsSubmitted(true)
                toast({
                    title: "Email sent",
                    description: "Check your inbox for the password reset link",
                })
            } else {
                throw new Error(res.message || "Failed to send reset email")
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

    if (isSubmitted) {
        return (
            <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2 className="size-7 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    We&apos;ve sent a password reset link to
                </p>
                <p className="mt-1 text-sm font-medium">{submittedEmail}</p>

                <div className="mt-6 rounded-xl bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                        Click the link in the email to reset your password. If you don&apos;t see it, check your spam folder.
                    </p>
                </div>

                <div className="mt-6 space-y-3">
                    <Link href="/auth/login" className="block">
                        <Button variant="outline" className="w-full rounded-xl">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to login
                        </Button>
                    </Link>

                    <p className="text-sm text-muted-foreground">
                        Didn&apos;t receive the email?{" "}
                        <button
                            className="font-medium text-primary hover:underline"
                            onClick={() => {
                                setIsSubmitted(false)
                                form.reset()
                            }}
                        >
                            Try again
                        </button>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-border/50 bg-card p-8">
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <Mail className="size-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Forgot password?</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                    Enter your email and we&apos;ll send you a reset link
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium">Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="you@example.com"
                                            className="rounded-xl pl-10"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full rounded-xl font-medium shadow-sm shadow-primary/20"
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending..." : "Send reset link"}
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