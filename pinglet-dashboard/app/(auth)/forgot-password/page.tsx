"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
            <Card className="w-full">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Check your email</CardTitle>
                    <CardDescription className="text-center">
                        We've sent a password reset link to
                    </CardDescription>
                    <p className="text-center font-medium text-sm">{submittedEmail}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                            Click the link in the email to reset your password. If you don't see the email, check your spam folder.
                        </p>
                    </div>

                    <Link href="/auth/login" className="block">
                        <Button variant="outline" className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to login
                        </Button>
                    </Link>

                    <div className="text-center text-sm text-muted-foreground">
                        Didn't receive the email?{" "}
                        <Button
                            variant="link"
                            className="p-0 h-auto font-normal text-primary hover:underline"
                            onClick={() => {
                                setIsSubmitted(false)
                                form.reset()
                            }}
                        >
                            Try again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Mail className="text-primary-foreground h-6 w-6" />
                    </div>
                </div>
                <CardTitle className="text-2xl text-center">Forgot password?</CardTitle>
                <CardDescription className="text-center">
                    Enter your email address and we'll send you a link to reset your password
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Enter your email"
                                                className="pl-10"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send reset link"}
                        </Button>
                    </form>
                </Form>

                <div className="text-center">
                    <Link href="/auth/login" className="inline-flex items-center text-sm text-primary hover:underline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to login
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}