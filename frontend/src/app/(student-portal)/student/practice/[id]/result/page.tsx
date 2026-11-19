import { PageLoading } from "@/components/ui/PageLoading";
import { Suspense } from "react";
import { AttemptView } from "@/features/student/AttemptView";

export const metadata = { title: "Kết quả luyện tập" };

export default function Page() {
  return <Suspense fallback={<PageLoading />}><AttemptView mode="practice" result /></Suspense>;
}
