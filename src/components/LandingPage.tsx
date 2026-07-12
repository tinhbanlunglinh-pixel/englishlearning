import React from "react";
import { LogoSVG } from "../data/constants";
import { LessonCreatorForm } from "./LessonCreatorForm";

interface LandingPageProps {
  handleStudentGenerateLessonSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
  createMethod: "topic" | "text" | "image";
  setCreateMethod: (method: "topic" | "text" | "image") => void;
  studentTopic: string;
  setStudentTopic: (topic: string) => void;
  studentRawContent: string;
  setStudentRawContent: (content: string) => void;
  studentUploadedFile: { name: string; base64: string; type: string } | null;
  setStudentUploadedFile: (file: any) => void;
  isStudentDraggingFile: boolean;
  setIsStudentDraggingFile: (dragging: boolean) => void;
  studentLevel: string;
  setStudentLevel: (level: string) => void;
  studentCustomName: string;
  setStudentCustomName: (name: string) => void;
  studentPhoneInput: string;
  setStudentPhoneInput: (phone: string) => void;
  setLoggedInStudent: (student: any) => void;
  language?: "en" | "bilingual";
}

export const LandingPage: React.FC<LandingPageProps> = ({
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
  studentCustomName,
  setStudentCustomName,
  studentPhoneInput,
  setStudentPhoneInput,
  setLoggedInStudent,
  language = "bilingual",
}) => {
  const t = (en: string, vi: string) => language === "bilingual" ? vi : en;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      
      {/* Visual Welcome Ribbon Banner for Cô Phượng Uyên Center */}
      <div className="bg-white rounded-3xl p-6 md:p-8 text-center shadow-xl border-t-8 border-blue-600 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-50 rounded-full opacity-65"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-50 rounded-full opacity-45"></div>
        
        <div className="mx-auto mb-4 w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border-4 border-blue-100 shadow-md">
          <LogoSVG className="h-14 w-14" />
        </div>
        
        <h2 className="font-sans font-black text-2xl md:text-3xl text-blue-950 tracking-tight leading-none uppercase">
          Trung Tâm Ngoại Ngữ Cô Phượng Uyên
        </h2>
        <p className="font-sans font-black text-sm text-sky-600 uppercase tracking-widest mt-2">
          Learn today, better tomorrow 🌟
        </p>

        <div className="mt-6 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-600 border-t border-dashed border-blue-100 pt-5 font-bold">
          <div className="flex items-center gap-2">
            <span className="text-lg">👑</span>
            <p>Giám Đốc: <span className="text-blue-950 font-black">Võ Thùy Phượng Uyên</span></p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📱</span>
            <p>Hotline/Zalo: <a href="tel:0985846325" className="text-blue-700 font-black hover:underline">0985.846.325</a></p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🌐</span>
            <a href="https://www.facebook.com/profile.php?id=100045429101693" target="_blank" rel="noopener noreferrer" className="text-blue-700 font-extrabold hover:underline">Facebook Fanpage</a>
          </div>
        </div>
      </div>

      {/* Main AI Creator Card - Always Visible on Landing Page */}
      <div className="w-full max-w-2xl mx-auto mt-2 animate-fade-in">
        <div className="bg-white rounded-3xl p-6 md:p-8 border-4 border-dashed border-emerald-200 shadow-xl relative overflow-hidden">
          <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full font-black uppercase">
            AI Magic Powered 🔮
          </div>

          {/* Animated headings */}
          <div className="text-center mb-6 pt-2">
            <h3 className="font-sans font-black text-lg md:text-2xl text-emerald-600 uppercase tracking-tight">
              🎈 {t("Create a fun lesson here!", "Bé hãy sáng tạo bài học vui nhộn ở đây nhé!")} 🎈
            </h3>
            <p className="text-[10px] md:text-xs text-slate-400 font-extrabold italic mt-1 uppercase tracking-wider">
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
            showStudentInfoFields={true}
            studentCustomName={studentCustomName}
            setStudentCustomName={setStudentCustomName}
            studentPhoneInput={studentPhoneInput}
            setStudentPhoneInput={setStudentPhoneInput}
            setLoggedInStudent={setLoggedInStudent}
            language={language}
          />
          
        </div>
      </div>
    </div>
  );
};
