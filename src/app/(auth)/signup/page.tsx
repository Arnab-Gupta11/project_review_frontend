"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserCheck, ArrowRight } from "lucide-react";

import InputField from "@/components/dashboard/Fields/InputField/InputField";
import DynamicActionButton from "@/components/dashboard/DynamicActionButton/DynamicActionButton";
import { useRegisterMutation } from "@/redux/features/auth/auth.api";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(60, "Name cannot exceed 60 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function StudentSignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const res: any = await registerUser({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
      }).unwrap();

      const rawUser = res?.data?.user || res?.data;
      const user = {
        id: rawUser?.id || rawUser?._id,
        name: rawUser?.name,
        email: rawUser?.email,
        role: rawUser?.role || "STUDENT",
      };

      dispatch(setCredentials({ user }));
      await import("@/services/auth/auth.service").then((m) =>
        m.setUserProfile(user),
      );

      toast.success(
        res?.message || `Welcome ${data.name}! Registration successful.`,
      );
      router.push("/student");
    } catch (error: any) {
      const errorMsg =
        error?.data?.message ||
        error?.data?.error?.message ||
        error?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="relative rounded-2xl border border-white/[0.1] bg-[rgba(6,28,38,0.65)] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="mb-6 space-y-2 text-left">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
          <UserCheck size={12} />
          <span>New Student Account</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Student Registration
        </h1>
        <p className="text-secondary-text text-sm sm:text-base">
          Create your student account to submit assignments and track mentor
          review feedback.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          control={control}
          name="name"
          label="Full Name"
          placeholder="e.g. Tanvir Hossain"
          error={errors.name?.message}
          required
        />

        <InputField
          control={control}
          name="email"
          label="Student Email Address"
          type="email"
          placeholder="student@example.com"
          error={errors.email?.message}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            control={control}
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            required
          />

          <InputField
            control={control}
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            required
          />
        </div>

        <DynamicActionButton
          type="submit"
          label="Register"
          isLoading={isLoading}
          icon={ArrowRight}
          showIcon
          className="w-full mt-2"
        />

        <div className="pt-2 text-center text-xs text-secondary-text">
          Already have an account?{" "}
          <Link
            href="/"
            className="text-primary hover:text-primary/80 font-medium hover:underline"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
