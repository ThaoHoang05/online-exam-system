"use client";
import Link from "next/link";
import { Suspense } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HeaderArt } from "./HeaderArt";
import { Icon } from "@/components/ui/Icon";
import { PrimaryNav, type NavigationItem } from "./PrimaryNav";
import styles from "./header.module.css";

type AppHeaderProps = {
  homeHref: string;
  items: readonly NavigationItem[];
  name: string;
  role: string;
};

export function AppHeader({ homeHref, items, name, role }: AppHeaderProps) {
  const [open,setOpen]=useState(false); const [busy,setBusy]=useState(false); const menu=useRef<HTMLDivElement>(null); const router=useRouter();
  useEffect(()=>{function close(e:PointerEvent){if(!menu.current?.contains(e.target as Node))setOpen(false)};function key(e:KeyboardEvent){if(e.key==="Escape")setOpen(false)};document.addEventListener("pointerdown",close);document.addEventListener("keydown",key);return()=>{document.removeEventListener("pointerdown",close);document.removeEventListener("keydown",key)}},[]);
  async function logout(){setBusy(true);try{const csrf=document.cookie.split("; ").find(c=>c.startsWith("csrf="))?.slice(5);await fetch("/api/logout",{method:"POST",credentials:"same-origin",headers:csrf?{"X-CSRF-Token":decodeURIComponent(csrf)}:{}})}catch{}finally{router.push("/login");router.refresh();setBusy(false)}}
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={homeHref} className={styles.brand} aria-label="Online Exam — về tổng quan">
          <HeaderArt name="logo" />
          Online Exam
        </Link>
        <Suspense fallback={<nav aria-label="Điều hướng chính" />}>
          <PrimaryNav items={items} />
        </Suspense>
        <div className={styles.accountMenu} ref={menu}>
          <button className={styles.account} aria-expanded={open} aria-haspopup="menu" onClick={()=>setOpen(!open)}>
            <span aria-hidden="true" className={styles.avatar}><Icon name="user" /></span>
            <span className={styles.accountText}><strong>{name}</strong><small>{role}</small></span><span className={styles.accountChevron}>⌄</span>
          </button>
          {open&&<div className={styles.dropdown} role="menu"><div className={styles.dropdownIdentity}><b>{name}</b><small>{role}</small></div><Link role="menuitem" href="/profile" onClick={()=>setOpen(false)}><Icon name="user"/>Hồ sơ cá nhân</Link><Link role="menuitem" href="/profile/security" onClick={()=>setOpen(false)}><Icon name="check"/>Bảo mật tài khoản</Link><button role="menuitem" onClick={logout} disabled={busy}><span aria-hidden="true">↪</span>{busy?"Đang đăng xuất…":"Đăng xuất"}</button></div>}
        </div>
      </div>
    </header>
  );
}
