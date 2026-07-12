import React from "react";
import { Home } from "lucide-react";
import { playSound } from "../utils/audioSynth";
import { LogoSVG } from "../data/constants";

interface AppHeaderProps {
  activePortal: "landing" | "student" | "teacher";
  setActivePortal: (portal: "landing" | "student" | "teacher") => void;
  currentGoldStars: number;
  dailyStars: number;
  currentLevel: number;
  studentLevel: string;
  studentCustomName: string;
  setStudentCustomName: (name: string) => void;
  setLoggedInStudent: (student: any) => void;
  setActiveTab: (tab: any) => void;
  language?: "en" | "bilingual";
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activePortal,
  setActivePortal,
  currentGoldStars,
  dailyStars,
  currentLevel,
  studentLevel,
  studentCustomName,
  setStudentCustomName,
  setLoggedInStudent,
  setActiveTab,
  language = "bilingual",
}) => {
  const t = (en: string, vi: string) => language === "bilingual" ? vi : en;

  return (
    <header className="bg-gradient-to-r from-[#034CBD] via-[#0E73FF] to-[#0A4FB2] text-white py-4 px-6 shadow-md border-b-8 border-[#04337b]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo brand click to return home */}
        <div
          onClick={() => {
            setActivePortal("landing");
            playSound.playTing();
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="bg-white p-1.5 rounded-2xl shadow-inner border-2 border-blue-200 transition-transform group-hover:scale-105 flex items-center justify-center shrink-0 w-16 h-16">
            <LogoSVG className="h-full w-auto" />
          </div>
          <div>
            <h1 className="font-sans font-black text-lg md:text-2xl tracking-tight text-white drop-shadow-md uppercase leading-none">
              Cô Phượng Uyên
            </h1>
            <p className="text-[10px] md:text-xs text-blue-100 font-extrabold font-sans tracking-wide mt-1">
              Learn today, better tomorrow 🌟
            </p>
          </div>
        </div>

        {/* User Score & Nav Control Stats */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          
          {/* Dynamic Star rewards counter */}
          <div className="bg-white/20 px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/30 backdrop-blur-sm">
            <span className="text-2xl animate-spin">🌟</span>
            <div>
              <p className="text-[10px] text-yellow-500 font-bold uppercase leading-tight">Tích lũy của bé</p>
              <p className="font-mono font-black text-white text-md tracking-wider leading-none">
                {currentGoldStars} Sao Vàng
              </p>
            </div>
          </div>

          {/* Daily Stars tracker */}
          <div className="bg-[#FFF5D6]/20 px-4 py-2 rounded-2xl flex items-center gap-2 border border-yellow-300/30 backdrop-blur-sm">
            <span className="text-2xl animate-bounce">📅</span>
            <div>
              <p className="text-[10px] text-yellow-300 font-bold uppercase leading-tight">Hôm nay nhận</p>
              <p className="font-mono font-black text-white text-md tracking-wider leading-none">
                +{dailyStars} Sao Vàng
              </p>
            </div>
          </div>

          {/* Level Counter badge */}
          <div className="bg-white/20 px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/30 backdrop-blur-sm">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="text-[10px] text-yellow-500 font-bold uppercase leading-tight">Cấp độ</p>
              <p className="font-sans font-black text-white text-md tracking-wider leading-none uppercase">
                {studentLevel === "pre-starter" ? "PRE-STARTER" : studentLevel === "mover" ? "MOVER" : studentLevel === "flyer" ? "FLYER" : studentLevel === "starter" ? "STARTER" : `LEVEL ${currentLevel}`}
              </p>
            </div>
          </div>

          {/* Direct Home trigger */}
          <button
            onClick={() => {
              setActivePortal("landing");
              playSound.playTing();
            }}
            className="p-3 bg-white hover:bg-yellow-50 text-indigo-950 rounded-2xl border-b-4 border-yellow-300 shadow-md cursor-pointer flex items-center gap-1 text-xs font-black transition-transform active:scale-95"
          >
            <Home className="h-5 w-5" />
            <span>{t("Home", "Trang Chủ")} 🏠</span>
          </button>

          {activePortal === "landing" && (
            <button
              onClick={() => {
                if (!studentCustomName.trim()) {
                  setStudentCustomName("Học Sinh Bé Ngoan");
                  setLoggedInStudent({
                    name: "Học Sinh Bé Ngoan",
                    classId: "free",
                    className: "Lớp Học Cô Phượng Uyên",
                    teacherName: "Cô Phượng Uyên"
                  });
                }
                setActivePortal("student");
                setActiveTab("learn");
                playSound.playTing();
              }}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl border-b-4 border-indigo-800 shadow-md cursor-pointer flex items-center gap-1.5 text-xs font-black transition-transform active:scale-95"
            >
              <span>Góc Học Tập 🎒</span>
            </button>
          )}

          {activePortal === "student" && (
            <button
              onClick={() => {
                setActivePortal("landing");
                playSound.playTing();
              }}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl border-b-4 border-emerald-800 shadow-md cursor-pointer flex items-center gap-1.5 text-xs font-black transition-transform active:scale-95"
            >
              <span>Sáng Tạo Bài Học 🪄</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
