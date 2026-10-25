"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { Send, Sparkles, ArrowRight, FolderGit2, FileCode } from "lucide-react";

import InputField from "@/components/dashboard/Fields/InputField/InputField";
import TextAreaField from "@/components/dashboard/Fields/TextAreaField/TextAreaField";
import DynamicActionButton from "@/components/dashboard/DynamicActionButton/DynamicActionButton";
import DynamicBadge from "@/components/dashboard/DynamicBadge/DynamicBadge";
import {
  useCreateSubmissionMutation,
  useGetMySubmissionsQuery,
} from "@/redux/features/submission/submission.api";

const submissionSchema = z.object({
  projectName: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(80, "Project name cannot exceed 80 characters"),
  repoUrl: z
    .string()
    .min(1, "Repository URL is required")
    .url("Please enter a valid URL (e.g. https://github.com/username/repo)")
    .regex(/^https?:\/\//, "URL must begin with http:// or https://"),
  liveUrl: z
    .string()
    .min(1, "Live deployment URL is required")
    .url("Please enter a valid URL (e.g. https://project.vercel.app)")
    .regex(/^https?:\/\//, "URL must begin with http:// or https://"),
  description: z
    .string()
    .min(15, "Please provide at least 15 characters describing your project")
    .max(1000, "Description cannot exceed 1000 characters"),
});

type SubmissionFormValues = z.infer<typeof submissionSchema>;

export default function StudentSubmitPage() {
  const [createSubmission, { isLoading: isSubmitting }] =
    useCreateSubmissionMutation();
  const { data: mySubmissionsData } = useGetMySubmissionsQuery();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    mode: "onChange",
    defaultValues: {
      projectName: "",
      repoUrl: "",
      liveUrl: "",
      description: "",
    },
  });

  const onSubmit = async (data: SubmissionFormValues) => {
    try {
      const res: any = await createSubmission({
        projectName: data.projectName.trim(),
        repoUrl: data.repoUrl.trim(),
        liveUrl: data.liveUrl.trim(),
        description: data.description.trim(),
      }).unwrap();

      toast.success(
        res?.message ||
          "Project submitted successfully! View status in My Submissions.",
      );
      reset();
    } catch (error: any) {
      const errorMsg =
        error?.data?.message ||
        error?.data?.error?.message ||
        error?.message ||
        "Failed to submit project. Please try again.";
      toast.error(errorMsg);
    }
  };

  const totalSubmissions = mySubmissionsData?.data?.length ?? 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Submit Project
            </h1>
          </div>
          <p className="text-secondary-text mt-1 text-sm sm:text-base">
            Submit your completed repository and live preview link for mentor
            review and grading.
          </p>
        </div>

        <Link
          href="/student/submissions"
          className="glass-card flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium text-white hover:border-primary/40 transition-colors w-fit"
        >
          <FolderGit2 size={15} className="text-primary" />
          <span>View My Submissions ({totalSubmissions})</span>
          <ArrowRight size={13} className="opacity-60" />
        </Link>
      </div>

      <div className="w-full">
        <div className="glass-panel relative overflow-hidden rounded-2xl p-6 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

          <div className="mb-6 flex items-center justify-between border-b border-white/8 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-xs">
                <FileCode size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Project Submission Form
                </h2>
                <p className="text-secondary-text text-xs">
                  Fill in all fields to submit your assignment
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <InputField
              control={control}
              name="projectName"
              label="Project Title"
              placeholder="e.g. Next.js SaaS E-Commerce Platform"
              error={errors.projectName?.message}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                control={control}
                name="repoUrl"
                label="GitHub / Git Repository URL"
                type="url"
                placeholder="https://github.com/user/project"
                error={errors.repoUrl?.message}
                required
              />

              <InputField
                control={control}
                name="liveUrl"
                label="Live Deployed URL"
                type="url"
                placeholder="https://project.vercel.app"
                error={errors.liveUrl?.message}
                required
              />
            </div>

            <TextAreaField
              control={control}
              name="description"
              label="Project Overview & Tech Stack"
              rows={4}
              placeholder="Briefly describe what your application does, architecture highlights, and test credentials if needed..."
              error={errors.description?.message}
              required
            />

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto">
                <DynamicActionButton
                  type="submit"
                  label="Submit Project"
                  icon={Send}
                  showIcon
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
