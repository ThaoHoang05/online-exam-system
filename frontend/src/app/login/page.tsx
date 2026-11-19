import { PageLoading } from "@/components/ui/PageLoading";
import { Suspense } from "react";
import { Auth } from "@/features/student/Auth";

export const metadata = { title: "Đăng nhập" };

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Auth /></Suspense>;
}
