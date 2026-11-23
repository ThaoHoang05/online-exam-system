import type {ReactNode} from "react";import {AppHeader} from "@/components/layout/AppHeader";
export default function ProfileLayout({children}:{children:ReactNode}){return <><AppHeader homeHref="/student/dashboard" items={[{label:"Quay lại tổng quan",href:"/student/dashboard",icon:"chart"}]} name="Tài khoản" role="Hồ sơ"/>{children}</>}
