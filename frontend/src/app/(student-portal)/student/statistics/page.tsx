import { PageLoading } from "@/components/ui/PageLoading";
import { Suspense } from "react";
import { Statistics } from "@/features/student/Statistics";

export const metadata = { title: "Thống kê" };

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Statistics /></Suspense>;
}
