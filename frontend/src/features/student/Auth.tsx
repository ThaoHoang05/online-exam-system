"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { HeaderArt } from "@/components/layout/HeaderArt";
import s from "./study.module.css";

export function Auth({register=false}:{register?:boolean}){
  const router=useRouter();
  const roleMenu = useRef<HTMLDivElement>(null);
  const roleTrigger = useRef<HTMLButtonElement>(null);
  const [role,setRole]=useState("STUDENT");
  const [visible,setVisible]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [created,setCreated]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const values=Object.fromEntries(new FormData(event.currentTarget));
    if(register && values.password!==values.confirm){setMessage("Hai mật khẩu chưa khớp.");return;}
    setBusy(true);setMessage("");
    try{
      const csrf=document.cookie.split("; ").find(c=>c.startsWith("csrf="))?.slice(5);
      const response=await fetch(register?"/api/register":"/api/login",{
        method:"POST",credentials:"same-origin",
        headers:{"Content-Type":"application/json",...(csrf?{"X-CSRF-Token":decodeURIComponent(csrf)}:{})},
        body:JSON.stringify({username:String(values.username).trim(),password:values.password,...(register?{role,email:values.email,full_name:values.full_name}:{})})
      });
      if(response.status===404 || !response.headers.get("content-type")?.includes("application/json")){setMessage("Dịch vụ tài khoản chưa kết nối. Bạn có thể mở bản demo học sinh bên dưới.");return;}
      const payload=await response.json();
      if(!response.ok){setMessage(response.status===429?"Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.":response.status===409?(register?"Tên đăng nhập đã được sử dụng.":"Phiên thi hiện tại vẫn đang hoạt động."):response.status===401?"Tên đăng nhập hoặc mật khẩu chưa đúng.":"Yêu cầu chưa được chấp nhận. Vui lòng kiểm tra thông tin.");return;}
      if(register){setCreated(true);return;}
      const targetRole=payload.user?.role??payload.role;
      router.push(targetRole==="ADMIN"?"/admin/users":targetRole==="TEACHER"&&payload.user?.status!=="PENDING"?"/teacher/dashboard":"/student/dashboard");
    }catch{setMessage("Chưa thể kết nối đến dịch vụ tài khoản.");}finally{setBusy(false);}
  }
  return <main className={[s.page,s.auth,register && s.register].filter(Boolean).join(" ")}><div className={s.authGrid}><aside className={s.authArt}><div className={s.brand}><HeaderArt name="logo"/>Online Exam</div><Image src="/illustrations/exam-robot.svg" alt="" width={236} height={195}/><Link href="/student/dashboard">Khám phá bản demo học sinh →</Link></aside>
    <section className={s.authForm}>{created?<div className={s.stack}><h1>Đã đăng ký</h1><p>{role==="TEACHER"?"Yêu cầu quyền giáo viên đang chờ quản trị viên duyệt.":"Tài khoản học sinh đã được tạo."}</p><Link className={s.primary} href="/login">Đăng nhập</Link></div>:<form className={s.form} onSubmit={submit}><h1>{register?"Đăng ký":"Đăng nhập"}</h1>
    {register&&<><label className={s.field}>Họ và tên<input name="full_name" autoComplete="name" required/></label><label className={s.field}>Email<input name="email" type="email" autoComplete="email" required/></label></>}
    <label className={s.field}>Tên đăng nhập<input name="username" autoComplete="username" required/></label>
    {register && <div className={s.roleField}>
      <span id="role-label">Loại tài khoản</span>
      <button type="button" ref={roleTrigger} popoverTarget="role-menu" className={s.roleTrigger} aria-labelledby="role-label role-value">
        <span id="role-value">{role==="TEACHER"?"Giáo viên":"Học sinh"}</span><span aria-hidden="true">⌄</span>
      </button>
      <div id="role-menu" popover="auto" ref={roleMenu} className={s.roleMenu} onKeyDown={e=>{
        if(e.key==="ArrowDown" || e.key==="ArrowUp"){
          e.preventDefault();
          const options=Array.from(e.currentTarget.querySelectorAll("button"));
          options[document.activeElement===options[0]?1:0]?.focus();
        }
      }}>
        {(["STUDENT","TEACHER"] as const).map(value=><button type="button" key={value} aria-pressed={role===value} onClick={()=>{
          setRole(value); roleMenu.current?.hidePopover(); roleTrigger.current?.focus();
        }}><span>{value==="STUDENT"?"Học sinh":"Giáo viên"}</span><span aria-hidden="true">{role===value?"✓":""}</span></button>)}
      </div>
    </div>}<label className={s.field}>Mật khẩu<input type={visible?"text":"password"} name="password" autoComplete={register?"new-password":"current-password"} required/></label>
    {register&&<><label className={s.field}>Nhập lại mật khẩu<input name="confirm" type={visible?"text":"password"} autoComplete="new-password" required/></label>{role==="TEACHER"&&<small>Quyền giáo viên cần quản trị viên duyệt.</small>}</>}
    <label><input type="checkbox" checked={visible} onChange={e=>setVisible(e.target.checked)}/> Hiện mật khẩu</label>
    {message&&<p role="alert">{message}</p>}<button disabled={busy} className={s.primary}>{busy?"Đang xử lý…":register?"Tạo tài khoản":"Đăng nhập"}</button>
    <p>{register?"Đã có tài khoản?":"Chưa có tài khoản?"} <Link className={s.link} href={register?"/login":"/register"}>{register?"Đăng nhập":"Đăng ký"}</Link></p></form>}</section></div></main>;
}
