import { PageLoading } from "@/components/ui/PageLoading";
import { Suspense } from "react";
import { AttemptView } from "@/features/student/AttemptView";

export const metadata = { title: "Kết quả thi" };

export default function Page() {
  return <Suspense fallback={<PageLoading />}><AttemptView mode="exam" result /></Suspense>;
}
