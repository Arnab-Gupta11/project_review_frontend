import { Send, FolderGit2, ClipboardCheck } from "lucide-react";

export const StudentRoutes = [
  {
    title: "Submit Project",
    url: "/student/submit",
    icon: Send,
  },
  {
    title: "My Submissions",
    url: "/student/submissions",
    icon: FolderGit2,
  },
];

export const MentorRoutes = [
  {
    title: "Project Reviews",
    url: "/mentor/reviews",
    icon: ClipboardCheck,
  },
];
