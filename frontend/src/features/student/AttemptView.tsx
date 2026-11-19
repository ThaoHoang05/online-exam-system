"use client";
import { PageLoading } from "@/components/ui/PageLoading";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAttempts, saveAttempt, readAttempts, attemptUrl, history, type Attempt } from "./study";
import s from "./study.module.css";
import { ExamWorkspace } from "./ExamWorkspace";

type Props = { mode: Attempt["mode"]; result?: boolean };
export function AttemptView({mode,result}:Props) {
  const params=useParams<{id?:string;attemptId?:string}>();
  const id=params.id??params.attemptId;
  const all=useAttempts();
  const router=useRouter();
  const dialog=useRef<HTMLDialogElement>(null);
  const [now,setNow]=useState(0);
  const [review,setReview]=useState("Tất cả");
  const a=all?.find(item=>item.id===id && item.mode===mode);
  const origin=useSearchParams().get("from");
  const fromStats=result && origin==="statistics";
  const back=fromStats?"/student/statistics":mode==="exam"?"/student/rooms":"/student/practice";
  const score=history(all??[]).find(item=>item.id===id&&item.mode===mode);
  useEffect(()=>{
    if(!a || result) return;
    if(a.submitted){router.replace(attemptUrl(a)+"/result");return;}
    if(!a.end) return;
    const deadline=a.end;
    function tick(){
      const current=Date.now();setNow(current);
      if(current>=deadline){
        const latest=readAttempts().find(item=>item.id===id);
        if(latest&&!latest.submitted)saveAttempt({...latest,submitted:deadline});
      }
    }
    const timer=setInterval(tick,250);return ()=>clearInterval(timer);
  },[a,id,result,router]);
  if(!all) return <PageLoading label="Đang tải lượt làm bài…" />;
  if(result && score){
    return <main className={s.page} data-tone={mode==="practice"?"gold":"violet"}><div className={s.stack}>
      <Link className={s.backLink} href={back}>{fromStats?"Thống kê":mode==="exam"?"Phòng thi":"Luyện tập"}</Link>
      <section className={s.hero}><div className={s.stack}><span className={s.badge}>{mode==="exam"?"Đã công bố kết quả":"Đã hoàn thành luyện tập"}</span>
      <h1>{score.topic}</h1><div><p>Số câu đúng</p><strong className={s.number}>{score.correct}/{score.total}</strong></div>
      {a&&<p>{score.total-score.correct-a.answers.filter(x=>x===null).length} sai · {a.answers.filter(x=>x===null).length} bỏ trống</p>}
      <div className={s.actions}><Link className={s.primary} href={mode==="practice"?back:"/student/statistics"}>{mode==="practice"?"Luyện tập tiếp":"Xem thống kê"}</Link></div></div></section>
      {a&&mode==="practice"&&<section className={s.panel}><h2>Xem lại câu hỏi</h2><div className={s.tabs}>{["Tất cả","Sai hoặc bỏ trống"].map(t=><button key={t} aria-pressed={t===review} onClick={()=>setReview(t)}>{t}</button>)}</div>
      {review!=="Tất cả"&&score.correct===score.total&&<p>Bạn đã trả lời đúng tất cả các câu.</p>}
      {a.questions.map((q,i)=>(review==="Tất cả" || q.correct!==a.answers[i])&&<details key={i}><summary>Câu {i+1} · {a.answers[i]===null?"Bỏ trống":a.answers[i]===q.correct?"Đúng":"Sai"}</summary><p>{q.text}</p><p>Bạn chọn: {q.options[a.answers[i]??-1]??"Bỏ trống"} · Đáp án đúng: {q.options[q.correct]}</p></details>)}</section>}</div></main>;
  }
  if(!a || result || a.submitted) return <main className={s.page}><h1>{a?"Lượt làm bài":"Không tìm thấy lượt làm bài"}</h1><Link className={a?s.link:s.backLink} href={a?attemptUrl(a)+(a.submitted?"/result":""):back}>{a?"Mở lượt làm bài":"Quay lại danh sách"}</Link></main>;
  const q=a.questions[a.index];
  const answered=a.answers.filter(v=>v!==null).length;
  const seconds=Math.max(0,Math.ceil(((a.end??0)-(now||a.started))/1000));
  function update(patch:Partial<Attempt>){
    if(!a)return;
    const latest=readAttempts().find(item=>item.id===a.id);
    if(!latest || latest.submitted)return;
    if(latest.end && Date.now()>=latest.end){saveAttempt({...latest,submitted:latest.end});return;}
    saveAttempt({...latest,...patch});
  }
  const confirmation = <dialog ref={dialog} className={s.modal}><div className={s.stack}><h2>Nộp bài?</h2><p>{answered===a.questions.length?"Bạn đã trả lời tất cả các câu.":`Bạn còn ${a.questions.length-answered} câu chưa trả lời.`}</p><div className={s.actions}><button className={s.secondary} onClick={()=>dialog.current?.close()}>Làm tiếp</button><button className={s.primary} onClick={()=>{dialog.current?.close();update({submitted:Date.now()});}}>Xác nhận nộp</button></div></div></dialog>;
  if(mode==="exam") return <><ExamWorkspace attempt={a} answered={answered} seconds={seconds} update={update} onSubmit={()=>dialog.current?.showModal()} />{confirmation}</>;
  return <main className={s.page} data-tone="gold"><div className={s.heading}><div><span className={s.badge}>Luyện tập · {a.title}</span><h1>{a.topic}</h1></div>
    <div className={s.actions}>{a.end&&<span className={s.clock}>Còn {Math.floor(seconds/60)}:{String(seconds%60).padStart(2,"0")}</span>}<button className={s.primary} onClick={()=>dialog.current?.showModal()}>Nộp bài</button></div></div>
    <div className={s.split}><section className={s.panel}><div className={s.stack}><div className={s.row}><strong>Câu {a.index+1} / {a.questions.length}</strong><button className={s.secondary} aria-pressed={a.flags[a.index]} onClick={()=>update({flags:a.flags.map((v,i)=>i===a.index?!v:v)})}>{a.flags[a.index]?"★ Đã đánh dấu":"☆ Đánh dấu"}</button></div><h2>{q.text}</h2>
    <div className={s.choices}>{q.options.map((option,j)=><button className={s.option} aria-pressed={a.answers[a.index]===j} key={j} onClick={()=>update({answers:a.answers.map((v,i)=>i===a.index?(v===j?null:j):v)})}>{String.fromCharCode(65+j)}.　{option}</button>)}</div>
    <div className={s.row}><button className={s.secondary} disabled={!a.index} onClick={()=>update({index:a.index-1})}>← Câu trước</button><button className={s.secondary} disabled={a.index===a.questions.length-1} onClick={()=>update({index:a.index+1})}>Câu sau →</button></div></div></section>
    <aside className={s.hero}><div className={s.stack}><h2>Danh sách câu</h2><p>{answered}/{a.questions.length} câu đã trả lời</p><div className={s.numbers}>{a.questions.map((_,i)=><button key={i} aria-label={`Câu ${i+1}${a.answers[i]!==null?", đã trả lời":""}${a.flags[i]?", đánh dấu":""}`} aria-current={i===a.index?"step":undefined} data-answered={a.answers[i]!==null} onClick={()=>update({index:i})}>{i+1}{a.flags[i]&&<sup>★</sup>}</button>)}</div><small>Tiến độ đã lưu trên trình duyệt này.</small></div></aside></div>
    {confirmation}</main>;
}
