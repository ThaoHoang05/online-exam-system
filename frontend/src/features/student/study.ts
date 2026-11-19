"use client";
import { useSyncExternalStore } from "react";

export const topics = ["Lập trình mạng", "Cơ sở dữ liệu", "Lập trình hướng đối tượng"] as const;
export type Topic = typeof topics[number];
export type Difficulty = "Dễ" | "Trung bình" | "Khó";
export type Question = { text: string; options: string[]; correct: number };
export type Attempt = {
  id: string; mode: "exam" | "practice"; topic: Topic; title: string; questions: Question[];
  answers: (number | null)[]; flags: boolean[]; index: number; started: number; end: number | null; submitted: number | null;
};
const archivedExams = [
  {id:"LTM-101",subject:0,day:14,correct:18}, {id:"CSDL-101",subject:1,day:12,correct:15},
  {id:"OOP-104",subject:2,day:10,correct:16}, {id:"LTM-102",subject:0,day:8,correct:14},
  {id:"CSDL-103",subject:1,day:6,correct:17}, {id:"OOP-103",subject:2,day:5,correct:13},
  {id:"LTM-103",subject:0,day:3,correct:16}, {id:"OOP-102",subject:2,day:2,correct:12},
].map(exam=>({...exam,topic:topics[exam.subject],started:new Date(2026,10,exam.day,9).getTime(),date:new Date(2026,10,exam.day,9,25).getTime()}));
export const rooms = [
  {id:"LTM-204", title:"Kiểm tra giữa kỳ", topic:topics[0], state:"Đang mở", minutes:45, count:30, opens:"",closes:""},
  {id:"CSDL-106", title:"Kiểm tra chương 3", topic:topics[1], state:"Sắp diễn ra", minutes:30, count:20, opens:"09:00",closes:"09:30"},
  {id:"CSDL-102", title:"Kiểm tra chương 2", topic:topics[1], state:"Đã làm", minutes:30, count:20, opens:"09:00",closes:"09:30"},
  {id:"OOP-201", title:"Kiểm tra cuối chương", topic:topics[2], state:"Đã kết thúc", minutes:40, count:25, opens:"13:00",closes:"13:40"},
  ...archivedExams.map(e=>({id:e.id,title:"Kiểm tra chuyên đề",topic:e.topic,state:"Đã làm",minutes:30,count:20,opens:"09:00",closes:"09:30"})),
];
const key = "online-exam.demo.attempts.v1";
export function readAttempts(): Attempt[] {
  return JSON.parse(localStorage.getItem(key) || "[]");
}
export function saveAttempt(attempt: Attempt) {
  const all = readAttempts().filter(item => item.id !== attempt.id);
  localStorage.setItem(key, JSON.stringify([attempt, ...all]));
  window.dispatchEvent(new Event(key));
}
function subscribe(update: () => void) {
  window.addEventListener(key, update);
  window.addEventListener("storage", update);
  return () => { window.removeEventListener(key, update); window.removeEventListener("storage", update); };
}
export function useAttempts() {
  const raw = useSyncExternalStore(subscribe, () => localStorage.getItem(key) || "[]", () => null);
  return raw === null ? null : JSON.parse(raw) as Attempt[];
}
function question(topic: Topic, difficulty: Difficulty, i: number): Question {
  const level = ["Dễ","Trung bình","Khó"].indexOf(difficulty);
  const n = i + 3;
  const size = 2 ** (level + 1);
  let text: string;
  let answer: number;
  if (topic === topics[0]) {
    const variant = i % 3;
    if (variant === 0) { text = `Một tệp có ${n * size} KiB. Nếu chia thành các khối ${size} KiB, cần gửi bao nhiêu khối?`; answer = n; }
    else if (variant === 1) { text = `Một đoạn TCP bắt đầu ở số thứ tự ${1000+n}, chứa ${n*size} byte dữ liệu. Số thứ tự tiếp theo là bao nhiêu?`; answer = 1000+n+n*size; }
    else { text = `Ở tốc độ ${size} Mbit/s, cần bao nhiêu giây để truyền ${n*size} Mbit dữ liệu? Bỏ qua overhead.`; answer = n; }
  } else if (topic === topics[1]) {
    text = `Bảng A có ${n} bản ghi và bảng B có ${size} bản ghi. SELECT * FROM A CROSS JOIN B trả về bao nhiêu dòng?`; answer = n*size;
  } else {
    text = `Lớp cha có ${n} phương thức public. Lớp con kế thừa tất cả, ghi đè một phương thức và thêm ${size} phương thức mới. Đối tượng lớp con gọi được bao nhiêu phương thức khác nhau?`; answer = n+size;
  }
  const correct = Math.floor(Math.random()*4);
  return {text, correct, options: Array.from({length:4}, (_, j) => String(answer+j-correct))};
}
export function createAttempt(mode: Attempt["mode"], topic: Topic, count: number, difficulty: Difficulty): Attempt {
  const now = Date.now();
  return {id:mode === "exam" ? "LTM-204" : crypto.randomUUID(), mode, topic,
    title:mode === "exam" ? "Kiểm tra giữa kỳ" : difficulty, started:now, submitted:null,
    end:mode === "exam" ? now+45*60000 : null, index:0,
    questions:Array.from({length:count}, (_, i) => question(topic,difficulty,i)),
    answers:Array(count).fill(null), flags:Array(count).fill(false)};
}
export function correctCount(a: Attempt) { return a.questions.filter((q,i)=>q.correct===a.answers[i]).length; }
export function attemptUrl(a: Pick<Attempt,"mode"|"id">) { return "/student/"+(a.mode==="exam"?"exams":"practice")+"/"+a.id; }
export function history(attempts: Attempt[]) {
  return [
    ...attempts.filter(a=>a.submitted).map(a=>({id:a.id,mode:a.mode,topic:a.topic,started:a.started,date:a.submitted!,correct:correctCount(a),total:a.questions.length})),
    {id:"CSDL-102",mode:"exam" as const,topic:topics[1],started:null,date:new Date(2026,10,18,15,30).getTime(),correct:17,total:20},
    ...archivedExams.map(e=>({...e,mode:"exam" as const,total:20})),  
    {id:"oop-review",mode:"practice" as const,topic:topics[2],started:null,date:new Date(2026,10,16,20,15).getTime(),correct:16,total:20}
  ].sort((a,b)=>b.date-a.date);
}
