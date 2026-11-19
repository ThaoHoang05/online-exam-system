import { PageLoading } from "@/components/ui/PageLoading";
import { Suspense } from "react";
import { Practice } from "@/features/student/Portal";

export const metadata = { title: "Luyện tập" };

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Practice /></Suspense>;
}
