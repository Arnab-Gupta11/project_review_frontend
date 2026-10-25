"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  Check,
  X,
  Code2,
  Globe,
  ExternalLink,
  Search,
  RotateCw,
  Clock,
  CheckCircle2,
  XCircle,
  FolderGit2,
  User,
  AlertCircle,
} from "lucide-react";

import CustomTable from "@/components/dashboard/CustomTable/CustomTable";
import CustomPagination from "@/components/dashboard/CustomPagination/CustomPagination";
import DynamicBadge from "@/components/dashboard/DynamicBadge/DynamicBadge";
import DynamicModal from "@/components/dashboard/DynamicModal/DynamicModal";
import DynamicActionButton from "@/components/dashboard/DynamicActionButton/DynamicActionButton";
import TableSkeleton from "@/components/Loader/Skeletons/TableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { TColumn } from "@/types/custom-table.types";
import {
  useGetAllSubmissionsQuery,
  useReviewSubmissionMutation,
  IProjectSubmission,
  TSubmissionStatus,
} from "@/redux/features/submission/submission.api";

function MentorReviewsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeStatus =
    (searchParams.get("status") as TSubmissionStatus | "ALL") || "ALL";
  const searchQuery = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 6;

  const [searchInput, setSearchInput] = useState(searchQuery);

  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllSubmissionsQuery({
    status: activeStatus === "ALL" ? undefined : activeStatus,
    search: searchQuery.trim() || undefined,
    page: currentPage,
    limit: itemsPerPage,
  });

  const [reviewSubmission] = useReviewSubmissionMutation();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<IProjectSubmission | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionRowId, setActionRowId] = useState<string | null>(null);

  const setFilterParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

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

  const meta = apiResponse?.meta ?? {
    total: submissions.length,
    page: currentPage,
    limit: itemsPerPage,
    totalPage: 1,
  };

  const handleApprove = async (submission: IProjectSubmission) => {
    try {
      setActionRowId(submission.id);
      const res: any = await reviewSubmission({
        id: submission.id,
        data: {
          status: "APPROVED",
          feedback: "Code reviewed and approved! Excellent implementation.",
        },
      }).unwrap();

      toast.success(
        res?.message || `"${submission.projectName}" marked as APPROVED!`,
      );
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || "Failed to approve project.";
      toast.error(errorMsg);
    } finally {
      setActionRowId(null);
    }
  };

  const handleOpenRejectModal = (submission: IProjectSubmission) => {
    setSelectedSubmission(submission);
    setRejectionFeedback(submission.feedback || "");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedSubmission) return;
    try {
      setIsActionLoading(true);
      const res: any = await reviewSubmission({
        id: selectedSubmission.id,
        data: {
          status: "REJECTED",
          feedback:
            rejectionFeedback.trim() ||
            "Submission rejected by mentor. Please review guidelines.",
        },
      }).unwrap();

      toast.error(
        res?.message ||
          `"${selectedSubmission.projectName}" marked as REJECTED.`,
      );
      setRejectModalOpen(false);
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || "Failed to reject project.";
      toast.error(errorMsg);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterParam("search", searchInput.trim());
  };

  const errorMessage =
    (error as any)?.data?.message ||
    (error as any)?.message ||
    "Failed to load submissions. Please check backend connectivity.";

  const columns: TColumn<IProjectSubmission>[] = [
    {
      header: "Project Details",
      cell: (row) => (
        <div className="max-w-xs space-y-1">
          <p className="font-semibold text-white tracking-tight line-clamp-1">
            {row.projectName}
          </p>
          <p className="text-secondary-text text-xs line-clamp-2 leading-relaxed">
            {row.description}
          </p>
        </div>
      ),
    },
    {
      header: "Student",
      cell: (row) => (
        <div className="space-y-0.5">
          <p className="text-white font-medium text-xs sm:text-sm flex items-center gap-1.5">
            <User size={13} className="text-primary" />
            {row.student?.name || "Student"}
          </p>
          <p className="text-secondary-text text-xs font-mono">
            {row.student?.email || "No email"}
          </p>
        </div>
      ),
    },
    {
      header: "Links",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <a
            href={row.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View GitHub Repository"
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/4 hover:bg-white/8 hover:border-primary/40 px-2.5 py-1 text-xs text-white transition-colors"
          >
            <Code2 size={12} />
            <span>Repo</span>
            <ExternalLink size={10} className="opacity-60" />
          </a>

          <a
            href={row.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Live Preview"
            className="flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 px-2.5 py-1 text-xs text-primary transition-colors"
          >
            <Globe size={12} />
            <span>Live</span>
            <ExternalLink size={10} className="opacity-60" />
          </a>
        </div>
      ),
    },
    {
      header: "Submitted",
      cell: (row) => (
        <span className="text-secondary-text text-xs font-mono">
          {new Date(row.createdAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (row) => {
        let color = "#fde68a";
        let icon = Clock;
        let text = "Pending";

        if (row.status === "APPROVED") {
          color = "#05d8b5";
          icon = CheckCircle2;
          text = "Approved";
        } else if (row.status === "REJECTED") {
          color = "#ef4444";
          icon = XCircle;
          text = "Rejected";
        }

        return <DynamicBadge text={text} color={color} icon={icon} size="xs" />;
      },
    },
    {
      header: "Actions",
      cell: (row) => {
        const isApproved = row.status === "APPROVED";
        const isRejected = row.status === "REJECTED";
        const isRowBusy = actionRowId === row.id;

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleApprove(row)}
              disabled={isApproved || isRowBusy}
              title={isApproved ? "Already Approved" : "Approve Project"}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                isApproved
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 opacity-60 cursor-default"
                  : "border-emerald-500/50 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 hover:shadow-[0_0_15px_rgba(5,216,181,0.25)] active:scale-95 cursor-pointer disabled:opacity-50"
              }`}
            >
              <Check size={14} strokeWidth={2.5} />
              <span>{isRowBusy ? "Saving..." : "Approve"}</span>
            </button>

            <button
              onClick={() => handleOpenRejectModal(row)}
              disabled={isRejected || isRowBusy}
              title={isRejected ? "Already Rejected" : "Reject Project"}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                isRejected
                  ? "border-red-500/30 bg-red-500/10 text-red-300 opacity-60 cursor-default"
                  : "border-red-500/50 bg-red-500/15 text-red-300 hover:bg-red-500/25 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] active:scale-95 cursor-pointer disabled:opacity-50"
              }`}
            >
              <X size={14} strokeWidth={2.5} />
              <span>Reject</span>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8 max-w-full mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Mentor Review Dashboard
            </h1>
            <DynamicBadge text="Mentor Portal" color="#02e0df" size="xs" />
          </div>
          <p className="text-secondary-text mt-1 text-sm sm:text-base">
            Review student project submissions, inspect repositories, test live
            links, and approve or reject submissions.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card glass-card-interactive relative overflow-hidden rounded-2xl p-5">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
          <div className="flex items-start justify-between">
            <span className="text-secondary-text text-xs font-medium uppercase tracking-wider">
              Total Submissions
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/4 text-white backdrop-blur-md">
              <FolderGit2 size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            {isLoading ? (
              <Skeleton className="h-9 w-14 bg-white/10" />
            ) : (
              <span className="text-3xl font-bold tracking-tight text-white">
                {stats.total}
              </span>
            )}
            <DynamicBadge text="All Projects" color="#38bdf8" size="xs" />
          </div>
          <p className="text-secondary-text mt-2 text-xs">
            Total projects submitted by students
          </p>
        </div>

        <div className="glass-card glass-card-interactive relative overflow-hidden rounded-2xl p-5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
          <div className="flex items-start justify-between">
            <span className="text-secondary-text text-xs font-medium uppercase tracking-wider">
              Pending Review
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-300 backdrop-blur-md">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            {isLoading ? (
              <Skeleton className="h-9 w-14 bg-white/10" />
            ) : (
              <span className="text-3xl font-bold tracking-tight text-yellow-300">
                {stats.pending}
              </span>
            )}
            <DynamicBadge text="Awaiting" color="#fde68a" size="xs" />
          </div>
          <p className="text-secondary-text mt-2 text-xs">
            Submissions waiting for mentor review
          </p>
        </div>

        <div className="glass-card glass-card-interactive relative overflow-hidden rounded-2xl p-5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
          <div className="flex items-start justify-between">
            <span className="text-secondary-text text-xs font-medium uppercase tracking-wider">
              Approved Projects
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 backdrop-blur-md">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            {isLoading ? (
              <Skeleton className="h-9 w-14 bg-white/10" />
            ) : (
              <span className="text-3xl font-bold tracking-tight text-emerald-300">
                {stats.approved}
              </span>
            )}
            <DynamicBadge text="Approved" color="#05d8b5" size="xs" />
          </div>
          <p className="text-secondary-text mt-2 text-xs">
            Successfully passed mentor review
          </p>
        </div>

        <div className="glass-card glass-card-interactive relative overflow-hidden rounded-2xl p-5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/30 to-transparent" />
          <div className="flex items-start justify-between">
            <span className="text-secondary-text text-xs font-medium uppercase tracking-wider">
              Rejected Projects
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10 text-red-300 backdrop-blur-md">
              <XCircle size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            {isLoading ? (
              <Skeleton className="h-9 w-14 bg-white/10" />
            ) : (
              <span className="text-3xl font-bold tracking-tight text-red-300">
                {stats.rejected}
              </span>
            )}
            <DynamicBadge text="Revisions" color="#ef4444" size="xs" />
          </div>
          <p className="text-secondary-text mt-2 text-xs">
            Needs revision or fixes from student
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { label: "All", value: "ALL", count: stats.total },
              { label: "Pending", value: "PENDING", count: stats.pending },
              { label: "Approved", value: "APPROVED", count: stats.approved },
              { label: "Rejected", value: "REJECTED", count: stats.rejected },
            ] as const
          ).map((tab) => {
            const isActive = activeStatus === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setFilterParam("status", tab.value)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all cursor-pointer ${
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

        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search
            size={15}
            className="text-secondary-text absolute top-1/2 left-3.5 -translate-y-1/2"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search project or student..."
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.035] backdrop-blur-md py-2 pr-10 pl-9 text-xs text-white placeholder:text-muted-foreground/60 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setFilterParam("search", "");
              }}
              className="text-secondary-text hover:text-white absolute top-1/2 right-3 -translate-y-1/2 text-xs"
            >
              ✕
            </button>
          )}
        </form>
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

      {isLoading && <TableSkeleton rowCount={6} />}

      {!isLoading && !isError && (
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="glass-card flex flex-col items-center justify-center rounded-2xl border-dashed p-12 text-center">
              <AlertCircle size={40} className="text-secondary-text/60 mb-3" />
              <p className="text-white font-medium text-base">
                No submissions found
              </p>
              <p className="text-secondary-text text-xs mt-1 max-w-sm">
                {searchQuery || activeStatus !== "ALL"
                  ? "No project submissions match your filter or search query."
                  : "No students have submitted any projects yet."}
              </p>
            </div>
          ) : (
            <>
              <CustomTable columns={columns} data={submissions} />

              <CustomPagination
                meta={{
                  total: meta.total,
                  page: meta.page,
                  limit: meta.limit,
                  totalPages:
                    meta.totalPage || Math.ceil(meta.total / meta.limit) || 1,
                }}
              />
            </>
          )}
        </div>
      )}

      <DynamicModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Project Submission"
        description={`Provide actionable review feedback for "${selectedSubmission?.projectName}" so the student knows what to revise.`}
      >
        <div className="space-y-4 pt-2">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-xs space-y-1">
            <p className="text-secondary-text">Student:</p>
            <p className="font-semibold text-white">
              {selectedSubmission?.student?.name || "Student"} (
              {selectedSubmission?.student?.email || "No email"})
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white block">
              Feedback / Rejection Reason{" "}
              <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={4}
              value={rejectionFeedback}
              onChange={(e) => setRejectionFeedback(e.target.value)}
              placeholder="e.g. The live link returned a 404 error, and README documentation is missing testing credentials. Please fix and re-submit."
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.035] backdrop-blur-md p-3 text-sm text-white placeholder:text-muted-foreground/60 outline-none focus:border-red-400/60 focus:ring-2 focus:ring-red-400/20 transition-all shadow-inner resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] px-4 py-2.5 text-xs font-medium text-white transition-colors"
            >
              Cancel
            </button>

            <DynamicActionButton
              type="button"
              label="Confirm Rejection"
              variant="danger"
              icon={X}
              showIcon
              isLoading={isActionLoading}
              onClick={handleConfirmReject}
            />
          </div>
        </div>
      </DynamicModal>
    </div>
  );
}

export default function MentorReviewDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center p-8 text-center">
          <div className="border-primary/20 border-t-primary h-8 w-8 animate-spin rounded-full border-2" />
        </div>
      }
    >
      <MentorReviewsContent />
    </Suspense>
  );
}
