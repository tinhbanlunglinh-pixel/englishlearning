import React from "react";
import { motion } from "motion/react";
import { Share2, Award, AlertCircle } from "lucide-react";
import { playSound } from "../utils/audioSynth";
import { groupLessonsByDate } from "../utils/helpers";
import { StudentRecordManager } from "../utils/studentRecords";
import { Lesson, TestAttempt } from "../types";
import { LessonCreatorForm } from "./LessonCreatorForm";
import { TestEngine } from "./TestEngine";
import { ReviewGames } from "./ReviewGames";
import { SoundButton } from "./SoundButton";
import { AudioRecorder } from "./AudioRecorder";

interface StudentPortalProps {
  activeLesson: any;
  activeTab: "learn" | "listen" | "read" | "games" | "test" | "create";
  setActiveTab: (tab: any) => void;
  selectedLessonId: string;
  activeWordIdx: number;
  setActiveWordIdx: (idx: number) => void;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  nextWord: () => void;
  prevWord: () => void;
  activeTestActive: boolean;
  setActiveTestActive: (active: boolean) => void;
  activeGamesActive: boolean;
  setActiveGamesActive: (active: boolean) => void;
  testReport: any;
  setTestReport: (report: any) => void;
  quizSettingsCount: 10 | 20 | 30;
  setQuizSettingsCount: (count: any) => void;
  loggedInStudent: any;
  studentLessons: any[];
  lessonsList: any[];
  studySessions: any[];
  handleCopyShareLink: (lessonId: string) => void;
  enterLessonToStudy: (lessonId: string) => void;
  handleVocalComplete: (url: string) => void;
  triggerStarAward: (amt: number) => void;
  openCertificate: (attempt: any) => void;
  handleStudentGenerateLessonSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
  createMethod: "topic" | "text" | "image";
  setCreateMethod: (method: any) => void;
  studentTopic: string;
  setStudentTopic: (topic: string) => void;
  studentRawContent: string;
  setStudentRawContent: (content: string) => void;
  studentUploadedFile: any;
  setStudentUploadedFile: (file: any) => void;
  isStudentDraggingFile: boolean;
  setIsStudentDraggingFile: (dragging: boolean) => void;
  studentLevel: string;
  setStudentLevel: (level: string) => void;
  setTestAttempts: (attempts: any) => void;
  setApiSuccessMsg: (msg: string | null) => void;
  language?: "en" | "bilingual";
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  activeLesson,
  activeTab,
  setActiveTab,
  selectedLessonId,
  activeWordIdx,
  setActiveWordIdx,
  isFlipped,
  setIsFlipped,
  nextWord,
  prevWord,
  activeTestActive,
  setActiveTestActive,
  activeGamesActive,
  setActiveGamesActive,
  testReport,
  setTestReport,
  quizSettingsCount,
  setQuizSettingsCount,
  loggedInStudent,
  studentLessons,
  lessonsList,
  studySessions,
  handleCopyShareLink,
  enterLessonToStudy,
  handleVocalComplete,
  triggerStarAward,
  openCertificate,
  handleStudentGenerateLessonSubmit,
  isGenerating,
  createMethod,
  setCreateMethod,
  studentTopic,
  setStudentTopic,
  studentRawContent,
  setStudentRawContent,
  studentUploadedFile,
  setStudentUploadedFile,
  isStudentDraggingFile,
  setIsStudentDraggingFile,
  studentLevel,
  setStudentLevel,
  setTestAttempts,
  setApiSuccessMsg,
  language = "bilingual"
}) => {
  const t = (en: string, vi: string) => language === "bilingual" ? vi : en;

  return (
    <div className="flex flex-col gap-8">
      
      {/* Subject selector and active lesson headline card with direct share options */}
      <div className="bg-gradient-to-r from-sky-400 via-indigo-400 to-indigo-500 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-b-8 border-indigo-600">
        <div className="flex items-center gap-3">
          <span className="text-5xl">🎒</span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-sans font-black text-lg md:text-2xl drop-shadow-sm leading-tight">
                {activeLesson?.title || "Từ vựng tiếng Anh đầu đời"}
              </h3>
              
              {/* Share Button directly for students */}
              <button
                onClick={() => {
                  if(activeLesson) handleCopyShareLink(activeLesson.id);
                }}
                className="px-2.5 py-1 bg-white/15 hover:bg-white/20 border border-white/30 rounded-xl text-[10px] font-sans font-black flex items-center gap-1 cursor-pointer"
                title="Nhanh chóng lấy link chia sẻ bài học này"
              >
                <Share2 className="h-3 w-3" />
                Chia Sẻ 🔗
              </button>

            </div>

            <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-wider mt-1 block">
              {t("Target Level", "Trình độ mục tiêu")}: <span className="text-yellow-300 font-extrabold">{String(activeLesson?.level || "STARTER").toUpperCase()}</span>
            </p>
            
            {loggedInStudent && (
              <div className="mt-2 inline-flex items-center gap-1.5 bg-indigo-900/35 px-3 py-1 rounded-full border border-indigo-200/20 text-xs font-sans font-black">
                <span className="animate-pulse">👤</span>
                Bé Đang Học: <span className="text-yellow-300 font-black">{loggedInStudent.name}</span> ({loggedInStudent.className})
              </div>
            )}
          </div>
        </div>

        {/* Set up custom test settings */}
        <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
          <div className="text-right">
            <p className="text-[10px] text-indigo-100 font-bold uppercase">Sát hạch thử</p>
            <select
              value={quizSettingsCount}
              onChange={(e) => {
                setQuizSettingsCount(Number(e.target.value) as any);
                playSound.playClick();
              }}
              className="bg-transparent text-white font-sans font-black outline-none border-b border-white cursor-pointer"
            >
              <option value="10" className="text-slate-800">Kiểm tra 10 câu</option>
              <option value="20" className="text-slate-800">Kiểm tra 20 câu</option>
              <option value="30" className="text-slate-800">Kiểm tra 30 câu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Test Launcher OR Arcade Launcher trigger */}
      {activeTestActive ? (
        // EXAM ZONE ENABLED
        <TestEngine
          words={activeLesson.words}
          questionCount={quizSettingsCount}
          level={activeLesson.level}
          onExit={() => {
            setActiveTestActive(false);
            playSound.playClick();
          }}
          onFinish={(res: any) => {
            setTestReport(res);
            setActiveTestActive(false);

            // Every time they do well, they earn stars. Sát hạch done: gift gold!
            const earnedStars = res.score === 100 ? 50 : res.score >= 80 ? 35 : 15;
            triggerStarAward(earnedStars);
            
            if (loggedInStudent && loggedInStudent.phone && activeLesson) {
              StudentRecordManager.updateLessonResult(loggedInStudent.phone, activeLesson.id, {
                quizScore: res.score,
                starsEarned: earnedStars
              });
            }

            // LOG SUBMISSION RECORD IN GLOBAL LOCAL DATABASE
            const isLateSubmitted = activeLesson.deadline ? Date.now() > activeLesson.deadline : false;
            const logAttempt: TestAttempt = {
              id: `att-${Date.now()}`,
              studentName: loggedInStudent?.name || "Học sinh tự điền",
              classId: loggedInStudent?.classId || "free",
              className: loggedInStudent?.className || "Tự Do QL",
              lessonId: activeLesson.id,
              lessonTitle: activeLesson.title,
              score: res.score,
              level: activeLesson.level,
              timestamp: Date.now(),
              teacherName: loggedInStudent?.teacherName || "Cô Thảo",
              isLate: isLateSubmitted
            };

            setTestAttempts((prev: any) => [logAttempt, ...prev]);

            // Sync to backend api for persistence of student scores
            fetch("/api/attempts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(logAttempt)
            })
            .then((response) => {
              if (response.ok && isLateSubmitted) {
                setApiSuccessMsg("⏰ Bé đã nộp sát hạch thành công! Do quá hạn chót nên bài của con sẽ được đánh dấu 'Nộp muộn' nhé. Vẫn rất giỏi nè! 🥳");
                setTimeout(() => setApiSuccessMsg(null), 4500);
              }
            })
            .catch((err) => console.error("Error syncing attempts:", err));
          }}
        />
      ) : activeGamesActive ? (
        // REVIEW GAMES ENABLED
        <ReviewGames
          words={activeLesson.words}
          onExit={() => {
            setActiveGamesActive(false);
            playSound.playClick();
          }}
          onEarnStars={(earned: number) => {
            triggerStarAward(earned);
          }}
          onFinishAll={(earnedStars: number) => {
            setActiveGamesActive(false);
            playSound.playSuccess();
            setApiSuccessMsg("🎉 Tuyệt vời! Bé đã hoàn thành tất cả vòng chơi xuất sắc và tích lũy thật nhiều Sao Vàng! ⭐");
            setTimeout(() => setApiSuccessMsg(null), 5000);
          }}
        />
      ) : (
        // DEFAULT PORTAL MODULES
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Visual Roadmap Nav Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border-4 border-indigo-100 flex flex-col gap-3 h-fit">
            <h4 className="font-sans font-black text-slate-700 text-xs mb-2 uppercase tracking-wider border-b border-indigo-50 pb-2">Learning Station</h4>
            
            {/* Unique Creator Action - Removed from index list per user feedback */}
            <button
              onClick={() => {
                setActiveTab("create");
                playSound.playClick();
              }}
              className={`p-4 rounded-2xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer border-2 ${
                activeTab === "create"
                  ? "bg-emerald-100 border-emerald-400 text-emerald-950 font-black shadow-md scale-[1.02]"
                  : "bg-emerald-50/40 border-emerald-100/60 hover:bg-emerald-50 text-emerald-800 font-extrabold"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl animate-pulse">🪄</span>
                <span className="text-xs uppercase tracking-wide">Create AI Lesson</span>
              </div>
              {activeTab !== "create" && (
                <span className="text-[9px] bg-emerald-500 text-white font-sans font-black px-1.5 py-0.5 rounded-full animate-pulse uppercase">NEW</span>
              )}
            </button>

            <div className="border-t border-slate-100 my-1"></div>

            <button
              onClick={() => {
                setActiveTab("learn");
                playSound.playClick();
              }}
              className={`p-4 rounded-xl text-left flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === "learn"
                  ? "bg-amber-100 text-amber-900 font-black border-l-4 border-amber-500"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold"
              }`}
            >
              <span className="text-xl">🎨</span> 1. Learn Vocabulary
            </button>

            <button
              onClick={() => {
                setActiveTab("listen");
                playSound.playClick();
              }}
              className={`p-4 rounded-xl text-left flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === "listen"
                  ? "bg-sky-100 text-sky-900 font-black border-l-4 border-sky-500"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold"
              }`}
            >
              <span className="text-xl">🎧</span> 2. Listening Practice
            </button>

            <button
              onClick={() => {
                setActiveTab("read");
                playSound.playClick();
              }}
              className={`p-4 rounded-xl text-left flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === "read"
                  ? "bg-purple-100 text-purple-900 font-black border-l-4 border-purple-500"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold"
              }`}
            >
              <span className="text-xl">🗣️</span> 3. Speaking Practice
            </button>

            {/* Trigger review games */}
            <button
              onClick={() => {
                setActiveGamesActive(true);
                playSound.playClick();
              }}
              className="p-4 rounded-xl text-left flex items-center gap-3 bg-gradient-to-r from-emerald-400 to-green-500 hover:brightness-105 text-white font-black cursor-pointer shadow-md duration-200"
            >
              <span className="text-xl animate-bounce">🎮</span> Play Games
            </button>

            {/* Trigger test */}
            <button
              onClick={() => {
                setActiveTestActive(true);
                playSound.playClick();
              }}
              className="p-4 rounded-xl text-left flex items-center gap-3 bg-gradient-to-r from-pink-400 to-rose-500 hover:brightness-105 text-white font-black cursor-pointer shadow-md"
            >
              <span className="text-xl">🏆</span> Take Quiz
            </button>

            {/* Class Lessons Assigned */}
            <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/60 flex flex-col gap-2.5 mt-4">
              <div className="border-b border-dashed border-amber-300 pb-1.5 flex justify-between items-center">
                <h5 className="font-sans font-black text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1">
                  Class Lessons 📅
                </h5>
              </div>
              
              <div className="flex flex-col gap-3.5 max-h-[220px] overflow-y-auto pr-1">
                {studentLessons.length === 0 ? (
                  <p className="text-[10px] text-amber-800 bg-amber-50/50 border border-dashed border-amber-200/80 rounded-xl p-3 text-center font-bold font-sans">
                    No lessons are assigned to your classroom yet! Please check back later. ✨
                  </p>
                ) : (
                  Object.entries(groupLessonsByDate(studentLessons)).map(([dateStr, lessons]) => (
                    <div key={dateStr} className="flex flex-col gap-1.5 pt-0.5">
                      <div className="text-[9px] font-sans font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200/50 w-fit uppercase tracking-wider">
                        {dateStr}
                      </div>
                      <div className="flex flex-col gap-1.5 pl-1">
                        {lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => enterLessonToStudy(lesson.id)}
                            className={`w-full text-left p-2.5 rounded-xl border text-[11px] font-bold transition-all relative cursor-pointer truncate ${
                              selectedLessonId === lesson.id
                                ? "bg-amber-100 border-amber-400 text-amber-950 font-black shadow-sm scale-[1.01]"
                                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                            }`}
                          >
                            <div className="flex items-center gap-1 truncate">
                              <span className="text-sm shrink-0">{lesson.level === "preschool" ? "🧸" : "⚡"}</span>
                              <span className="truncate">{lesson.title}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Study History section (Weekly) */}
            <div className="bg-sky-50/50 rounded-2xl p-4 border border-sky-200/60 flex flex-col gap-2.5 mt-3">
              <div className="border-b border-dashed border-sky-300 pb-1.5">
                <h5 className="font-sans font-black text-sky-900 text-xs uppercase tracking-wider flex items-center gap-1">
                  Weekly Study History 🕒
                </h5>
                <span className="text-[9.5px] text-sky-700 font-bold">Lessons studied in the past 7 days</span>
              </div>

              <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto pr-1">
                {studySessions.filter(s => {
                  if (!loggedInStudent) return false;
                  return s.studentName.toLowerCase() === loggedInStudent.name.toLowerCase() && s.classId === loggedInStudent.classId;
                }).length === 0 ? (
                  <p className="text-[10px] text-sky-800 bg-sky-50/50 border border-dashed border-sky-100 rounded-xl p-3 text-center font-semibold font-sans">
                    You haven't studied any lessons yet this week. ⭐
                  </p>
                ) : (
                  studySessions
                    .filter(s => {
                      if (!loggedInStudent) return false;
                      return s.studentName.toLowerCase() === loggedInStudent.name.toLowerCase() && s.classId === loggedInStudent.classId;
                    })
                    .map((session) => {
                      const lesson = lessonsList.find(l => l.id === session.lessonId);
                      if (!lesson) return null;
                      const dateForm = new Date(session.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                      return (
                        <button
                          key={`history-${session.lessonId}-${session.timestamp}`}
                          onClick={() => enterLessonToStudy(lesson.id)}
                          className={`w-full text-left p-2 rounded-xl border text-[11px] font-bold transition-all relative cursor-pointer truncate ${
                            selectedLessonId === lesson.id
                              ? "bg-sky-100 border-sky-300 text-sky-950 font-black shadow-sm"
                              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 truncate">
                            <div className="flex items-center gap-1.5 truncate">
                              <span>📖</span>
                              <span className="truncate">{lesson.title}</span>
                            </div>
                            <span className="text-[9px] font-mono opacity-70 shrink-0 bg-slate-100 px-1 py-0.5 rounded">{dateForm}</span>
                          </div>
                        </button>
                      );
                    })
                )}
              </div>
            </div>
          </div>

          {/* Sub-tab view contents */}
          <div className="lg:col-span-3">
            
            {/* TAB 1: CREATE (Bé Tự Tạo Bài AI) */}
            {activeTab === "create" && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border-4 border-dashed border-blue-200 shadow-lg">
                <div className="text-center mb-6 pt-2 pb-2">
                  <h3 className="font-sans font-black text-lg md:text-2xl text-emerald-600 uppercase tracking-tight animate-bounce">
                    🎈 {t("Create a fun lesson here!", "Bé hãy sáng tạo bài học vui nhộn ở đây nhé!")} 🎈
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-400 font-extrabold italic mt-1.5 uppercase">
                    "Learn today, better tomorrow 🌟"
                  </p>
                </div>

                <LessonCreatorForm
                  onSubmit={handleStudentGenerateLessonSubmit}
                  isGenerating={isGenerating}
                  createMethod={createMethod}
                  setCreateMethod={setCreateMethod}
                  studentTopic={studentTopic}
                  setStudentTopic={setStudentTopic}
                  studentRawContent={studentRawContent}
                  setStudentRawContent={setStudentRawContent}
                  studentUploadedFile={studentUploadedFile}
                  setStudentUploadedFile={setStudentUploadedFile}
                  isStudentDraggingFile={isStudentDraggingFile}
                  setIsStudentDraggingFile={setIsStudentDraggingFile}
                  studentLevel={studentLevel}
                  setStudentLevel={setStudentLevel}
                  language={language}
                />
              </div>
            )}

            {/* TAB 1: LEARN (Học từ vựng) */}
            {activeTab === "learn" && activeLesson && activeLesson.words.length > 0 && (
              <div className="flex flex-col items-center">
                <p className="text-center text-xs font-black text-slate-500 mb-6 uppercase tracking-wider">
                  {t("Tap on the card to see its English meaning ✨", "Bé chạm vào thẻ để xem nghĩa tiếng Việt nhé ✨")}
                </p>

                <div className="relative w-80 h-96 cursor-pointer group mb-6" onClick={() => {
                  setIsFlipped(!isFlipped);
                  triggerStarAward(1);
                }}>
                  <div
                    className={`w-full h-full rounded-3xl p-6 transition-all duration-500 border-8 border-yellow-200 bg-white shadow-xl flex flex-col justify-between items-center ${
                      isFlipped ? "bg-amber-50" : ""
                    }`}
                  >
                    {!isFlipped ? (
                      <>
                        <div className="w-full flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full font-sans font-black">
                            {activeWordIdx + 1} / {activeLesson.words.length}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">{t("Tap to Flip ➡", "Chạm thẻ lật nghĩa ➡")}</span>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center">
                          <motion.span
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="text-8xl mb-4"
                          >
                            {activeLesson.words[activeWordIdx].illustration}
                          </motion.span>
                          <h3 className="font-sans font-black text-4xl text-indigo-900 tracking-tight">
                            {activeLesson.words[activeWordIdx].word}
                          </h3>
                          <p className="font-mono text-purple-600 text-md mt-1 italic font-semibold">
                            {activeLesson.words[activeWordIdx].phonetic}
                          </p>
                        </div>

                        <div className="w-full flex items-center justify-center pt-2">
                          <SoundButton text={activeLesson.words[activeWordIdx].word} size="lg" slow />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-full flex justify-between items-center border-b border-dashed border-amber-200 pb-2">
                          <span className="text-xs font-black text-amber-700">{t("✓ Card Details", "✓ Chi tiết thẻ")}</span>
                          <span className="text-xs font-semibold text-amber-600">{t("Flip Back ⬅", "Lật lại ⬅")}</span>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 w-full">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <h4 className="font-sans font-black text-2xl text-indigo-900">
                              {activeLesson.words[activeWordIdx].word}
                            </h4>
                            <SoundButton text={activeLesson.words[activeWordIdx].word} size="sm" slow />
                          </div>

                          <p className="font-mono text-purple-600 text-sm italic font-semibold mb-3">
                            {activeLesson.words[activeWordIdx].phonetic}
                          </p>

                          <h5 className="font-sans font-black text-xl text-amber-600 bg-amber-100/50 px-4 py-1.5 rounded-full mb-4">
                            {activeLesson.words[activeWordIdx].translation}
                          </h5>
                          
                          {activeLesson.words[activeWordIdx].word.toLowerCase().replace(/[^a-z]/gi, "") !== activeLesson.words[activeWordIdx].sentence.toLowerCase().replace(/[^a-z]/gi, "") && (
                            <div className="bg-indigo-50/50 rounded-2xl p-3 border border-indigo-100/50 w-full">
                              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1.5">{t("Example Sentence", "Mẫu câu")}</p>
                              <div className="flex items-center justify-center gap-2">
                                <p className="font-sans font-bold text-sm text-indigo-950 leading-snug">
                                  {activeLesson.words[activeWordIdx].sentence}
                                </p>
                                <SoundButton text={activeLesson.words[activeWordIdx].sentence} size="sm" slow />
                              </div>
                              <p className="font-sans font-medium text-xs text-slate-500 mt-1 italic leading-snug">
                                ({activeLesson.words[activeWordIdx].sentenceTranslation})
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <button
                    onClick={prevWord}
                    className="px-6 py-3 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-sans font-black text-sm cursor-pointer"
                  >
                    {t("Previous", "Từ Trước")}
                  </button>
                  <button
                    onClick={nextWord}
                    className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-white font-sans font-black text-sm cursor-pointer shadow-md"
                  >
                    {t("Next", "Từ Kế Tiếp")}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: LISTEN PRACTICE (Bé luyện nghe) */}
            {activeTab === "listen" && activeLesson && (
              <div className="bg-white rounded-3xl p-6 border-4 border-sky-100">
                <h4 className="font-sans font-black text-sky-800 text-lg mb-4 text-center">{t("Listen & Practice 🎧", "Bé Luyện Nghe Tiếng Anh 🎧")}</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeLesson.words.map((w: any) => (
                    <div
                      key={w.id}
                      className="p-4 bg-sky-50/50 rounded-2xl border-2 border-sky-100 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{w.illustration}</span>
                          <div>
                            <h5 className="font-sans font-black text-indigo-900 text-sm leading-none">{w.word}</h5>
                            <p className="text-xs text-slate-500 mt-1">{w.translation}</p>
                          </div>
                        </div>

                        <div
                          onClick={() => triggerStarAward(1)}
                          className="focus:outline-none"
                        >
                          <SoundButton text={w.word} size="md" />
                        </div>
                      </div>

                      <div className="bg-sky-100/50 rounded-xl px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-sans font-semibold text-xs text-indigo-800 leading-snug">
                              {w.sentence}
                            </p>
                            <p className="font-sans text-xs text-slate-500 mt-0.5 italic leading-snug">
                              {w.sentenceTranslation}
                            </p>
                          </div>
                          <div
                            onClick={() => triggerStarAward(1)}
                            className="focus:outline-none flex-shrink-0"
                          >
                            <SoundButton text={w.sentence} size="sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: READ RECORDING PRACTICE (Luyện đọc & Ghi âm) */}
            {activeTab === "read" && activeLesson && (
              <div className="bg-white rounded-3xl p-6 border-4 border-purple-100">
                <h4 className="font-sans font-black text-purple-800 text-lg mb-2 text-center">Phòng Thu Âm Của Bé 🎙️</h4>

                <div className="flex flex-col gap-6">
                  <div className="flex gap-2 overflow-x-auto pb-3 border-b border-purple-150">
                    {activeLesson.words.map((w: any, index: number) => (
                      <button
                        key={w.id}
                        onClick={() => {
                          setActiveWordIdx(index);
                          playSound.playClick();
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-sans font-black cursor-pointer whitespace-nowrap transition-all border-2 ${
                          activeWordIdx === index
                            ? "bg-purple-100 border-purple-400 text-purple-700"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {w.illustration} {w.word}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 items-center justify-center p-4 bg-purple-50/50 rounded-2xl">
                    <span className="text-7xl">{activeLesson.words[activeWordIdx].illustration}</span>
                    <div className="text-center md:text-left">
                      <h4 className="font-sans font-black text-2xl text-purple-900 leading-none mb-1">
                        {activeLesson.words[activeWordIdx].word}
                      </h4>
                      <p className="font-mono text-xs text-purple-500 font-semibold mb-2">
                        {activeLesson.words[activeWordIdx].phonetic}
                      </p>
                      <div className="bg-purple-100/50 rounded-xl px-3 py-2 mb-3">
                        <p className="font-sans font-semibold text-sm text-purple-900 leading-snug">
                          {activeLesson.words[activeWordIdx].sentence}
                        </p>
                        <p className="font-sans text-xs text-slate-500 mt-1 italic leading-snug">
                          {activeLesson.words[activeWordIdx].sentenceTranslation}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center justify-center md:justify-start">
                        <SoundButton text={activeLesson.words[activeWordIdx].word} size="md" />
                        <SoundButton text={activeLesson.words[activeWordIdx].sentence} size="sm" />
                      </div>
                    </div>
                  </div>

                  <AudioRecorder
                    key={activeLesson.words[activeWordIdx].id}
                    expectedText={activeLesson.words[activeWordIdx].word}
                    onRecordComplete={handleVocalComplete}
                    onNext={() => {
                      if (activeWordIdx < activeLesson.words.length - 1) {
                        setActiveWordIdx(activeWordIdx + 1);
                      } else {
                        setActiveWordIdx(0); // loop back
                      }
                      playSound.playClick();
                    }}
                  />
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* SẮP XẾP BÁO CÁO KẾT QUẢ KIỂM TRA (Test result reports) */}
      {testReport && (
        <div className="bg-white/90 rounded-3xl p-8 border-8 border-indigo-200 max-w-2xl mx-auto shadow-2xl relative text-center mt-6">
          
          <div className="text-8xl mb-4 text-center">
            {testReport.score === 100 ? "👑" : "🌟"}
          </div>
          <h4 className="font-sans font-black text-indigo-900 text-2xl mb-2">Báo Cáo Thành Tích Bài Học!</h4>
          <p className="text-xs text-slate-400 uppercase font-black mb-4">Hoàn thành kì kiểm tra sát hạch học sinh</p>

          <div className="inline-flex items-center justify-center h-28 w-28 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-600 text-white font-mono font-black text-2xl mb-6 shadow border-4 border-white animate-pulse">
            {testReport.score}/100 đ
          </div>

          <p className="text-slate-600 max-w-md mx-auto mb-6">
            Chúc mừng bé {loggedInStudent ? <span className="font-sans font-black text-indigo-750">"{loggedInStudent.name}"</span> : "đã hoàn thành"} đã trả lời đúng <span className="font-sans font-black text-indigo-750">{testReport.correctCount}</span> trên tổng số <span className="font-extrabold">{testReport.totalQuestions}</span> câu thử thách của cô giáo!
          </p>

          <div className="mb-6 bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-200 p-4 rounded-2xl max-w-md mx-auto flex flex-col items-center gap-3 shadow-inner">
            <span className="text-3xl">📜</span>
            <div className="text-center">
              <h5 className="font-sans font-black text-xs text-amber-900 leading-none">NHẬN CHỨNG CHỈ TỐT NGHIỆP</h5>
              <p className="text-[10px] text-amber-700 font-bold mt-1">Hệ thống đã cấp Giấy khen danh dự có tên của Bé!</p>
            </div>
            <button
              onClick={() => {
                const mockAttempt: TestAttempt = {
                  id: `att-now-${Date.now()}`,
                  studentName: loggedInStudent?.name || "Học Sinh Tự Điền",
                  classId: loggedInStudent?.classId || "free",
                  className: loggedInStudent?.className || "Tự do",
                  lessonId: activeLesson.id,
                  lessonTitle: activeLesson.title,
                  score: testReport.score,
                  level: activeLesson.level,
                  timestamp: Date.now(),
                  teacherName: loggedInStudent?.teacherName || "Cô Thảo"
                };
                openCertificate(mockAttempt);
              }}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-sans font-black text-xs flex items-center gap-1 cursor-pointer shadow border-b-2 border-amber-700 transition"
            >
              <Award className="h-4 w-4" /> Xem & Sửa Giấy Chứng Nhận 🏆
            </button>
          </div>

          {testReport.badgesEarned.length > 0 && (
            <div className="mb-6">
              <h5 className="font-sans font-black text-slate-600 text-xs mb-3 uppercase tracking-wider">Huy Hiệu Nhận Được</h5>
              <div className="flex flex-wrap gap-4 justify-center">
                {testReport.badgesEarned.map((badge: any) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl bg-gradient-to-b ${badge.color} text-white shadow max-w-xs flex items-center gap-3`}
                  >
                    <span className="text-4xl">{badge.icon}</span>
                    <div className="text-left">
                      <h6 className="font-sans font-black text-xs leading-none">{badge.title}</h6>
                      <p className="text-[10px] leading-tight text-white/80 mt-1">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {testReport.wrongWords.length > 0 && (
            <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 text-left max-w-md mx-auto mb-6">
              <p className="text-xs font-black uppercase text-amber-700 flex items-center gap-1.5 mb-2">
                <AlertCircle className="h-4 w-4 shrink-0" /> Từ bé cần ôn tập lại:
              </p>
              <div className="flex flex-wrap gap-2">
                {testReport.wrongWords.map((ww: any) => (
                  <span key={ww.id} className="bg-white text-slate-800 text-xs font-bold px-3 py-1 rounded shadow-sm flex items-center gap-1">
                    <span>{ww.illustration}</span> {ww.word}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 border-t border-dashed border-slate-100 pt-6">
            <button
              onClick={() => {
                  setTestReport(null);
                  setActiveTestActive(true);
                  playSound.playClick();
              }}
              className="px-6 py-2.5 rounded-full bg-slate-100 text-slate-600 font-sans font-black text-sm hover:bg-slate-200 cursor-pointer"
            >
              Làm Lại Bài Thi
            </button>

            <button
              onClick={() => {
                  setTestReport(null);
                  playSound.playTing();
              }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-sans font-black text-sm shadow hover:brightness-105 cursor-pointer"
            >
              Quay Lại Học Tiếp
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
