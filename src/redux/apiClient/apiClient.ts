import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { logout, setSessionExpired } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NODE_ENV === "production" ? "/api/v1" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"),
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  const isAuthRoute =
    typeof args === "string"
      ? args.includes("/auth/login") ||
        args.includes("/auth/register") ||
        args.includes("/auth/refresh-token")
      : args.url.includes("/auth/login") ||
        args.url.includes("/auth/register") ||
        args.url.includes("/auth/refresh-token");

  if (result.error && result.error.status === 401 && !isAuthRoute) {
    console.log("Access token expired. Attempting silent refresh...");

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      console.log("Token refreshed successfully. Retrying original request...");
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("Refresh token expired. Showing session expired modal...");

      api.dispatch(logout());
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      api.dispatch(setSessionExpired(true));
    }
  }

  return result;
};

export const apiClient = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Conversation",
    "Message",
    "Notification",
    "Work",
    "Article",
    "Service",
    "Job",
    "JobApplication",
    "Contact",
    "Testimonial",
    "Settings",
    "Media",
    "AdminUser",
    "Submission"
  ],
  endpoints: () => ({}),
});
