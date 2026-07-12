import React from "react";
import { motion } from "motion/react";
import { Sparkles, Calendar, Share2, Trash2, Users, Award, CheckCircle2, X } from "lucide-react";
import { playSound } from "../utils/audioSynth";
import { Lesson, Classroom, TestAttempt } from "../types";
import { compressImage, groupLessonsByDate } from "../utils/helpers";

interface TeacherPortalProps {
  teacherSubtab: "lessons" | "classes";
  setTeacherSubtab: (tab: "lessons" | "classes") => void;
  classroomsList: Classroom[];
  teacherClassroomId: string;
  setTeacherClassroomId: (id: string) => void;
  setTeacherLevel: (level: string) => void;
  teacherDeadline: string;
  setTeacherDeadline: (deadline: string) => void;
  teacherTopic: string;
  setTeacherTopic: (topic: string) => void;
  teacherUploadText: string;
  setTeacherUploadText: (text: string) => void;
  teacherUploadedFile: any;
  setTeacherUploadedFile: (file: any) => void;
  isGenerating: boolean;
  handleGenerateLessonSubmit: (e: React.FormEvent) => void;
  lessonsList: Lesson[];
  selectedLessonId: string;
  setSelectedLessonId: (id: string) => void;
  setActiveWordIdx: (idx: number) => void;
  handleCopyShareLink: (id: string) => void;
  selectedClassroomId: string;
  setSelectedClassroomId: (id: string) => void;
  handleDeleteClass: (id: string) => void;
  handleCreateClassSubmit: (e: React.FormEvent) => void;
  newClassNameInput: string;
  setNewClassNameInput: (name: string) => void;
  newClassStudents: { name: string; phone: string }[];
  setNewClassStudents: (students: { name: string; phone: string }[] | ((prev: any) => any)) => void;
  activeClassroom: Classroom | undefined;
  handleAddStudentToClass: (e: React.FormEvent) => void;
  addStudentName: string;
  setAddStudentName: (name: string) => void;
  addStudentPhone: string;
  setAddStudentPhone: (phone: string) => void;
  testAttempts: TestAttempt[];
  setTestAttempts: (attempts: TestAttempt[] | ((prev: TestAttempt[]) => TestAttempt[])) => void;
  editingStudentIdx: number | null;
  setEditingStudentIdx: (idx: number | null) => void;
  editStudentName: string;
  setEditStudentName: (name: string) => void;
  editStudentPhone: string;
  setEditStudentPhone: (phone: string) => void;
  handleSaveEditedStudent: (idx: number) => void;
  openCertificate: (attempt: TestAttempt) => void;
  setApiSuccessMsg: (msg: string) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  teacherSubtab,
  setTeacherSubtab,
  classroomsList,
  teacherClassroomId,
  setTeacherClassroomId,
  setTeacherLevel,
  teacherDeadline,
  setTeacherDeadline,
  teacherTopic,
  setTeacherTopic,
  teacherUploadText,
  setTeacherUploadText,
  teacherUploadedFile,
  setTeacherUploadedFile,
  isGenerating,
  handleGenerateLessonSubmit,
  lessonsList,
  selectedLessonId,
  setSelectedLessonId,
  setActiveWordIdx,
  handleCopyShareLink,
  selectedClassroomId,
  setSelectedClassroomId,
  handleDeleteClass,
  handleCreateClassSubmit,
  newClassNameInput,
  setNewClassNameInput,
  newClassStudents,
  setNewClassStudents,
  activeClassroom,
  handleAddStudentToClass,
  addStudentName,
  setAddStudentName,
  addStudentPhone,
  setAddStudentPhone,
  testAttempts,
  setTestAttempts,
  editingStudentIdx,
  setEditingStudentIdx,
  editStudentName,
  setEditStudentName,
  editStudentPhone,
  setEditStudentPhone,
  handleSaveEditedStudent,
  openCertificate,
  setApiSuccessMsg,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-dashed border-amber-300"
    >
      
      {/* Header teacher section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-dashed border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 text-amber-600 p-2 rounded-xl text-xl">👩‍🏫</div>
          <div>
            <h2 className="font-sans font-black text-xl text-amber-800">Cổng Quản Trị Của Giáo Viên</h2>
            <p className="text-xs text-slate-500 font-semibold uppercase">Hệ thống Soạn thảo chuẩn hóa & Quản lý lớp học</p>
          </div>
        </div>

        {/* Tab Selector between creator and class list */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => {
              setTeacherSubtab("lessons");
              playSound.playClick();
            }}
            className={`px-4 py-2 text-xs font-sans font-black rounded-lg transition-colors cursor-pointer ${
              teacherSubtab === "lessons"
                ? "bg-white text-amber-700 shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Thiết Kế Bài Giảng 📝
          </button>
          <button
            onClick={() => {
              setTeacherSubtab("classes");
              playSound.playClick();
            }}
            className={`px-4 py-2 text-xs font-sans font-black rounded-lg transition-colors cursor-pointer relative ${
              teacherSubtab === "classes"
                ? "bg-white text-amber-700 shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Quản Lý Lớp Học ({classroomsList.length}) 🏫
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: LESSONS CREATOR */}
      {teacherSubtab === "lessons" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Input options */}
          <div className="lg:col-span-2 bg-slate-50 rounded-2xl p-6 border-2 border-slate-150">
            <div className="mb-4">
              <h3 className="font-sans font-black text-slate-800 text-sm uppercase">Soạn Bài Học Tự Động Với Trí Tuệ Nhân Tạo</h3>
              <p className="text-xs text-slate-400 mt-1">AI tự động phiên dịch, bổ sung phiên âm, viết mẫu câu và tạo tranh Emojis ngộ nghĩnh nhất</p>
            </div>

            <form onSubmit={handleGenerateLessonSubmit} className="flex flex-col gap-5">
              
              {/* New Classroom Selector field */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-2">Lớp học nhận bài mới *</label>
                <select
                  required
                  value={teacherClassroomId}
                  onChange={(e) => {
                    setTeacherClassroomId(e.target.value);
                    const selectedClass = classroomsList.find((c) => c.id === e.target.value);
                    if (selectedClass) {
                      const isMamNon =
                        selectedClass.name.toLowerCase().includes("mầm") ||
                        selectedClass.name.toLowerCase().includes("lá");
                      setTeacherLevel(isMamNon ? "preschool" : "elementary");
                    }
                    playSound.playClick();
                  }}
                  className="w-full p-3.5 rounded-xl bg-white border-2 border-slate-300 focus:border-amber-400 outline-none font-sans font-black text-xs text-slate-800 shadow-sm cursor-pointer"
                >
                  <option value="">-- Bấm để chọn Lớp học --</option>
                  {classroomsList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.students?.length || 0} học viên)
                    </option>
                  ))}
                </select>
                <p className="text-[9px] text-slate-400 font-extrabold leading-normal mt-1.5 uppercase tracking-wide">
                  💡 Mỗi lớp học một nội dung học riêng. Chọn đúng lớp để các bé đăng nhập bằng sđt có thể học bài của lớp mình.
                </p>
              </div>

              {/* Hạn làm bài (Deadline) picker */}
              <div className="border-t border-dashed border-slate-250 pt-3">
                <label className="block text-xs font-black uppercase text-slate-700 mb-2">Hạn làm bài (Hạn chót) ⏰</label>
                <input
                  type="datetime-local"
                  value={teacherDeadline}
                  onChange={(e) => setTeacherDeadline(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-white border-2 border-slate-300 focus:border-amber-400 outline-none font-sans font-black text-xs text-slate-800 shadow-sm"
                />
                <p className="text-[9px] text-slate-400 font-extrabold mt-1 uppercase tracking-wide">
                  💡 Để trống nếu không giới hạn thời gian nộp bài của học sinh. Học sinh muộn vẫn nộp được nhưng sẽ báo muộn.
                </p>
              </div>

              {/* Option 2: Choose Topic Generator */}
              <div className="border-t border-dashed border-slate-250 pt-3">
                <label className="block text-xs font-black uppercase text-slate-600 mb-1.5">Cách 1: Gửi chủ đề giáo án Thầy Cô muốn soạn</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đồ ăn ngọt ngon vị, Trong nhà tắm bé, Phương tiện giao thông đường sắt..."
                  value={teacherTopic}
                  onChange={(e) => setTeacherTopic(e.target.value)}
                  className="w-full p-4 rounded-lg bg-white border border-slate-400 focus:border-amber-400 outline-none font-sans font-semibold text-sm"
                />
              </div>

              {/* Option 3: Upload Text list */}
              <div className="border-t border-dashed border-slate-250 pt-3">
                <label className="block text-xs font-black uppercase text-slate-600 mb-1.5">Cách 2: Nhập dán danh sách từ của Thầy Cô</label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Dog, Cat, Panda, Lion, Giraffe... (Cách nhau bằng dấu phẩy nhé!)"
                  value={teacherUploadText}
                  onChange={(e) => setTeacherUploadText(e.target.value)}
                  className="w-full p-4 rounded-lg bg-white border border-slate-400 focus:border-amber-400 outline-none font-sans font-semibold text-sm animate-pulse"
                />
              </div>

              {/* Option 4: Upload File / Image */}
              <div className="border-t border-dashed border-slate-250 pt-3">
                <label className="block text-xs font-black uppercase text-slate-600 mb-1.5 font-sans font-black">Cách 3: Tải hình ảnh bài tập / Tài liệu PDF 📸</label>
                <div
                  className="border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50/50 rounded-2xl p-4 text-center cursor-pointer transition-colors"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*, application/pdf";
                    input.onchange = (e: any) => {
                      const file = e.target.files[0];
                      if (file) {
                        compressImage(file).then((base64Result) => {
                          setTeacherUploadedFile({
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
                  {teacherUploadedFile ? (
                    <div className="text-amber-950 font-bold text-xs">
                      <p className="font-sans font-black text-xs text-slate-700">✅ Đã chọn tài liệu:</p>
                      <p className="text-[11px] underline truncate mt-1 text-emerald-800 bg-white/75 px-3 py-1.5 rounded-lg max-w-xs mx-auto">{teacherUploadedFile.name}</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTeacherUploadedFile(null);
                          playSound.playClick();
                        }}
                        className="text-[10px] text-red-600 hover:underline mt-2 font-sans font-black bg-transparent border-0 cursor-pointer"
                      >
                        🗑️ Xoá và tải lại
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 hover:text-slate-700 transition-colors">
                      <p className="font-sans font-black text-xs text-amber-900">📸 Nhấp để chọn ảnh bài tập hoặc tệp học liệu</p>
                      <p className="text-[9px] opacity-75 mt-0.5 font-bold uppercase tracking-wider">Hệ thống sẽ giữ nguyên nội dung gốc để tạo bài học gồm vựng và câu tương ứng</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Trigger Generator Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-sans font-black text-md shadow-lg border-b-4 border-amber-700 flex items-center justify-center gap-2 duration-200 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin text-xl">⏳</span> Đang soạn giáo khoa Anh ngữ cùng AI...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 fill-white" /> Khởi Tạo Bài Giáo Án Mới Ngay! 🚀
                  </span>
                )}
              </button>

            </form>
          </div>

          {/* Lessons Sidebar with Share Link built-in */}
          <div className="bg-white rounded-2xl p-5 border-2 border-slate-150 flex flex-col gap-4">
            <div>
              <h4 className="font-sans font-black text-slate-700 text-xs uppercase tracking-wider">Thư viện bài giảng hiện hữu</h4>
              <p className="text-[10px] text-slate-400 uppercase mt-0.5 font-bold">Bấm chia sẻ để lấy link gửi cho học viên học</p>
            </div>

            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
              {Object.entries(groupLessonsByDate(lessonsList)).map(([dateStr, lessons]) => (
                <div key={dateStr} className="flex flex-col gap-2 border-b border-sky-100/40 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-sans font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/50 w-fit">
                    <Calendar className="h-3.5 w-3.5" />
                    📅 {dateStr}
                  </div>
                  <div className="flex flex-col gap-2 pl-1">
                    {lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`p-3.5 rounded-xl border-2 transition-all flex flex-col gap-3 ${
                          selectedLessonId === lesson.id
                            ? "bg-amber-50/70 border-amber-400 shadow-sm font-black"
                            : "bg-white border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          onClick={() => {
                            setSelectedLessonId(lesson.id);
                            setActiveWordIdx(0);
                            playSound.playClick();
                          }}
                          className="cursor-pointer text-left"
                        >
                          <h5 className="font-sans font-black text-xs text-slate-800 leading-tight">
                            {lesson.title}
                          </h5>
                          <span className="inline-block mt-1 text-[9px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {lesson.level === "preschool" ? "Mẫu giáo 🧸" : "Tiểu học ⚡"} • {lesson.words.length} Từ vựng
                          </span>
                          {lesson.classId && (
                            <span className="inline-block mt-1 ml-1 text-[9px] uppercase font-black text-rose-700 bg-rose-50 border border-rose-200/60 px-1.5 py-0.5 rounded">
                              🏫 Lớp: {classroomsList.find((c) => c.id === lesson.classId)?.name || "Chưa rõ"}
                            </span>
                          )}
                        </div>

                        {/* Practical Action Tools: Copy Lesson shared URL link */}
                        <div className="flex items-center gap-2 border-t border-dashed border-slate-200 pt-2 shrink-0">
                          <button
                            onClick={() => handleCopyShareLink(lesson.id)}
                            className="flex-1 py-1.5 px-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 flex items-center justify-center gap-1 text-[10px] font-sans font-black cursor-pointer"
                            title="Sao chép liên kết chia sẻ cho học sinh làm học"
                          >
                            <Share2 className="h-3 w-3" />
                            Copy Link Học 🎉
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT 2: CLASSROOMS MANAGEMENT (Độc quyền bổ sung theo yêu cầu) */}
      {teacherSubtab === "classes" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* 1. Left Sidebar: Classlists selector */}
          <div className="lg:col-span-1 bg-slate-50/70 rounded-2xl p-4 border-2 border-slate-150 flex flex-col gap-4">
            <div className="border-b border-dashed border-slate-200 pb-2">
              <h4 className="font-sans font-black text-slate-700 text-xs uppercase tracking-wide">Danh sách các Lớp</h4>
              <p className="text-[9px] text-slate-400 mt-0.5">Click chọn lớp để quản lý học sinh và xem kết quả</p>
            </div>

            <div className="flex flex-col gap-2">
              {classroomsList.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 duration-150 ${
                    selectedClassroomId === c.id
                      ? "bg-amber-100 border-amber-400 text-amber-950 font-bold"
                      : "bg-white border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <button
                    onClick={() => {
                      setSelectedClassroomId(c.id);
                      playSound.playTing();
                    }}
                    className="flex-1 text-left text-xs font-black cursor-pointer leading-tight truncate pr-1"
                  >
                    {c.name}
                    <span className="block text-[10px] text-slate-400 font-bold mt-0.5">
                      {c.students.length} Học viên
                    </span>
                  </button>

                  <button
                    onClick={() => handleDeleteClass(c.id)}
                    className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-white cursor-pointer transition-colors"
                    title="Xóa lớp học"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Class Creation Form inside Sidebar */}
            <form onSubmit={handleCreateClassSubmit} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3.5 mt-4">
              <h5 className="font-sans font-black text-xs text-sky-800 leading-none">➕ Tạo Lớp Học Mới</h5>
              
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500">Tên Lớp học</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Lớp Lá 2, Lớp 1B..."
                  value={newClassNameInput}
                  onChange={(e) => setNewClassNameInput(e.target.value)}
                  className="w-full mt-1.5 p-2.5 border-2 border-slate-200 focus:border-sky-400 rounded-lg text-xs outline-none font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-black uppercase text-slate-500">
                    Danh Sách Học Sinh ({newClassStudents.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewClassStudents(prev => [...prev, { name: "", phone: "" }]);
                      playSound.playTing();
                    }}
                    className="text-[10px] bg-sky-50 text-sky-600 border border-sky-200 px-2.5 py-1 rounded-md font-extrabold hover:bg-sky-100 transition-colors cursor-pointer"
                  >
                    + Thêm Bé
                  </button>
                </div>

                <div className="max-h-[220px] overflow-y-auto space-y-2.5 pr-1 mt-1.5">
                  {newClassStudents.map((student, idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 flex flex-col gap-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-400">👦 Bé thứ {idx + 1}</span>
                        {newClassStudents.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setNewClassStudents(prev => prev.filter((_, i) => i !== idx));
                              playSound.playClick();
                            }}
                            className="text-red-500 hover:text-red-700 font-extrabold text-[10px] bg-red-50 hover:bg-red-100 px-1.5 py-0.5 rounded cursor-pointer transition-all"
                            title="Xóa bé này"
                          >
                            ✕ Xóa
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 uppercase mb-0.5">Tên bé</label>
                          <input
                            type="text"
                            placeholder="Họ & tên bé"
                            value={student.name}
                            onChange={(e) => {
                              const updated = [...newClassStudents];
                              updated[idx].name = e.target.value;
                              setNewClassStudents(updated);
                            }}
                            className="w-full p-2 bg-white border border-slate-250 focus:border-sky-400 rounded-lg text-xs font-bold text-slate-800 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 uppercase mb-0.5">SĐT phụ huynh</label>
                          <input
                            type="tel"
                            placeholder="Ví dụ: 09..."
                            value={student.phone}
                            onChange={(e) => {
                              const updated = [...newClassStudents];
                              updated[idx].phone = e.target.value;
                              setNewClassStudents(updated);
                            }}
                            className="w-full p-2 bg-white border border-slate-250 focus:border-sky-400 rounded-lg text-xs font-bold text-slate-800 outline-none font-sans"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-sans font-black text-xs shadow-sm cursor-pointer mt-1"
              >
                Tạo Lớp Học Mới 🚀
              </button>
            </form>
          </div>

          {/* 2. Middle / Right core table view: Selected classroom list */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {activeClassroom ? (
              <div className="bg-slate-50/50 rounded-2xl p-6 border-2 border-slate-150">
                
                {/* Active Class Header */}
                <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-2 border-b border-dashed border-slate-200 pb-3 mb-4">
                  <div>
                    <h4 className="font-sans font-black text-indigo-950 text-md">
                      Hồ Sơ Quản Lý: {activeClassroom.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">Hiển thị danh sảnh học sinh đăng ký, rà soát kết quả kiểm tra sát hạch học phần</p>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-400">
                    Khởi tạo: {new Date(activeClassroom.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Thêm bé nhanh vào lớp hiện tại */}
                <form onSubmit={handleAddStudentToClass} className="bg-sky-55/40 p-4 rounded-xl border-2 border-dashed border-sky-200/80 flex flex-col md:flex-row gap-3.5 items-end mb-5">
                  <div className="flex-1 w-full text-left">
                    <label className="block text-[10px] font-black uppercase text-sky-850 mb-1 leading-none">
                      ➕ Thêm học sinh mới vào lớp hiện tại:
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập họ & tên học sinh..."
                      value={addStudentName}
                      onChange={(e) => setAddStudentName(e.target.value)}
                      className="w-full mt-1.5 p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 outline-none"
                      required
                    />
                  </div>
                  <div className="w-full md:w-52 text-left">
                    <label className="block text-[10px] font-black uppercase text-sky-850 mb-1 leading-none">
                      Số điện thoại phụ huynh *
                    </label>
                    <input
                      type="tel"
                      placeholder="Ví dụ: 0912345678"
                      value={addStudentPhone}
                      onChange={(e) => setAddStudentPhone(e.target.value)}
                      className="w-full mt-1.5 p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 outline-none font-sans"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full md:w-auto px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-sans font-black text-xs shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    + Thêm Vào Lớp 🎒
                  </button>
                </form>

                {/* Bulk lists of Students with detailed completed status checks */}
                <div className="bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-sans font-black uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Tên Học Sinh 🎒</th>
                        <th className="p-3">Trạng Thái Làm Bài 📝</th>
                        <th className="p-3">Điểm Số Sát Hạch 🎓</th>
                        <th className="p-3">Hành Động Đặc Biệt 🏆</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-sans font-semibold">
                      {activeClassroom.students.map((student, idx) => {
                        // Cross-match student.name and classId inside shared attempts list to get their scores
                        const studentAttempts = testAttempts.filter(
                          (att) =>
                            att.studentName.trim().toLowerCase() === student.name.trim().toLowerCase() &&
                            att.classId === activeClassroom.id
                        );
                        
                        const hasDone = studentAttempts.length > 0;
                        const bestAttempt = hasDone
                          ? studentAttempts.sort((a, b) => b.score - a.score)[0]
                          : null;

                        const isEditingThis = editingStudentIdx === idx;

                        return (
                          <tr key={`${student.name}-${idx}`} className="hover:bg-slate-50/50">
                            <td className="p-3">
                              {isEditingThis ? (
                                <div className="flex flex-col gap-2 max-w-xs text-left">
                                  <div>
                                    <label className="block text-[8px] font-black uppercase text-slate-401 mb-0.5">Tên học sinh</label>
                                    <input
                                      type="text"
                                      value={editStudentName}
                                      onChange={(e) => setEditStudentName(e.target.value)}
                                      className="w-full p-2 border-2 border-sky-400 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[8px] font-black uppercase text-slate-401 mb-0.5">SĐT phụ huynh</label>
                                    <input
                                      type="tel"
                                      value={editStudentPhone}
                                      onChange={(e) => setEditStudentPhone(e.target.value)}
                                      className="w-full p-2 border-2 border-sky-400 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
                                      required
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm">👦</span>
                                  <div className="flex flex-col">
                                    <span className="font-sans font-extrabold text-slate-800">{student.name}</span>
                                    {student.phone && (
                                      <span className="font-mono text-[9px] text-slate-400 font-bold">📱 {student.phone}</span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </td>
                            
                            <td className="p-3">
                              {isEditingThis ? (
                                <span className="text-slate-400 italic text-[10px]">Đang chỉnh sửa...</span>
                              ) : hasDone ? (
                                <div className="flex flex-col gap-1 items-start">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-black">
                                    <CheckCircle2 className="h-3 w-3" /> Đã Hoàn Thành ({studentAttempts.length} Lượt)
                                  </span>
                                  {studentAttempts.some(att => att.isLate) && (
                                    <span className="text-[8px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-sans font-black border border-rose-200 uppercase tracking-wider animate-pulse whitespace-nowrap">
                                      ⚠️ Nộp muộn ⏰
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-650 text-[10px] font-black">
                                  <X className="h-3 w-3" /> Chưa Làm Bài Thi ❌
                                </span>
                              )}
                            </td>

                            <td className="p-3">
                              {isEditingThis ? (
                                <span className="text-slate-400 italic font-mono">-</span>
                              ) : bestAttempt ? (
                                <div className="space-y-1">
                                  <div className="font-mono text-sm font-black text-indigo-700 flex items-center gap-1">
                                    {bestAttempt.score} / 100 Điểm
                                    {bestAttempt.isLate && (
                                      <span className="text-[7.5px] bg-red-100 text-red-600 px-1 py-0.2 rounded font-bold border border-red-200 uppercase">
                                        Muộn
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[9px] text-slate-410 leading-tight max-w-[150px] truncate" title={bestAttempt.lessonTitle}>
                                    Chủ đề: {bestAttempt.lessonTitle}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-400 italic font-mono">-</span>
                              )}
                            </td>

                            <td className="p-3">
                              {isEditingThis ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSaveEditedStudent(idx)}
                                    className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-sans font-black text-[10px] cursor-pointer shadow-sm active:scale-95 transition-all"
                                  >
                                    💾 Lưu Lại
                                  </button>
                                  <button
                                    onClick={() => setEditingStudentIdx(null)}
                                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 font-sans font-bold text-[10px] cursor-pointer shadow-sm active:scale-95 transition-all"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-wrap items-center gap-2">
                                  {bestAttempt ? (
                                    <button
                                      onClick={() => openCertificate(bestAttempt)}
                                      className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-sans font-black text-[10px] flex items-center gap-1 border border-amber-200 cursor-pointer shadow-sm transition-all active:scale-95 duration-100"
                                    >
                                      <Award className="h-3.5 w-3.5" />
                                      Giấy khen 📜
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        playSound.playClick();
                                        const fakeScore = Math.floor(Math.random() * 3 + 8) * 10;
                                        const seededAttempt: TestAttempt = {
                                          id: `att-${Date.now()}-${idx}`,
                                          studentName: student.name,
                                          classId: activeClassroom.id,
                                          className: activeClassroom.name,
                                          lessonId: "lesson-1",
                                          lessonTitle: "🤖 Từ Vựng Động Vật Đáng Yêu",
                                          score: fakeScore,
                                          level: "preschool",
                                          timestamp: Date.now(),
                                          teacherName: "Cô Thảo"
                                        };
                                        setTestAttempts(prev => [seededAttempt, ...prev]);
                                        playSound.playSuccess();
                                        setApiSuccessMsg(`✍️ Đã giả lập kết quả thi (${fakeScore}Đ) cho Học sinh "${student.name}" để Thầy Cô xem trước Giấy chứng nhận!`);
                                      }}
                                      className="px-2.5 py-1 text-[9px] text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer"
                                      title="Lên điểm thi mẫu nhanh phục vụ minh họa"
                                    >
                                      Giả lập thi mẫu ⏳
                                    </button>
                                  )}

                                  <button
                                    onClick={() => {
                                      setEditingStudentIdx(idx);
                                      setEditStudentName(student.name);
                                      setEditStudentPhone(student.phone || "");
                                      playSound.playClick();
                                    }}
                                    className="px-2.5 py-1 text-[9px] text-sky-600 hover:bg-sky-50 rounded border border-sky-200 font-extrabold cursor-pointer inline-flex items-center gap-0.5 whitespace-nowrap"
                                    title="Chỉnh sửa thông tin học sinh"
                                  >
                                    ✏️ Sửa
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Classroom clear database action */}
                <div className="flex items-center justify-end gap-3 mt-4">
                  <button
                    onClick={() => {
                      if (confirm("Thầy Cô có chắc chắn muốn làm trống toàn bộ bảng xếp hạng điểm thi của lớp học này?")) {
                        setTestAttempts(prev => prev.filter(att => att.classId !== activeClassroom.id));
                        playSound.playTing();
                        setApiSuccessMsg("🧹 Đã xóa sạch lịch sử sát hạch của lớp này!");
                      }
                    }}
                    className="text-[10px] text-slate-400 hover:text-red-600 transition-colors cursor-pointer font-bold uppercase tracking-wider bg-transparent border-0"
                  >
                    Xóa lịch sử điểm thi của lớp 🗑️
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                <Users className="h-12 w-12 text-slate-350 mx-auto mb-3" />
                <h4 className="font-sans font-black text-slate-500">Thầy Cô chưa chọn lớp nào để quản lý</h4>
                <p className="text-xs text-slate-400 mt-1">Hãy click chọn một lớp ở danh sách bên trái hoặc tạo một lớp học mới</p>
              </div>
            )}

          </div>

        </div>
      )}

    </motion.div>
  );
};
