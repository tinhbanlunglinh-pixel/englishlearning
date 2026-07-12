import React from "react";
import { playSound } from "../utils/audioSynth";
import { compressImage } from "../utils/helpers";

interface LessonCreatorFormProps {
  onSubmit: (e: React.FormEvent) => void;
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
  
  // Optional for Landing Page
  showStudentInfoFields?: boolean;
  studentCustomName?: string;
  setStudentCustomName?: (name: string) => void;
  studentPhoneInput?: string;
  setStudentPhoneInput?: (phone: string) => void;
  setLoggedInStudent?: (student: any) => void;
  
  language?: "en" | "bilingual";
}

export const LessonCreatorForm: React.FC<LessonCreatorFormProps> = ({
  onSubmit,
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
  showStudentInfoFields = false,
  studentCustomName = "",
  setStudentCustomName,
  studentPhoneInput = "",
  setStudentPhoneInput,
  setLoggedInStudent,
  language = "bilingual",
}) => {
  const t = (en: string, vi: string) => language === "bilingual" ? vi : en;

  return (
    <form onSubmit={onSubmit} className="space-y-6 text-xs font-bold text-slate-650 w-full">
      
      {showStudentInfoFields && (
        <div className="bg-[#eef5fc] p-5 rounded-2xl border border-blue-100 flex flex-col gap-2.5 max-w-lg mx-auto w-full">
          <label className="block text-[11px] uppercase font-black text-blue-900 tracking-wider">
            Nhập Tên Của Bé (Để hiện trên Giấy khen) ⭐
          </label>
          <input
            type="text"
            required
            placeholder="Ví dụ: Bé Na, Minh Anh, Gia Huy..."
            value={studentCustomName}
            onChange={(e) => {
              const val = e.target.value;
              if (setStudentCustomName) setStudentCustomName(val);
              if (setLoggedInStudent) {
                setLoggedInStudent({
                  phone: studentPhoneInput.trim().replace(/[\s-]/g, ""),
                  name: val,
                  classId: "free",
                  className: "Lớp Học Cô Phượng Uyên",
                  teacherName: "Cô Phượng Uyên"
                });
              }
            }}
            className="w-full p-3.5 rounded-xl bg-white border-2 border-blue-200 text-xs font-black text-slate-800 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
          
          <label className="block text-[11px] uppercase font-black text-blue-900 tracking-wider mt-3">
            SĐT Lưu Trữ Tiến Độ (Phone Number) 📱
          </label>
          <input
            type="tel"
            required
            placeholder="Ví dụ: 0912345678"
            value={studentPhoneInput}
            onChange={(e) => {
              if (setStudentPhoneInput) setStudentPhoneInput(e.target.value);
            }}
            className="w-full p-3.5 rounded-xl bg-white border-2 border-blue-200 text-xs font-black text-slate-800 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
      )}
        
      {/* 1. Generation Method Switcher Tabs */}
      <div className="flex justify-center flex-wrap">
        <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl w-full border border-slate-200">
          <button
            type="button"
            onClick={() => { setCreateMethod("text"); playSound.playTing(); }}
            className={`flex-1 py-3 px-2 rounded-xl font-sans font-black text-xs transition-all duration-250 flex items-center justify-center gap-1.5 cursor-pointer ${
              createMethod === "text"
                ? "bg-[#10c469] text-white shadow-md scale-[1.02]"
                : "text-slate-600 hover:text-slate-800 bg-transparent"
            }`}
          >
            <span className="text-sm">📝</span>
            <span>{t("Text", "Văn bản")}</span>
          </button>
          <button
            type="button"
            onClick={() => { setCreateMethod("image"); playSound.playTing(); }}
            className={`flex-1 py-3 px-2 rounded-xl font-sans font-black text-xs transition-all duration-250 flex items-center justify-center gap-1.5 cursor-pointer ${
              createMethod === "image"
                ? "bg-[#10c469] text-white shadow-md scale-[1.02]"
                : "text-slate-600 hover:text-slate-800 bg-transparent"
            }`}
          >
            <span className="text-sm">📸</span>
            <span>{t("Image/File", "Hình ảnh")}</span>
          </button>
        </div>
      </div>

      {/* Interactive Input Box */}
      <div className="bg-[#f0f9f4] p-6 rounded-3xl border border-emerald-100/50 text-center max-w-2xl mx-auto w-full">


        {createMethod === "text" && (
          <div className="w-full">
            <textarea
              rows={3}
              placeholder={t("Paste vocabulary list or paste content paragraph here...", "Dán danh sách từ vựng hoặc đoạn văn ở đây nhe...")}
              value={studentRawContent}
              onChange={(e) => setStudentRawContent(e.target.value)}
              className="w-full bg-transparent text-emerald-950 placeholder-emerald-700/40 border-0 focus:outline-none focus:ring-0 text-center font-sans font-black text-sm md:text-base tracking-wide"
            />
          </div>
        )}

        {createMethod === "image" && (
          <div className="w-full">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsStudentDraggingFile(true);
              }}
              onDragLeave={() => setIsStudentDraggingFile(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsStudentDraggingFile(false);
                const file = e.dataTransfer.files[0];
                if (file) {
                  compressImage(file).then((base64Result) => {
                    setStudentUploadedFile({
                      name: file.name,
                      base64: base64Result,
                      type: file.type,
                    });
                    playSound.playSuccess();
                  });
                }
              }}
              className="w-full bg-transparent border-0 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*, application/pdf";
                input.onchange = (e: any) => {
                  const file = e.target.files[0];
                  if (file) {
                    compressImage(file).then((base64Result) => {
                      setStudentUploadedFile({
                        name: file.name,
                        base64: base64Result,
                        type: file.type,
                      });
                      playSound.playSuccess();
                    });
                  }
                };
                input.click();
              }}
            >
              {studentUploadedFile ? (
                <div className="text-emerald-950 font-bold text-xs p-1">
                  <p className="font-sans font-black text-sm text-emerald-900">✅ {t("File Selected:", "Đã Chọn Tập Tin:")}</p>
                  <p className="text-[11px] underline truncate mt-1 text-emerald-800 bg-white/60 px-3 py-1.5 rounded-lg max-w-xs mx-auto">{studentUploadedFile.name}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStudentUploadedFile(null);
                      playSound.playClick();
                    }}
                    className="text-[10px] text-red-600 hover:underline mt-2.5 font-sans font-black transition-all hover:scale-105 inline-block cursor-pointer bg-transparent border-0"
                  >
                    🗑️ {t("Delete & Reupload", "Xoá và tải lại")}
                  </button>
                </div>
              ) : (
                <div className="text-center text-emerald-800/80 hover:text-emerald-900 transition-colors">
                  <p className="font-sans font-black text-sm text-emerald-800">📸 {t("Drag & Drop or Click to Upload Material", "Kéo thả hoặc Nhấp để chọn ảnh chụp tài liệu")}</p>
                  <p className="text-[10px] opacity-75 mt-1 font-semibold">{t("Supports homework photos, workbook pages, worksheets...", "Chấp nhận ảnh bài tập về nhà, sách giáo khoa...")}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. English Level Selector incorporating the 4 Cambridge Stages */}
      <div className="space-y-1.5">
        <label className="block text-slate-500 uppercase tracking-wider font-extrabold text-[10px] text-center mb-1">
          {t("Select English Level", "Chọn trình độ phù hợp")}:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => { setStudentLevel("pre-starter"); playSound.playTing(); }}
            className={`py-3 px-1 rounded-2xl border-2 cursor-pointer text-center duration-155 transition-all font-black flex flex-col items-center justify-center gap-1 ${
              studentLevel === "pre-starter"
                ? "bg-[#034CBD] border-[#034CBD] text-white shadow-md scale-[1.03]"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-650"
            }`}
          >
            <span className="text-lg">🧸</span>
            <span className="text-[11px] uppercase tracking-wide">Pre-Starters</span>
            <span className="text-[8px] font-bold opacity-80">{t("Ages 4-6", "Bé 4 - 6 tuổi")}</span>
          </button>
          <button
            type="button"
            onClick={() => { setStudentLevel("starter"); playSound.playTing(); }}
            className={`py-3 px-1 rounded-2xl border-2 cursor-pointer text-center duration-155 transition-all font-black flex flex-col items-center justify-center gap-1 ${
              studentLevel === "starter"
                ? "bg-[#034CBD] border-[#034CBD] text-white shadow-md scale-[1.03]"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-650"
            }`}
          >
            <span className="text-lg">🎈</span>
            <span className="text-[11px] uppercase tracking-wide">Starters</span>
            <span className="text-[8px] font-bold opacity-80">{t("Ages 6-8", "Bé 6 - 8 tuổi")}</span>
          </button>
          <button
            type="button"
            onClick={() => { setStudentLevel("mover"); playSound.playTing(); }}
            className={`py-3 px-1 rounded-2xl border-2 cursor-pointer text-center duration-155 transition-all font-black flex flex-col items-center justify-center gap-1 ${
              studentLevel === "mover"
                ? "bg-[#034CBD] border-[#034CBD] text-white shadow-md scale-[1.03]"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-650"
            }`}
          >
            <span className="text-lg">🚀</span>
            <span className="text-[11px] uppercase tracking-wide">Movers</span>
            <span className="text-[8px] font-bold opacity-80">{t("Ages 8-10", "Bé 8 - 10 tuổi")}</span>
          </button>
          <button
            type="button"
            onClick={() => { setStudentLevel("flyer"); playSound.playTing(); }}
            className={`py-3 px-1 rounded-2xl border-2 cursor-pointer text-center duration-155 transition-all font-black flex flex-col items-center justify-center gap-1 ${
              studentLevel === "flyer"
                ? "bg-[#034CBD] border-[#034CBD] text-white shadow-md scale-[1.03]"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-650"
            }`}
          >
            <span className="text-lg">🦅</span>
            <span className="text-[11px] uppercase tracking-wide">Flyers</span>
            <span className="text-[8px] font-bold opacity-80">{t("Ages 10-12", "Bé 10 - 12 tuổi")}</span>
          </button>
        </div>
      </div>

      {/* Solid Green 3D Push Button per image 2 instructions */}
      <div className="pt-2 flex justify-center">
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full max-w-lg py-4 px-6 rounded-2xl bg-[#10c469] hover:bg-[#0fbd64] text-white font-sans font-black text-sm tracking-wider shadow-md border-b-4 border-[#099951] active:border-b-0 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2 duration-150 transform hover:-translate-y-0.5"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2 animate-pulse font-sans font-black">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              {t("Co Phuong Uyen is preparing your magical lesson... 🔮", "Cô Phượng Uyên đang soạn bài giảng của bé... 🔮")}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 uppercase font-[#034CBD] font-sans font-black">
              <span>🚀</span>
              <span>{t("START NOW!", "BẮT ĐẦU NGAY!")}</span>
            </span>
          )}
        </button>
      </div>
    </form>
  );
};
