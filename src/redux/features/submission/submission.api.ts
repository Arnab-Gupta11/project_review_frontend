import { apiClient } from "../../apiClient/apiClient";

export type TSubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IProjectSubmission {
  id: string;
  projectName: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
  status: TSubmissionStatus;
  feedback?: string | null;
  studentId: string;
  student?: {
    id: string;
    name: string | null;
    email: string;
  };
  reviewerId?: string | null;
  reviewer?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ISubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface ISubmissionsApiResponse {
  success: boolean;
  message: string;
  data: IProjectSubmission[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  stats?: ISubmissionStats;
}

export interface ICreateSubmissionPayload {
  projectName: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
}

export interface IReviewSubmissionPayload {
  status: "APPROVED" | "REJECTED";
  feedback?: string;
}

export const submissionApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    createSubmission: builder.mutation<any, ICreateSubmissionPayload>({
      query: (data) => ({
        url: "/submissions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Submission"],
    }),

    getMySubmissions: builder.query<
      ISubmissionsApiResponse,
      { status?: string; search?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/submissions/my-submissions",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Submission"],
    }),

    getAllSubmissions: builder.query<
      ISubmissionsApiResponse,
      { status?: string; search?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/submissions",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Submission"],
    }),

    getSubmissionById: builder.query<any, string>({
      query: (id) => ({
        url: `/submissions/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Submission", id }],
    }),

    reviewSubmission: builder.mutation<
      any,
      { id: string; data: IReviewSubmissionPayload }
    >({
      query: ({ id, data }) => ({
        url: `/submissions/${id}/review`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Submission"],
    }),
  }),
});

export const {
  useCreateSubmissionMutation,
  useGetMySubmissionsQuery,
  useGetAllSubmissionsQuery,
  useGetSubmissionByIdQuery,
  useReviewSubmissionMutation,
} = submissionApi;

