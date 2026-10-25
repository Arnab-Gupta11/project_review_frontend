"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import {
  Code2,
  Globe,
  ExternalLink,
  Search,
  RotateCw,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  AlertCircle,
  FolderGit2,
} from "lucide-react";

import DynamicBadge from "@/components/dashboard/DynamicBadge/DynamicBadge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetMySubmissionsQuery,
  IProjectSubmission,
  TSubmissionStatus,
} from "@/redux/features/submission/submission.api";

function MySubmissionsContent() {
  const [activeFilter, setActiveFilter] = useState<"ALL" | TSubmissionStatus>(
    "ALL",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetMySubmissionsQuery({
    status: activeFilter === "ALL" ? undefined : activeFilter,
    search: searchQuery.trim() || undefined,
  });

  const submissions: IProjectSubmission[] = apiResponse?.data ?? [];

  const stats = useMemo(() => {
    if (apiResponse?.stats) {
      return apiResponse.stats;
    }
    const total = submissions.length;
    const pending = submissions.filter((s) => s.status === "PENDING").length;
    const approved = submissions.filter((s) => s.status === "APPROVED").length;
    const rejected = submissions.filter((s) => s.status === "REJECTED").length;
    return { total, pending, approved, rejected };
  }, [apiResponse, submissions]);

  const getStatusBadgeConfig = (status: TSubmissionStatus) => {
    switch (status) {
      case "APPROVED":
        return { color: "#05d8b5", icon: CheckCircle2, text: "Approved" };
      case "REJECTED":
        return { color: "#ef4444", icon: XCircle, text: "Rejected" };
      case "PENDING":
      default:
        return { color: "#fde68a", icon: Clock, text: "Pending Review" };
    }
  };

  const errorMessage =
    (error as any)?.data?.message ||
    (error as any)?.message ||
    "Failed to load your submissions. Please check backend connection.";

  return (
    <div className="space-y-8 w-full mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              My Submissions
            </h1>
          </div>
          <p className="text-secondary-text mt-1 text-sm sm:text-base">
            Track your submitted assignments, view mentor review statuses, and
            read feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/student/submit"
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-[#030f16] shadow-[0_0_20px_rgba(2,224,223,0.3)] hover:bg-primary/90 transition-all w-fit active:scale-95"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Submit New Project</span>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <div className="glass-card relative overflow-hidden rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-secondary-text text-xs uppercase font-medium">
              Total
            </span>
            <FolderGit2 size={16} className="text-white/70" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            {isLoading ? (
              <Skeleton className="h-8 w-14 bg-white/10" />
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {stats.total}
              </span>
            )}
            <span className="text-[10px] text-secondary-text">Submissions</span>
          </div>
        </div>

        <div className="glass-card relative overflow-hidden rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-secondary-text text-xs uppercase font-medium">
              Pending
            </span>
            <Clock size={16} className="text-yellow-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            {isLoading ? (
              <Skeleton className="h-8 w-14 bg-white/10" />
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-yellow-300">
                {stats.pending}
              </span>
            )}
            <span className="text-[10px] text-yellow-400/80">In Review</span>
          </div>
        </div>

        <div className="glass-card relative overflow-hidden rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-secondary-text text-xs uppercase font-medium">
              Approved
            </span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            {isLoading ? (
              <Skeleton className="h-8 w-14 bg-white/10" />
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-emerald-300">
                {stats.approved}
              </span>
            )}
            <span className="text-[10px] text-emerald-400/80">Passed</span>
          </div>
        </div>

        <div className="glass-card relative overflow-hidden rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-secondary-text text-xs uppercase font-medium">
              Rejected
            </span>
            <XCircle size={16} className="text-red-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            {isLoading ? (
              <Skeleton className="h-8 w-14 bg-white/10" />
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-red-300">
                {stats.rejected}
              </span>
            )}
            <span className="text-[10px] text-red-400/80">Needs Fix</span>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { label: "All", value: "ALL", count: stats.total },
              { label: "Pending", value: "PENDING", count: stats.pending },
              { label: "Approved", value: "APPROVED", count: stats.approved },
              { label: "Rejected", value: "REJECTED", count: stats.rejected },
            ] as const
          ).map((tab) => {
            const isActive = activeFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-[#030f16] font-semibold shadow-[0_0_15px_rgba(2,224,223,0.3)]"
                    : "bg-white/[0.03] text-primary-text hover:bg-white/[0.08] border border-white/[0.08]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive
                      ? "bg-[#030f16]/30 text-[#030f16]"
                      : "bg-white/10 text-white/80"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={14}
            className="text-secondary-text absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.035] backdrop-blur-md py-1.5 pr-8 pl-8 text-xs text-white placeholder:text-muted-foreground/60 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-secondary-text hover:text-white absolute top-1/2 right-2.5 -translate-y-1/2 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {isError && (
        <div className="glass-card rounded-2xl border-red-500/30 bg-red-500/10 p-6 text-center space-y-3">
          <AlertCircle size={36} className="text-red-400 mx-auto" />
          <h3 className="text-white font-semibold text-base">
            Error Loading Submissions
          </h3>
          <p className="text-red-200 text-xs max-w-md mx-auto">
            {errorMessage}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-400/30 bg-red-500/20 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500/30 transition-colors cursor-pointer"
          >
            <RotateCw size={13} />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {isLoading && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-card rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <Skeleton className="h-5 w-40 bg-white/10 rounded" />
                <Skeleton className="h-5 w-20 bg-white/10 rounded-full" />
              </div>
              <Skeleton className="h-12 w-full bg-white/10 rounded" />
              <div className="pt-4 border-t border-white/8 flex justify-between">
                <Skeleton className="h-4 w-28 bg-white/10 rounded" />
                <Skeleton className="h-7 w-28 bg-white/10 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && submissions.length === 0 && (
        <div className="glass-card flex flex-col items-center justify-center rounded-2xl border-dashed p-12 text-center">
          <AlertCircle size={40} className="text-secondary-text/60 mb-3" />
          <p className="text-white font-medium text-base">
            No submissions found
          </p>
          <p className="text-secondary-text text-xs mt-1 max-w-sm">
            {searchQuery || activeFilter !== "ALL"
              ? "No projects match your current filter or search criteria."
              : "You have not submitted any projects yet. Click below to submit your first project!"}
          </p>
          <Link
            href="/student/submit"
            className="mt-4 flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus size={14} />
            <span>Submit a Project</span>
          </Link>
        </div>
      )}

      {!isLoading && !isError && submissions.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {submissions.map((sub) => {
            const statusConfig = getStatusBadgeConfig(sub.status);
            const StatusIcon = statusConfig.icon;
            const submittedDate = new Date(sub.createdAt).toLocaleString(
              "en-US",
              {
                dateStyle: "medium",
                timeStyle: "short",
              },
            );

            return (
              <div
                key={sub.id}
                className="glass-card glass-card-interactive flex flex-col justify-between rounded-2xl p-5 relative overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-white tracking-tight line-clamp-1">
                      {sub.projectName}
                    </h3>
                    <DynamicBadge
                      text={statusConfig.text}
                      color={statusConfig.color}
                      icon={StatusIcon}
                      size="xs"
                    />
                  </div>

                  <p className="text-secondary-text text-xs line-clamp-3 leading-relaxed">
                    {sub.description}
                  </p>

                  {sub.feedback && (
                    <div
                      className={`rounded-xl border p-3 text-xs ${
                        sub.status === "APPROVED"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                          : "border-red-500/30 bg-red-500/10 text-red-200"
                      }`}
                    >
                      <p className="font-semibold mb-0.5 flex items-center gap-1">
                        <span>Mentor Feedback:</span>
                      </p>
                      <p className="leading-relaxed opacity-90">
                        {sub.feedback}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary-text">Submitted:</span>
                    <span className="text-white/80 font-mono text-[11px]">
                      {submittedDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={sub.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1.5 text-xs font-medium text-white transition-colors"
                    >
                      <Code2 size={13} />
                      <span>Repo</span>
                      <ExternalLink size={11} className="opacity-60" />
                    </a>

                    <a
                      href={sub.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 px-2.5 py-1.5 text-xs font-medium text-primary transition-colors"
                    >
                      <Globe size={13} />
                      <span>Live Demo</span>
                      <ExternalLink size={11} className="opacity-60" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MySubmissionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-100 items-center justify-center p-8 text-center">
          <div className="border-primary/20 border-t-primary h-8 w-8 animate-spin rounded-full border-2" />
        </div>
      }
    >
      <MySubmissionsContent />
    </Suspense>
  );
}
