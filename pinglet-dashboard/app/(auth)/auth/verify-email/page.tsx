"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Mail } from "lucide-react"

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
      window.location.href = "/u/dashboard"
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
    <div className="rounded-2xl border border-border/50 bg-card p-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Mail className="size-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Verify Your Email</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          We&apos;ve sent a 6-digit verification code to your email
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Verification Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="000000"
                    className="rounded-xl text-center text-lg tracking-[0.5em] font-mono"
                    maxLength={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full rounded-xl font-medium shadow-sm shadow-primary/20"
          >
            Verify Email
          </Button>
        </form>
      </Form>

      <div className="mt-4 text-center">
        <button
          onClick={resendOtp}
          className="text-sm text-primary hover:underline"
        >
          Resend verification code
        </button>
      </div>
    </div>
  )
}
