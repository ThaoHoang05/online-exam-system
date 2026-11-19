"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { HeaderArt } from "@/components/layout/HeaderArt";
import { attemptUrl,history,topics,useAttempts } from "./study";
import s from "./study.module.css";

export function Statistics(){
  const all=useAttempts()??[];
  const [mode,setMode]=useState("all");
  const rows=history(all).filter(r=>mode==="all"||r.mode===mode);
  const [page,setPage]=useState(1);
  const trigger=useRef<HTMLButtonElement>(null);
  const menu=useRef<HTMLDivElement>(null);
  const filters=[{id:"all",label:"Tất cả lượt làm"},{id:"exam",label:"Bài thi"},{id:"practice",label:"Luyện tập"}];
  const pages=Math.max(1,Math.ceil(rows.length/5));
  const current=Math.min(page,pages);
  const shown=rows.slice((current-1)*5,current*5);
  const time=(stamp:number)=>new Date(stamp).toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"});
  const total=rows.reduce((v,r)=>v+r.total,0);
  const correct=rows.reduce((v,r)=>v+r.correct,0);
  const trend=rows.slice(0,8).reverse().map((r,i,arr)=>[arr.length===1?150:20+260*i/(arr.length-1),100-80*r.correct/r.total]);
  const ratios=topics.map(t=>{const group=rows.filter(r=>r.topic===t);return group.reduce((v,r)=>v+r.correct,0)/(group.reduce((v,r)=>v+r.total,0)||1)});
  function radar(values:number[]){return values.map((v,i)=>{const angle=i*2*Math.PI/3-Math.PI/2;return [150+80*v*Math.cos(angle),96+80*v*Math.sin(angle)].join(",")}).join(" ");}
  return <main className={s.page} data-tone="green"><div className={s.heading}><div className={s.actions}><span className={s.mark}><HeaderArt name="chart"/></span><h1>Thống kê cá nhân</h1></div><div className={s.statsFilter}>
      <button type="button" ref={trigger} popoverTarget="attempt-filter" className={s.filterTrigger} aria-label={"Lọc lịch sử: "+filters.find(f=>f.id===mode)?.label}>{filters.find(f=>f.id===mode)?.label}<span aria-hidden="true">▾</span></button>
      <div popover="auto" id="attempt-filter" ref={menu} className={s.filterMenu} onKeyDown={e=>{
        if(e.key!=="ArrowDown" && e.key!=="ArrowUp") return;
        e.preventDefault();
        const buttons=Array.from(e.currentTarget.querySelectorAll("button"));
        const index=buttons.indexOf(document.activeElement as HTMLButtonElement);
        buttons[(index+(e.key==="ArrowDown"?1:-1)+buttons.length)%buttons.length].focus();
      }}>
        {filters.map(f=><button key={f.id} type="button" aria-pressed={mode===f.id} onClick={()=>{
          setMode(f.id); setPage(1); menu.current?.hidePopover(); trigger.current?.focus();
        }}>{f.label}<span aria-hidden="true">{mode===f.id?"✓":""}</span></button>)}
      </div></div></div>
    <div className={s.stack}><section className={s.hero}><div className={s.row}><div><p>Tỷ lệ trả lời đúng</p><strong className={s.number}>{total?Math.round(correct/total*100):0}%</strong></div><div><h2>{correct}/{total}</h2><p>qua {rows.length} lượt đã hoàn thành</p></div></div></section>
    <div className={s.grid}><section className={s.panel}><h2>Tiến bộ theo lượt</h2><p className={s.muted}>Tỷ lệ đúng · từ cũ đến mới</p><svg className={s.chart} viewBox="0 0 300 125" role="img" aria-label="Tỷ lệ đúng theo thời gian. Số liệu chi tiết ở lịch sử bên dưới."><path d="M20 20H280 M20 60H280 M20 100H280" stroke="#d9dfd9"/><polyline points={trend.map(p=>p.join(",")).join(" ")} stroke="#367959" strokeWidth="3" fill="none"/>{trend.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="4" fill="#26684e"><title>{`${Math.round((100 - y) / 0.8)}%`}</title></circle>)}</svg></section>
    <section className={s.panel}><h2>Năng lực theo chủ đề</h2><svg className={s.chart} viewBox="0 0 300 175" role="img" aria-label="Biểu đồ radar tỷ lệ đúng theo chủ đề">{[1,.5].map(n=><polygon key={n} points={radar([n,n,n])} stroke="#b5c7bd" fill="none"/>)}<polygon points={radar(ratios)} stroke="#367959" strokeWidth="2" fill="#81ba9c77"/>{["Mạng","CSDL","OOP"].map((v,i)=><text key={v} x={[150,253,47][i]} y={[13,150,150][i]} textAnchor="middle" fontSize="12">{v} · {rows.some(r=>r.topic===topics[i])?Math.round(ratios[i]*100)+"%":"—"}</text>)}</svg></section></div>
    <section className={s.panel} aria-labelledby="history-heading">
      <h2 id="history-heading">Lịch sử làm bài</h2>
      <div className={s.tableWrap}><table className={s.historyTable} aria-labelledby="history-heading">
        <thead><tr>{["Chủ đề","Loại bài","Ngày làm","Bắt đầu","Kết thúc","Kết quả","Thao tác"].map(label=><th key={label} scope="col">{label}</th>)}</tr></thead>
        <tbody>{shown.map(r=><tr key={r.id}>
          <th scope="row">{r.topic}</th>
          <td><span className={s.typeTag} data-mode={r.mode}>{r.mode==="exam"?"Bài thi":"Luyện tập"}</span></td>
          <td>{new Date(r.started??r.date).toLocaleDateString("vi-VN")}</td>
          <td>{r.started?time(r.started):<span title="Chưa ghi nhận giờ bắt đầu">—</span>}</td>
          <td title={new Date(r.date).toLocaleString("vi-VN")}>{time(r.date)}</td>
          <td><strong>{r.correct}/{r.total}</strong></td>
          <td><Link className={s.reviewLink} aria-label={"Xem lại "+r.topic} href={attemptUrl(r)+"/result?from=statistics"}>Xem lại <span aria-hidden="true">→</span></Link></td>
        </tr>)}</tbody>
      </table></div>
      {pages>1 && <nav className={s.pagination} aria-label="Phân trang lịch sử">
        <button type="button" disabled={current===1} onClick={()=>setPage(current-1)}>← Trước</button>
        <span aria-live="polite">Trang {current} / {pages}</span>
        <button type="button" disabled={current===pages} onClick={()=>setPage(current+1)}>Sau →</button>
      </nav>}
    </section></div></main>;
}