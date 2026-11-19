import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Attempt } from "./study";
import styles from "./exam-workspace.module.css";
import s from "./study.module.css";

function Flag() {
  return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M4 17V3c4-3 7 3 12 0v8c-5 3-8-3-12 0" /></svg>;
}

type Props = {
  attempt: Attempt;
  answered: number;
  seconds: number;
  update: (patch: Partial<Attempt>) => void;
  onSubmit: () => void;
};

export function ExamWorkspace({attempt, answered, seconds, update, onSubmit}: Props) {
  const {index, questions, answers, flags} = attempt;
  const [drafts, setDrafts] = useState<Record<number, number>>({});
  const selected = drafts[index] ?? answers[index];
  function saveAnswer() {
    if (selected === null || selected === answers[index]) return;
    update({answers: answers.map((answer, i) => i === index ? selected : answer)});
    setDrafts(previous => {
      const remaining = {...previous};
      delete remaining[index];
      return remaining;
    });
  }
  const question = questions[index];

  const active = useRef<HTMLButtonElement>(null);
  useEffect(() => { active.current?.scrollIntoView({block:"nearest"}); }, [index]);
  return <main className={styles.workspace}>
    <header className={styles.header}>
      <div className={styles.identity}><p><span>{attempt.id}</span>{attempt.title}</p><h1>{attempt.topic}</h1></div>
      <div className={styles.timer} role="timer" aria-label="Thời gian còn lại"><Icon name="clock"/><strong>{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,"0")}</strong></div>
      <button className={s.primary} onClick={onSubmit}>Nộp bài <Icon name="arrow"/></button>
    </header>
    <div className={styles.body}>
      <section className={styles.question} aria-label="Câu hỏi đang làm">
        <div className={styles.top}><strong>Câu {index+1} / {questions.length}</strong><strong>Chọn 1 đáp án</strong></div>
        <div className={styles.content} key={index} tabIndex={0} aria-label="Nội dung câu hỏi">
          <h2>{question.text}</h2>
          {question.options.map((option,j)=><button key={j} className={styles.answer} aria-pressed={selected===j} onClick={()=>setDrafts(previous=>({...previous,[index]:j}))}>
            <span aria-hidden="true" />{String.fromCharCode(65+j)}. {option}
          </button>)}
        </div>
        <div className={styles.controls}>
          <div className={styles.navigation} role="group" aria-label="Chuyển câu"><button disabled={index===0} onClick={()=>update({index:index-1})}>← Câu trước</button><button disabled={index===questions.length-1} onClick={()=>update({index:index+1})}>Câu sau →</button></div>
          <button aria-pressed={flags[index]} onClick={()=>update({flags:flags.map((v,i)=>i===index?!v:v)})}><Flag/>{flags[index]?"Đã đánh dấu":"Đánh dấu xem lại"}</button>
          <button className={styles.saveAnswer} disabled={selected===null || selected===answers[index]} onClick={saveAnswer}>Lưu câu trả lời</button>
          
        </div>
      </section>
      <aside className={styles.sidebar}>
        <h2 aria-live="polite">{answered}/{questions.length} câu đã trả lời</h2>
        <div className={styles.numberScroll}><div className={styles.numbers}>{questions.map((_,i)=>
          <button key={i} ref={i===index?active:undefined} data-answered={answers[i]!==null} aria-current={i===index?"step":undefined} aria-label={["Câu "+(i+1), answers[i]===null?"chưa trả lời":"đã trả lời",flags[i]?"đánh dấu xem lại":""].filter(Boolean).join(", ")} onClick={()=>update({index:i})}>
            {i+1}{flags[i]&&<Flag/>}
          </button>)}</div></div>
        <div className={styles.legend}><span><i data-kind="answered"/>Đã trả lời</span><span><i/>Chưa trả lời</span><span><i data-kind="current"/>Câu hiện tại</span><span><Flag/>Đánh dấu xem lại</span></div>
      </aside>
    </div>
  </main>;
}
