import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ResetPasswordPage() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
        <Lock className="size-5 text-primary" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Please use the link sent to your email to reset your password.
      </p>
      <div className="mt-6 space-y-3">
        <Link href="/forgot-password" className="block">
          <Button className="w-full rounded-xl font-medium shadow-sm shadow-primary/20">
            Request Reset Link
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
