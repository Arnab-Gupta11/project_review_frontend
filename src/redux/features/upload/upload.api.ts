import { apiClient } from "../../apiClient/apiClient";

export const uploadApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/upload/image",
        method: "POST",
        body: formData,
      }),
    }),
    uploadPdf: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/upload/pdf",
        method: "POST",
        body: formData,
      }),
    }),
    uploadVideo: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/upload/video",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useUploadImageMutation,
  useUploadPdfMutation,
  useUploadVideoMutation,
} = uploadApi;

