"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API } from '@/lib/api/handler';


const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const { data: res } = await API.resetPassword(data.email);
      if (res.success) {
        setIsSubmitted(true);
      } else {
        setError('root', { message: 'Failed to send reset email' });
      }
    } catch (error) {
      setError('root', { message: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="size-7 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ve sent a password reset link to your email address
        </p>

        <Link
          href="/auth/login"
          className="mt-6 inline-flex items-center text-sm text-primary hover:underline"
        >
          <ArrowLeft className="mr-1.5 size-3.5" />
          Back to login
        </Link>
      </div>
    );
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="rounded-xl pl-10"
            />
          </div>
          {errors.email?.message && (
            <p className="mt-1.5 text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {errors.root && (
          <p className="text-center text-sm text-destructive">{errors.root.message}</p>
        )}

        <Button
          type="submit"
          className="w-full rounded-xl font-medium shadow-sm shadow-primary/20"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>

        <div className="text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="mr-1.5 size-3.5" />
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}