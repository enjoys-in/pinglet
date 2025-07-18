"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
})

type OtpForm = z.infer<typeof otpSchema>

export default function VerifyEmailPage() {
  const { toast } = useToast()

  const form = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  const onSubmit = async (data: OtpForm) => {
    try {
      console.log("OTP data:", data)
      toast({
        title: "Email verified successfully!",
        description: "Welcome to Pinglet!",
      })
      // Redirect to dashboard
      window.location.href = "/dashboard"
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Please check your OTP and try again.",
        variant: "destructive",
      })
    }
  }

  const resendOtp = () => {
    toast({
      title: "OTP Resent",
      description: "A new verification code has been sent to your email.",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>We've sent a 6-digit verification code to your email address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter 6-digit code"
                        className="text-center text-lg tracking-widest"
                        maxLength={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Verify Email
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <Button variant="ghost" onClick={resendOtp}>
              Resend verification code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
