"use client";

import DynamicActionButton from "@/components/dashboard/DynamicActionButton/DynamicActionButton";
import InputField from "@/components/dashboard/Fields/InputField/InputField";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Send, ClipboardCheck } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loginUser, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res: any = await loginUser(data).unwrap();
      const rawUser = res?.data?.user || res?.data;
      const user = {
        id: rawUser?.id || rawUser?._id,
        name: rawUser?.name,
        email: rawUser?.email,
        role: rawUser?.role,
      };

      dispatch(setCredentials({ user }));
      await import("@/services/auth/auth.service").then((m) =>
        m.setUserProfile(user),
      );
      toast.success(res?.message || "Logged in successfully");

      if (user.role === "STUDENT") {
        router.push("/student");
      } else {
        router.push("/mentor");
      }
    } catch (error: any) {
      const errorMsg =
        error?.data?.message ||
        error?.data?.error?.message ||
        error?.message ||
        "Failed to login. Please check your credentials.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="relative rounded-2xl border border-white/[0.1] bg-[rgba(6,28,38,0.65)] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="mb-6 space-y-2 text-left">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Admin & Portal Login
        </h1>
        <p className="text-secondary-text text-sm sm:text-base">
          Enter your administrative or student credentials to sign in.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <InputField
            control={control}
            name="email"
            label="Email Address"
            type="email"
            placeholder="admin@gmail.com"
            error={errors.email?.message}
            required
          />

          <div className="space-y-1">
            <InputField
              control={control}
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              required
            />
            <div className="flex justify-end pt-1">
              <Link
                href="/forgot-password"
                className="text-primary hover:text-primary/80 text-xs font-medium hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>

        <DynamicActionButton
          type="submit"
          label="Sign in to Portal"
          isLoading={isLoading}
          className="w-full mt-2"
        />

        <div className="pt-2 text-center text-xs text-secondary-text">
          New student?{" "}
          <Link
            href="/signup"
            className="text-primary hover:text-primary/80 font-medium hover:underline"
          >
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
}
