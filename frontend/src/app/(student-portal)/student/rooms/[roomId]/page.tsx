import { PageLoading } from "@/components/ui/PageLoading";
import { Suspense } from "react";
import { Lobby } from "@/features/student/Portal";

export const metadata = { title: "Phòng chờ" };

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Lobby /></Suspense>;
}
