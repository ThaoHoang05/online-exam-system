"use client";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { rooms, topics, history, useAttempts, readAttempts, createAttempt, saveAttempt, attemptUrl, type Topic, type Difficulty } from "./study";
import s from "./study.module.css";

const clockFormat = new Intl.DateTimeFormat("vi-VN",{hour:"2-digit",minute:"2-digit"});
function demoWindow(minutes:number, now:number) {
  const duration=minutes*60000;
  const start=Math.floor(now/duration)*duration;
  return {start,end:start+duration};
}

export function Rooms() {
  const attempts = useAttempts() ?? [];
  const [now,setNow]=useState<number|null>(null);
  useEffect(()=>{
    const tick=()=>setNow(Date.now());
    const first=setTimeout(tick,0);
    const timer=setInterval(tick,1000);
    return ()=>{clearTimeout(first);clearInterval(timer)};
  },[]);
  const [tab,setTab]=useState("Tất cả");
  const [search,setSearch]=useState("");
  const [page,setPage]=useState(1);
  const all = rooms.map(r=>({...r,state:attempts.some(a=>a.id===r.id && a.submitted)?"Đã làm":r.state}));
  const visible=all.filter(r=>(tab==="Tất cả" || tab===r.state) && (r.topic+r.title+r.id).toLocaleLowerCase("vi").includes(search.trim().toLocaleLowerCase("vi")));
  const pages=Math.ceil(visible.length/4);
  const current=Math.min(page,pages || 1);
  return <main className={s.page+" "+s.roomPage} aria-label="Phòng thi">
    <div className={s.roomToolbar}><div className={s.tabs} aria-label="Trạng thái phòng thi">{["Tất cả","Đang mở","Sắp diễn ra","Đã làm","Đã kết thúc"].map(t=><button key={t} data-state={t} aria-pressed={tab===t} onClick={()=>{setTab(t);setPage(1)}}>{t}</button>)}</div>
    <input type="search" aria-label="Tìm phòng thi" placeholder="Tìm theo tên hoặc mã phòng" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}/></div>
    <div className={s.grid}>{visible.slice((current-1)*4,current*4).map(r=>{
      const attempt=attempts.find(a=>a.mode==="exam" && a.id===r.id);
      const liveEnd=attempt?.end ?? (now===null?null:demoWindow(r.minutes,now).end);
      const live=r.id==="LTM-204";
      const [open,close]=live
        ? liveEnd ? [clockFormat.format(liveEnd-r.minutes*60000),clockFormat.format(liveEnd)] : ["—","—"]
        : [r.opens,r.closes];
      const done=r.state==="Đã làm";
      return <article className={s.roomCard} data-state={r.state} key={r.id}>
        <p className={s.roomIdentity}><strong>{r.id}</strong><span className={s.examTitle}>{r.title}</span></p>
        <span className={s.badge}>{r.state}</span>
        <div className={s.roomDetails}>
          <h2>{r.topic}</h2>
          <div className={s.schedule}><span>Mở phòng <b>{open}</b></span><span>Hạn nộp <b>{close}</b></span></div>
        </div>
        <div className={s.roomFacts}><span><Icon name="book" />{r.count} câu</span><span><Icon name="clock" />{r.minutes} phút</span></div>
        <div className={s.roomFooter}><Link className={r.state==="Đang mở"?s.primary:s.link} href={done?"/student/exams/"+r.id+"/result":"/student/rooms/"+r.id}>{done?"Xem kết quả":r.state==="Đang mở"?"Vào phòng chờ":"Chi tiết"}<Icon name="arrow" /></Link></div>
      </article>;
    })}</div>    {pages>1 && <nav className={s.pagination} aria-label="Phân trang phòng thi"><button disabled={current===1} onClick={()=>setPage(current-1)}>← Trước</button><span aria-live="polite">Trang {current} / {pages}</span><button disabled={current===pages} onClick={()=>setPage(current+1)}>Sau →</button></nav>}
    {!visible.length && <p className={s.panel}>Không tìm thấy phòng thi phù hợp.</p>}</main>;
}

export function Lobby() {
  const {roomId}=useParams<{roomId:string}>();
  const r=rooms.find(item=>item.id===roomId);
  const attempts=useAttempts(); const router=useRouter();
  if(!r) return <main className={s.page}><h1>Không tìm thấy phòng</h1><Link className={s.backLink} href="/student/rooms">Phòng thi</Link></main>;
  const prior=attempts?.find(a=>a.id===r.id);
  function enter() {
    const existing=readAttempts().find(item=>item.id===roomId);
    const a=existing ?? createAttempt("exam",topics[0],30,"Trung bình");
    if (!existing) a.end=demoWindow(45,a.started).end;
    saveAttempt(a);router.push(attemptUrl(a)+(a.submitted?"/result":""));
  }
  return <main className={s.page}><div className={s.stack}><Link className={s.backLink} href="/student/rooms">Phòng thi</Link>
    <div className={s.split}><section className={s.hero}><div className={s.stack}><span className={s.badge}>{prior?.submitted?"Đã làm":r.state} · {r.id}</span><p>{r.title}</p><h1>{r.topic}</h1><h3>{r.count} câu · {r.minutes} phút</h3></div></section>
    <aside className={s.panel}><div className={s.stack}><h2>Trước khi vào thi</h2><p>Bạn có thể đổi đáp án và đánh dấu câu để xem lại. Khi đồng hồ về 0, bài sẽ được chốt.</p><p className={s.muted}>Phòng mô phỏng · Tiến độ được lưu trên trình duyệt này.</p>
    {r.state==="Đã làm"?<Link className={s.primary} href={"/student/exams/"+r.id+"/result"}>Xem kết quả</Link>:<button className={s.primary} disabled={r.state!=="Đang mở" || !attempts} onClick={enter}>{prior?.submitted?"Xem kết quả":prior?"Tiếp tục bài thi":r.state==="Đang mở"?"Bắt đầu làm bài":r.state}</button>}</div></aside></div></div></main>;
}

export function Practice() {
  const [topic,setTopic]=useState<Topic>(topics[0]);
  const [level,setLevel]=useState<Difficulty>("Trung bình");
  const [count,setCount]=useState(10);
  const attempts=useAttempts()??[]; const router=useRouter();
  function start(){const a=createAttempt("practice",topic,count,level);saveAttempt(a);router.push(attemptUrl(a));}
  return <main className={s.page} data-tone="gold">
    <div className={s.split}><section className={s.hero}><div className={s.stack}><h1>Tạo lượt luyện tập</h1><label className={s.field}>Chủ đề<select value={topic} onChange={e=>setTopic(e.target.value as Topic)}>{topics.map(t=><option key={t}>{t}</option>)}</select></label>
    <fieldset><legend>Độ khó</legend><div className={s.actions}>{(["Dễ","Trung bình","Khó"] as const).map(l=><button className={s.option} aria-pressed={l===level} key={l} onClick={()=>setLevel(l)}>{l}</button>)}</div></fieldset>
    <fieldset><legend>Số câu</legend><div className={s.actions}>{[5,10,20].map(n=><button className={s.option} aria-pressed={count===n} key={n} onClick={()=>setCount(n)}>{n} câu</button>)}</div></fieldset>
    <div><button className={s.primary} onClick={start}>Bắt đầu luyện tập →</button></div></div></section>
    <aside className={s.panel}><h2>Lượt luyện gần đây</h2><ul className={s.list}>{attempts.filter(a=>a.mode==="practice"&&!a.submitted).map(a=><li key={a.id}><Link className={s.link} href={attemptUrl(a)}>Tiếp tục · {a.topic}</Link></li>)}{history(attempts).filter(a=>a.mode==="practice").slice(0,5).map(a=><li key={a.id}><Link className={s.row} href={attemptUrl(a)+"/result"}><strong>{a.topic}</strong><span>{a.correct}/{a.total} →</span></Link></li>)}</ul></aside></div></main>;
}
