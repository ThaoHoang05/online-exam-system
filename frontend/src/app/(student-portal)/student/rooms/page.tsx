import { PageLoading } from "@/components/ui/PageLoading";
import { Suspense } from "react";
import { Rooms } from "@/features/student/Portal";

export const metadata = { title: "Phòng thi" };

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Rooms /></Suspense>;
}
