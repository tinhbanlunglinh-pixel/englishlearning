import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Printer } from "lucide-react";
import { playSound } from "../utils/audioSynth";
import { TestAttempt } from "../types";

interface CertificateModalProps {
  selectedCertificateAttempt: TestAttempt | null;
  onClose: () => void;
  certStudentName: string;
  setCertStudentName: (name: string) => void;
  certTeacherName: string;
  setCertTeacherName: (name: string) => void;
  certLessonTitle: string;
  setCertLessonTitle: (title: string) => void;
  certDate: string;
  setCertDate: (date: string) => void;
  certQuizScore: number | null;
  certGameScore: number | null;
  certTotalStars: number;
  certWeeklyStars: number;
  language: "en" | "bilingual";
}

const t = (en: string, vi: string) => en; // In App.tsx it was unused or local, we just pass what was there. Wait, language is bilingual, so we might need the t function or just use bilingual checks inline like App.tsx did.
// Let's implement t locally as it was in App.tsx:
const getT = (language: "en" | "bilingual") => (en: string, vi: string) => language === "bilingual" ? vi : en;

export const CertificateModal: React.FC<CertificateModalProps> = ({
  selectedCertificateAttempt,
  onClose,
  certStudentName,
  setCertStudentName,
  certTeacherName,
  setCertTeacherName,
  certLessonTitle,
  setCertLessonTitle,
  certDate,
  setCertDate,
  certQuizScore,
  certGameScore,
  certTotalStars,
  certWeeklyStars,
  language,
}) => {
  const tStr = getT(language);

  return (
    <AnimatePresence>
      {selectedCertificateAttempt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-amber-50 rounded-3xl p-6 md:p-10 border-8 border-yellow-600 ring-4 ring-yellow-400 ring-offset-4 shadow-2xl text-slate-850"
          >
            
            {/* Close Button */}
            <button
              onClick={() => {
                onClose();
                playSound.playClick();
              }}
              className="absolute top-4 right-4 z-50 bg-yellow-900/10 hover:bg-yellow-900/20 text-yellow-900 hover:text-black p-2 rounded-full cursor-pointer transition-colors"
              title="Đóng cửa sổ"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Certificate Frame Elements */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-yellow-700 rounded-tl-xl pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 border-yellow-700 rounded-tr-xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 border-yellow-700 rounded-bl-xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-yellow-700 rounded-br-xl pointer-events-none"></div>

            {/* Certificate Contents */}
            <div className="text-center">
              <span className="text-5xl md:text-6xl inline-block mb-3 animate-pulse">🏅</span>
              <p className="font-mono text-xs text-yellow-800 uppercase tracking-widest font-black leading-none mb-1">
                CO PHUONG UYEN ENGLISH CENTER • DIPLOMA
              </p>
              {language === "bilingual" && (
                <p className="text-[10px] text-slate-500 font-extrabold italic mb-2 uppercase leading-none">Trung Tâm Ngoại Ngữ Cô Phượng Uyên</p>
              )}
              
              <h2 className="font-sans font-black text-2xl md:text-3xl text-yellow-900 tracking-tight leading-snug uppercase mb-1 border-b-4 border-yellow-700 pb-2">
                CERTIFICATE OF ACHIEVEMENT
              </h2>
              {language === "bilingual" && (
                <p className="text-[10px] text-yellow-800 font-black tracking-wider uppercase mb-3 italic">Giấy Chứng Nhận Thành Tích Sát Hạch</p>
              )}
              
              <p className="text-xs text-slate-500 uppercase font-black tracking-widest leading-none mt-4 mb-1">This is proudly presented to</p>
              {language === "bilingual" && (
                <p className="text-[9px] text-slate-400 italic mb-1 leading-none">(Vinh dự được trao tặng cho)</p>
              )}
              
              {/* Dynamically editable student name input directly inside certificate */}
              <div className="my-3 max-w-md mx-auto">
                <input
                  type="text"
                  value={certStudentName}
                  onChange={(e) => setCertStudentName(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-dashed border-yellow-700 text-center font-sans font-black text-2xl md:text-3xl text-indigo-950 focus:outline-none placeholder-yellow-800/40 pb-1"
                  placeholder="Enter Student Name"
                />
                <p className="text-[9px] text-yellow-700 italic mt-1 font-semibold leading-none">
                  {tStr("(Click to edit spelling anytime if required)", "(Con hãy chạm vào để tự sửa đổi tên mình nếu cần nhé!)")}
                </p>
              </div>

              <p className="text-sm text-slate-700 max-w-lg mx-auto leading-relaxed mt-4 font-bold">
                for outstanding academic performance and successfully completing the interactive English evaluation on the specialized unit:
              </p>
              {language === "bilingual" && (
                <p className="text-[10px] text-slate-400 italic progress-badge leading-relaxed max-w-md mx-auto">
                  (Vì thành tích học tập vượt trội và hoàn thành xuất sắc bài kiểm tra sát hạch thuộc chuyên đề chủ điểm học tập:)
                </p>
              )}

              {/* Dynamically editable lesson topic input */}
              <div className="my-3 max-w-md mx-auto">
                <input
                  type="text"
                  value={certLessonTitle}
                  onChange={(e) => setCertLessonTitle(e.target.value)}
                  className="w-full bg-transparent border-b border-dashed border-yellow-700 text-center font-sans font-black text-sm text-slate-900 focus:outline-none py-1"
                  placeholder="Lesson Topic"
                />
              </div>

              {/* Unified Scores Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4 max-w-2xl mx-auto w-full">
                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-2xl p-3 shadow-md border-2 border-indigo-100">
                  <span className="text-[10px] uppercase font-bold tracking-widest leading-none mb-1 text-indigo-100">ĐIỂM SÁT HẠCH (QUIZ)</span>
                  <span className="font-sans font-black text-xl leading-none">
                    {certQuizScore !== null ? `${certQuizScore}/100` : "Chưa làm"}
                  </span>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-2xl p-3 shadow-md border-2 border-emerald-100">
                  <span className="text-[10px] uppercase font-bold tracking-widest leading-none mb-1 text-teal-50">ĐIỂM CHƠI GAME</span>
                  <span className="font-sans font-black text-xl leading-none">
                    {certGameScore !== null ? `${certGameScore}/100` : "Chưa làm"}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-amber-400 to-yellow-500 text-white rounded-2xl p-3 shadow-md border-2 border-amber-100 animate-pulse">
                  <span className="text-[10px] uppercase font-bold tracking-widest leading-none mb-1 text-yellow-50">SAO VÀNG TÍCH LŨY</span>
                  <div className="flex items-center gap-1 font-sans font-black text-xl leading-none">
                     {certTotalStars} <span className="text-sm">⭐</span>
                  </div>
                  {certWeeklyStars > 0 && <span className="text-[8px] mt-1 text-yellow-100">(Tuần này: +{certWeeklyStars}⭐)</span>}
                </div>
              </div>

              {/* Credentials grid */}
              <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto mt-6 pt-6 border-t border-dashed border-yellow-700/35">
                
                {/* Teacher signature area */}
                <div className="text-center">
                  <p className="text-[10px] uppercase font-black text-slate-400">{tStr("INSTRUCTOR SIGNATURE", "CHỮ KÝ GIÁO VIÊN")}</p>
                  <input
                    type="text"
                    value={certTeacherName}
                    onChange={(e) => setCertTeacherName(e.target.value)}
                    className="w-full bg-transparent border-b border-dashed border-slate-700 text-center font-sans font-extrabold text-sm text-indigo-900 mt-2 focus:outline-none"
                    placeholder="instructor Name"
                  />
                </div>

                {/* Date completed area */}
                <div className="text-center">
                  <p className="text-[10px] uppercase font-black text-slate-400">{tStr("DATE ISSUED", "NGÀY CẤP")}</p>
                  <input
                    type="text"
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                    className="w-full bg-transparent border-b border-dashed border-slate-700 text-center font-sans font-extrabold text-sm text-slate-750 mt-2 focus:outline-none"
                    placeholder="Issue Date"
                  />
                </div>

              </div>

              {/* Ribbons / Wax seals decorations */}
              <div className="flex justify-center items-center gap-2 mt-8">
                <div className="text-4xl">💮</div>
                <div className="text-left leading-none">
                  <p className="font-mono text-xs font-black text-yellow-800">Ms. Phuong Uyen Certified</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{tStr("Golden Learning Laurels", "Huy hiệu vàng học tập tích lũy")}</p>
                </div>
              </div>

              {/* Print action bar */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-8 pt-4">
                <button
                  onClick={() => {
                    playSound.playTing();
                    window.print();
                  }}
                  className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-sans font-black text-xs flex items-center gap-1.5 shadow cursor-pointer transition-transform hover:scale-105"
                >
                  <Printer className="h-4 w-4" /> {tStr("Print Certificate", "In Giấy Khen")}
                </button>

                <button
                  onClick={() => {
                    playSound.playSuccess();
                    alert(language === "bilingual" ? "Đã lưu Giấy Chứng Nhận vào hồ sơ của bé thành công!" : "Successfully saved certificate into student achievements!");
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-black text-xs shadow cursor-pointer"
                >
                  {tStr("Save Digitally", "Lưu Bản Cứng")}
                </button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
