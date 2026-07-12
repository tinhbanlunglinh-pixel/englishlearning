/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Volume2,
  Gamepad2,
  Trophy,
  PlusCircle,
  Upload,
  User,
  Settings,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Sparkle,
  Home,
  Share2,
  Users,
  Copy,
  Award,
  Trash2,
  Printer,
  Calendar,
  LogOut,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VocabularyItem, Lesson, TestResult, Classroom, TestAttempt, StudentStudySession } from "./types";
import { SoundButton } from "./components/SoundButton";
import { AudioRecorder } from "./components/AudioRecorder";
import { ReviewGames } from "./components/ReviewGames";
import { TestEngine } from "./components/TestEngine";
import { playSound } from "./utils/audioSynth";
import { StudentRecordManager } from "./utils/studentRecords";

import { commonWordsDictClient, getFallbackIllustrationClient } from './data/dictionary';
import { LogoSVG } from './data/constants';
import { getOrGenerateEntryClient, parseRawContentClient, groupLessonsByDate, compressImage, formatLessonDate, formatLessonDeadline } from './utils/helpers';
import { StarPopNotification } from './components/StarPopNotification';
import { CertificateModal } from './components/CertificateModal';
import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';
import { SuccessAlert } from './components/SuccessAlert';
import { LandingPage } from './components/LandingPage';
import { TeacherPortal } from './components/TeacherPortal';
import { StudentPortal } from './components/StudentPortal';

export default function App() {
  // Portal State: 'landing' (Default Trang Chủ) | 'student' | 'teacher'
  const [activePortal, setActivePortal] = useState<"landing" | "student" | "teacher">("landing");
  const [activeTab, setActiveTab] = useState<"learn" | "listen" | "read" | "games" | "test" | "create">("learn");
  
  // Teacher View Subtab: 'lessons' (Soạn bài) | 'classes' (Quản lý lớp học)
  const [teacherSubtab, setTeacherSubtab] = useState<"lessons" | "classes">("lessons");

  // Lessons list with localStorage hydration
  const [lessonsList, setLessonsList] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem("minion_lessons");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: "lesson-1",
        title: "🤖 Từ Vựng Động Vật Đáng Yêu",
        level: "preschool",
        createdAt: Date.now(),
        words: [
          {
            id: "m1",
            word: "Cat",
            translation: "Con mèo",
            phonetic: "/kæt/",
            sentence: "The little cat is sleeping.",
            sentenceTranslation: "Chú mèo nhỏ đang ngủ.",
            illustration: "🐱",
            category: "Animals"
          },
          {
            id: "m2",
            word: "Dog",
            translation: "Con chó",
            phonetic: "/dɒɡ/",
            sentence: "The happy dog wags its tail.",
            sentenceTranslation: "Chú chó vui vẻ vẫy đuôi.",
            illustration: "🐶",
            category: "Animals"
          },
          {
            id: "m3",
            word: "Bird",
            translation: "Con chim",
            phonetic: "/bɜːd/",
            sentence: "The colorful bird sings softly.",
            sentenceTranslation: "Chú chim nhiều màu sắc hót líu lo ngọt ngào.",
            illustration: "🐦",
            category: "Animals"
          },
          {
            id: "m4",
            word: "Monkey",
            translation: "Con khỉ",
            phonetic: "/ˈmʌŋ.ki/",
            sentence: "The banana is yummy for the monkey.",
            sentenceTranslation: "Trái chuối ngọt ngào ngon miệng cho chú khỉ.",
            illustration: "🐵",
            category: "Animals"
          },
          {
            id: "m5",
            word: "Rabbit",
            translation: "Con thỏ",
            phonetic: "/ˈræb.ɪt/",
            sentence: "The fast white rabbit hops to me.",
            sentenceTranslation: "Chú thỏ trắng chạy nhảy thật nhanh về phía tớ.",
            illustration: "🐰",
            category: "Animals"
          },
          {
            id: "m6",
            word: "Lion",
            translation: "Sư tử mẫu",
            phonetic: "/ˈlaɪ.ən/",
            sentence: "The big lion rules the savanna jungle.",
            sentenceTranslation: "Chú sư tử to lớn thống trị vùng thảo nguyên cỏ.",
            illustration: "🦁",
            category: "Animals"
          }
        ]
      }
    ];
  });

  const [selectedLessonId, setSelectedLessonId] = useState<string>("lesson-1");

  // Classrooms list with localStorage hydration & default seed classroom
  const [classroomsList, setClassroomsList] = useState<Classroom[]>(() => {
    const saved = localStorage.getItem("minion_classrooms");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: "class-1",
        name: "Lớp Lá mầm non 🌟",
        students: [
          { name: "Bé Minh Anh", phone: "0912345678" },
          { name: "Bé Hương Giang", phone: "0987654321" },
          { name: "Bé Bảo Nam", phone: "0345678901" },
          { name: "Bé Khánh Vy", phone: "0356789012" }
        ],
        createdAt: Date.now() - 86400000 * 5,
      },
      {
        id: "class-2",
        name: "Lớp 3A Tiểu học 🦁",
        students: [
          { name: "Nguyễn Hoàng Lâm", phone: "0911223344" },
          { name: "Trần Thúy Vân", phone: "0922334455" },
          { name: "Lê Gia Bảo", phone: "0933445566" },
          { name: "Vũ Tuấn Tú", phone: "0944556677" }
        ],
        createdAt: Date.now() - 86400000 * 2,
      }
    ];
  });

  const [selectedClassroomId, setSelectedClassroomId] = useState<string>("class-1");

  // Test Attempts list with localStorage hydration & default mock performance database
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>(() => {
    const saved = localStorage.getItem("minion_attempts");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: "att-1",
        studentName: "Bé Minh Anh",
        classId: "class-1",
        className: "Lớp Lá mầm non 🌟",
        lessonId: "lesson-1",
        lessonTitle: "🤖 Từ Vựng Động Vật Đáng Yêu",
        score: 100,
        level: "preschool",
        timestamp: Date.now() - 3600000 * 4,
        teacherName: "Cô Thảo"
      },
      {
        id: "att-2",
        studentName: "Bé Bảo Nam",
        classId: "class-1",
        className: "Lớp Lá mầm non 🌟",
        lessonId: "lesson-1",
        lessonTitle: "🤖 Từ Vựng Động Vật Đáng Yêu",
        score: 80,
        level: "preschool",
        timestamp: Date.now() - 3600000 * 24,
        teacherName: "Cô Thảo"
      },
      {
        id: "att-3",
        studentName: "Nguyễn Hoàng Lâm",
        classId: "class-2",
        className: "Lớp 3A Tiểu học 🦁",
        lessonId: "lesson-1",
        lessonTitle: "🤖 Từ Vựng Động Vật Đáng Yêu",
        score: 90,
        level: "elementary",
        timestamp: Date.now() - 3600000 * 2,
        teacherName: "Thầy Hùng"
      }
    ];
  });

  // Logged-in current student profile
  const [loggedInStudent, setLoggedInStudent] = useState<{
    phone?: string;
    name: string;
    classId: string;
    className: string;
    teacherName: string;
  } | null>(() => {
    const saved = localStorage.getItem("minion_student_session");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: localStorage.getItem("minion_student_name") || "",
      classId: "free",
      className: "Lớp Học Cô Phượng Uyên",
      teacherName: "Cô Phượng Uyên"
    };
  });

  // Phone number linking states for student
  const [studentPhoneInput, setStudentPhoneInput] = useState("");
  const [isLinkingPhone, setIsLinkingPhone] = useState(false);
  const [phoneLinkError, setPhoneLinkError] = useState<string | null>(null);
  const [phoneLinkSuccess, setPhoneLinkSuccess] = useState<string | null>(null);
  const [studentLoginMode, setStudentLoginMode] = useState<"phone" | "manual">("manual");

  // UI inputs - Student Profile entry on landing page
  const [studentSelectClassId, setStudentSelectClassId] = useState("class-1");
  const [studentSelectName, setStudentSelectName] = useState("");
  const [studentCustomName, setStudentCustomName] = useState(() => {
    const saved = localStorage.getItem("minion_student_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) return parsed.name;
      } catch (e) {}
    }
    return localStorage.getItem("minion_student_name") || "";
  });
  const [studentTeacherInput, setStudentTeacherInput] = useState("Cô Phượng Uyên");

  // UI inputs - Class creation state
  const [newClassNameInput, setNewClassNameInput] = useState("");
  // UI inputs - Students structural roster
  const [newClassStudents, setNewClassStudents] = useState<{ name: string; phone: string }[]>([
    { name: "", phone: "" }
  ]);

  // Teacher Input State for Lesson Generation
  const [teacherTopic, setTeacherTopic] = useState("");
  const [teacherLevel, setTeacherLevel] = useState<"preschool" | "elementary">("preschool");
  const [teacherUploadText, setTeacherUploadText] = useState("");
  const [teacherClassroomId, setTeacherClassroomId] = useState<string>("");
  const [teacherDeadline, setTeacherDeadline] = useState("");
  const [teacherUploadedFile, setTeacherUploadedFile] = useState<{ name: string; base64: string; type: string } | null>(null);

  // Student AI Lesson Creator States
  const [studentTopic, setStudentTopic] = useState("");
  const [studentRawContent, setStudentRawContent] = useState("");
  const [studentLevel, setStudentLevel] = useState<string>("starter");
  const [language, setLanguage] = useState<"en" | "bilingual">("en");
  const [createMethod, setCreateMethod] = useState<"topic" | "text" | "image">("topic");
  
  const t = (en: string, vi: string) => {
    return en;
  };

  const [studentUploadedFile, setStudentUploadedFile] = useState<{ name: string; base64: string; type: string } | null>(null);
  const [isStudentDraggingFile, setIsStudentDraggingFile] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [apiSuccessMsg, setApiSuccessMsg] = useState<string | null>(null);
  const [showStudentRecentLessonsModal, setShowStudentRecentLessonsModal] = useState(false);
  const [hasAutoOpenedRecentLessons, setHasAutoOpenedRecentLessons] = useState(false);

  // Hydration migration: fix old lessons missing translations or fallback illustrations
  useEffect(() => {
    let migratedCount = 0;
    const migrated = lessonsList.map(lesson => {
      let lessonChanged = false;
      const newWords = lesson.words.map(w => {
        if (w.translation.toLowerCase() === w.word.toLowerCase() || !w.translation) {
          const capitalizedWord = w.word.charAt(0).toUpperCase() + w.word.slice(1);
          const dictEntry = getOrGenerateEntryClient(capitalizedWord);
          const newIllustration = getFallbackIllustrationClient(w.word);
          
          if (dictEntry && dictEntry.translation.toLowerCase() !== capitalizedWord.toLowerCase()) {
            lessonChanged = true;
            return {
              ...w,
              translation: dictEntry.translation,
              phonetic: dictEntry.phonetic,
              sentence: dictEntry.sentence || w.sentence,
              sentenceTranslation: dictEntry.sentenceTranslation || w.sentenceTranslation,
              illustration: newIllustration
            };
          } else if (newIllustration !== w.illustration) {
            lessonChanged = true;
            return { ...w, illustration: newIllustration };
          }
        }
        return w;
      });
      if (lessonChanged) {
        migratedCount++;
        return { ...lesson, words: newWords };
      }
      return lesson;
    });
    
    if (migratedCount > 0) {
      setLessonsList(migrated);
      localStorage.setItem("minion_lessons", JSON.stringify(migrated));
    }
  }, []); // Run once on mount

  // Auto-connect/link student with the newly created lessons of their class
  useEffect(() => {
    if (loggedInStudent && lessonsList.length > 0) {
      const classLessons = lessonsList.filter((l) => l.classId === loggedInStudent.classId);
      if (classLessons.length > 0) {
        // Sort by createdAt descending to get the newest lesson for this classroom
        const sorted = [...classLessons].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        const latestClassLesson = sorted[0];
        
        // Check if the current selectedLessonId belongs to this student's class
        const currentLesson = lessonsList.find((l) => l.id === selectedLessonId);
        const currentBelongsToClass = currentLesson && currentLesson.classId === loggedInStudent.classId;
        
        // If the current selected lesson doesn't belong to the student's class (e.g. it's the global animal lesson),
        // or if it's missing, automatically switch them to the latest class lesson!
        if (!currentBelongsToClass) {
          setSelectedLessonId(latestClassLesson.id);
          setActiveWordIdx(0);
        }
      }
    }
  }, [loggedInStudent, lessonsList, selectedLessonId]);

  // Student list inline edit and single addition states
  const [editingStudentIdx, setEditingStudentIdx] = useState<number | null>(null);
  const [editStudentName, setEditStudentName] = useState("");
  const [editStudentPhone, setEditStudentPhone] = useState("");
  const [addStudentName, setAddStudentName] = useState("");
  const [addStudentPhone, setAddStudentPhone] = useState("");

  // Student Learning interactions state
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Gamification & Star stats from localStorage
  const [currentGoldStars, setCurrentGoldStars] = useState<number>(() => {
    const saved = localStorage.getItem("minion_stars");
    return saved ? Number(saved) : 150;
  });
  const [showStarPopEffect, setShowStarPopEffect] = useState(false);

  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  const [dailyStars, setDailyStars] = useState<number>(() => {
    const todayStr = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
    const savedDay = localStorage.getItem("daily_stars_day");
    if (savedDay === todayStr) {
      const savedStars = localStorage.getItem("daily_stars_count");
      return savedStars ? Number(savedStars) : 0;
    }
    return 0;
  });

  useEffect(() => {
    const todayStr = getTodayString();
    localStorage.setItem("daily_stars_day", todayStr);
    localStorage.setItem("daily_stars_count", String(dailyStars));
  }, [dailyStars]);

  const [currentLevel, setCurrentLevel] = useState(1);
  const [quizSettingsCount, setQuizSettingsCount] = useState<10 | 20 | 30>(10);

  const [studySessions, setStudySessions] = useState<StudentStudySession[]>(() => {
    const saved = localStorage.getItem("minion_study_sessions");
    if (saved) {
      try {
        const parsed: StudentStudySession[] = JSON.parse(saved);
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return parsed.filter((s) => s.timestamp >= oneWeekAgo);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const activeSessions = studySessions.filter((s) => s.timestamp >= oneWeekAgo);
    localStorage.setItem("minion_study_sessions", JSON.stringify(activeSessions));
  }, [studySessions]);

  // Active quiz & games triggers
  const [activeTestActive, setActiveTestActive] = useState(false);
  const [activeGamesActive, setActiveGamesActive] = useState(false);
  const [testReport, setTestReport] = useState<TestResult | null>(null);

  // Certificate Modal State
  const [selectedCertificateAttempt, setSelectedCertificateAttempt] = useState<TestAttempt | null>(null);
  const [certStudentName, setCertStudentName] = useState("");
  const [certTeacherName, setCertTeacherName] = useState("");
  const [certScore, setCertScore] = useState(100);
  const [certLessonTitle, setCertLessonTitle] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certGameScore, setCertGameScore] = useState<number | null>(null);
  const [certQuizScore, setCertQuizScore] = useState<number | null>(null);
  const [certTotalStars, setCertTotalStars] = useState<number>(0);
  const [certWeeklyStars, setCertWeeklyStars] = useState<number>(0);

  const studentLessons = lessonsList.filter((lesson) => {
    if (!loggedInStudent) return false;
    const hasBeenStudiedThisWeek = studySessions.some(
      (s) =>
        s.lessonId === lesson.id &&
        s.studentName.toLowerCase() === loggedInStudent.name.toLowerCase() &&
        s.classId === loggedInStudent.classId &&
        s.timestamp >= Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    return (
      lesson.classId === loggedInStudent.classId ||
      !lesson.classId ||
      lesson.id === selectedLessonId ||
      hasBeenStudiedThisWeek
    );
  });

  const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const lastMonthLessons = studentLessons.filter((lesson) => (lesson.createdAt || Date.now()) >= oneMonthAgo);
  const lessonsToDisplay = lastMonthLessons.length > 0 ? lastMonthLessons : studentLessons;

  const activeLesson = lessonsList.find((l) => l.id === selectedLessonId) ||
    (loggedInStudent
      ? (lessonsList.find((l) => l.classId === loggedInStudent.classId) ||
         lessonsList.find((l) => !l.classId) ||
         lessonsList[0])
      : lessonsList[0]);

  const activeClassroom =
    classroomsList.find((c) => c.id === selectedClassroomId) || classroomsList[0];

  // Dynamic Level auto-calculations based on stars
  useEffect(() => {
    const calculatedLevel = Math.max(1, Math.floor(currentGoldStars / 100) + 1);
    if (calculatedLevel !== currentLevel) {
      setCurrentLevel(calculatedLevel);
    }
  }, [currentGoldStars]);

  // Synchronizers to localStorage
  useEffect(() => {
    localStorage.setItem("minion_lessons", JSON.stringify(lessonsList));
  }, [lessonsList]);

  useEffect(() => {
    localStorage.setItem("minion_classrooms", JSON.stringify(classroomsList));
  }, [classroomsList]);

  useEffect(() => {
    localStorage.setItem("minion_attempts", JSON.stringify(testAttempts));
  }, [testAttempts]);

  useEffect(() => {
    localStorage.setItem("minion_stars", String(currentGoldStars));
  }, [currentGoldStars]);

  useEffect(() => {
    if (loggedInStudent) {
      localStorage.setItem("minion_student_session", JSON.stringify(loggedInStudent));
    } else {
      localStorage.removeItem("minion_student_session");
    }
  }, [loggedInStudent]);

  // Handle Shared Lesson Deep Link loading
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedLessonId = params.get("lessonId");
    if (sharedLessonId) {
      const match = lessonsList.find((l) => l.id === sharedLessonId);
      if (match) {
        setSelectedLessonId(sharedLessonId);
        setActiveWordIdx(0);
        // Load default/previous student session if exists, otherwise open student screen directly
        setActivePortal("student");
        playSound.playSuccess();
        setApiSuccessMsg("🎈 Đã tải bài tập tiếng Anh chia sẻ trực tiếp từ Thầy Cô chuẩn xác!");
        // Clear param to avoid annoying pop-up repetition
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [lessonsList]);

  // Copy Link button handler
  const handleCopyShareLink = (lessonId: string) => {
    const url = `${window.location.origin}${window.location.pathname}?lessonId=${lessonId}`;
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
      } else {
        // Fallback for isolated framework iframes
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      playSound.playSuccess();
      setApiSuccessMsg("🔗 Đã sao chép liên kết chia sẻ của bài học! Thầy Cô có thể gửi link này cho Học Sinh.");
      setTimeout(() => setApiSuccessMsg(null), 8000);
    } catch (e) {
      alert(`Hãy sao chép thủ công liên kết bài học này nhé:\n${url}`);
    }
  };

  // Award stars with visual pop feedback notifier
  const triggerStarAward = (amt: number) => {
    setCurrentGoldStars((prev) => prev + amt);
    setDailyStars((prev) => prev + amt);
    setShowStarPopEffect(true);
    setTimeout(() => {
      setShowStarPopEffect(false);
    }, 1200);
  };

  // Actual study entrance helper with star reward
  const enterLessonToStudy = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveWordIdx(0);
    setIsFlipped(false);
    playSound.playClick();

    if (!loggedInStudent) return;
    const studentName = loggedInStudent.name;
    const classId = loggedInStudent.classId || "free";

    // Add study session record
    const newSession: StudentStudySession = {
      lessonId,
      studentName,
      classId,
      timestamp: Date.now()
    };

    setStudySessions((prev) => {
      // Keep only one latest entry per student/class/lesson
      const filtered = prev.filter(
        (s) => !(s.lessonId === lessonId && s.studentName.toLowerCase() === studentName.toLowerCase() && s.classId === classId)
      );
      return [newSession, ...filtered];
    });

    // Reward entry stars: "vào học thực tế"
    // Award +10 stars once per lesson per day
    const todayStr = getTodayString();
    const storageKey = `entered_${studentName.replace(/\s+/g, "_")}_${classId}_${lessonId}_${todayStr}`;
    const alreadyAwardedToday = localStorage.getItem(storageKey);
    if (!alreadyAwardedToday) {
      triggerStarAward(10);
      localStorage.setItem(storageKey, "true");
      setApiSuccessMsg(`🎉 You have entered the lesson "${lessonsList.find(l => l.id === lessonId)?.title || ''}"! Earned +10 Gold Stars! 🎒`);
      setTimeout(() => setApiSuccessMsg(null), 4000);
    } else {
      setApiSuccessMsg(`📖 Re-studying lesson: "${lessonsList.find(l => l.id === lessonId)?.title || ''}"!`);
      setTimeout(() => setApiSuccessMsg(null), 3000);
    }
  };

  // Vocal recognition sample completion
  const handleVocalComplete = (url: string) => {
    playSound.playSuccess();
    triggerStarAward(15);
  };

  // Switch Word Flash Card helper
  const nextWord = () => {
    if (!activeLesson) return;
    playSound.playClick();
    setIsFlipped(false);
    setActiveWordIdx((idx) => (idx + 1) % activeLesson.words.length);
    // Tiny incentive for flipping lessons catalog
    triggerStarAward(1);
  };

  const prevWord = () => {
    if (!activeLesson) return;
    playSound.playClick();
    setIsFlipped(false);
    setActiveWordIdx((idx) => (idx - 1 + activeLesson.words.length) % activeLesson.words.length);
    triggerStarAward(1);
  };

  // Switch student profile session login on landing page
  const handleStudentProfileSelectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchedName = studentCustomName.trim() || "Bé Học Tiếng Anh";
    
    // Sync latest lessons database from server
    try {
      const resLessons = await fetch("/api/lessons");
      if (resLessons.ok) {
        const data = await resLessons.json();
        if (data && data.length > 0) setLessonsList(data);
      }
    } catch (err) {
      console.warn("Lỗi tải bài học khi đăng nhập:", err);
    }

    // Save login structure
    setLoggedInStudent({
      name: matchedName,
      classId: "class-1",
      className: "Lớp Học Cô Phượng Uyên",
      teacherName: studentTeacherInput || "Cô Phượng Uyên"
    });

    playSound.playSuccess();
    setActivePortal("student");
    setActiveTab("create"); // Take them directly to the AI creation tab as requested
  };

  // Load backend data from Express on startup
  useEffect(() => {
    const loadApiData = async () => {
      try {
        const resLessons = await fetch("/api/lessons");
        if (resLessons.ok) {
          const data = await resLessons.json();
          if (data && data.length > 0) setLessonsList(data);
        }
      } catch (err) { console.error("Error fetching lessons", err); }

      try {
        const resClassrooms = await fetch("/api/classrooms");
        if (resClassrooms.ok) {
          const data = await resClassrooms.json();
          if (data && data.length > 0) setClassroomsList(data);
        }
      } catch (err) { console.error("Error fetching classrooms", err); }

      try {
        const resAttempts = await fetch("/api/attempts");
        if (resAttempts.ok) {
          const data = await resAttempts.json();
          if (data && data.length > 0) setTestAttempts(data);
        }
      } catch (err) { console.error("Error fetching attempts", err); }
    };
    loadApiData();
  }, []);

  // Handle Resolution and Linking of Student by Phone Number
  const handlePhoneLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = studentPhoneInput.trim().replace(/[\s-]/g, "");
    if (!cleanPhone) {
      setPhoneLinkError("Vui lòng nhập số điện thoại của học viên!");
      return;
    }

    setIsLinkingPhone(true);
    setPhoneLinkError(null);
    setPhoneLinkSuccess(null);

    // Sync latest lessons and classrooms database from server first so student browser immediately represents new teacher creations
    try {
      const resLessons = await fetch("/api/lessons");
      if (resLessons.ok) {
        const lData = await resLessons.json();
        if (lData && lData.length > 0) setLessonsList(lData);
      }
    } catch (err) {
      console.warn("Lỗi đồng bộ bài học:", err);
    }

    try {
      const response = await fetch(`/api/student/resolve?phone=${encodeURIComponent(cleanPhone)}`);
      if (response.ok) {
        const data = await response.json();
        setLoggedInStudent({
          phone: cleanPhone,
          name: data.name,
          classId: data.classId,
          className: data.className,
          teacherName: data.teacherName,
        });

        const record = StudentRecordManager.getRecord(cleanPhone, data.name);
        setDailyStars(record.totalStars);

        if (data.linkedLesson) {
          setSelectedLessonId((prev) => (prev && prev !== "lesson-1") ? prev : data.linkedLesson.id);
        }

        localStorage.setItem("minion_student_session", JSON.stringify({
          phone: cleanPhone,
          name: data.name,
          classId: data.classId,
          className: data.className,
          teacherName: data.teacherName,
        }));

        playSound.playSuccess();
        setPhoneLinkSuccess(`🎉 Liên kết thành công! Chào Bé ${data.name}, con đã được kết nối đến lớp "${data.className}" của ${data.teacherName}.`);
        
        setTimeout(() => {
          setActivePortal("student");
          setPhoneLinkSuccess(null);
        }, 1500);
      } else {
        const errData = await response.json();
        setPhoneLinkError(errData.error || "Không tìm thấy số điện thoại!");
        playSound.playFail();
      }
    } catch (err) {
      console.error(err);
      // Offline fallback
      const foundClass = classroomsList.find(c => 
        c.students.some(s => s.phone.replace(/[\s-]/g, "") === cleanPhone)
      );
      if (foundClass) {
        const foundStudent = foundClass.students.find(s => s.phone.replace(/[\s-]/g, "") === cleanPhone);
        if (foundStudent) {
          const isMamNon = foundClass.name.toLowerCase().includes("mầm") || foundClass.name.toLowerCase().includes("lá");
          const teacherName = isMamNon ? "Cô Thảo" : "Thầy Hùng";
          setLoggedInStudent({
            phone: cleanPhone,
            name: foundStudent.name,
            classId: foundClass.id,
            className: foundClass.name,
            teacherName: teacherName
          });
          const record = StudentRecordManager.getRecord(cleanPhone, foundStudent.name);
          setDailyStars(record.totalStars);
          playSound.playSuccess();
          setPhoneLinkSuccess(`🎉 Kết nối thành công bé ${foundStudent.name} (lớp ${foundClass.name})`);
          setTimeout(() => {
            setActivePortal("student");
            setPhoneLinkSuccess(null);
          }, 1500);
          return;
        }
      }
      setPhoneLinkError("Không tìm thấy lớp học nào khớp với số điện thoại này! Hãy nhờ Thầy Cô nhập số điện thoại của con vào thông tin học viên nhé.");
      playSound.playFail();
    } finally {
      setIsLinkingPhone(false);
    }
  };

  // Teacher portal - Create Class submission
  const handleCreateClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassNameInput.trim()) {
      alert("Hãy điền tên lớp học ví dụ: Lớp Lá 1!");
      return;
    }

    const finalStudents = newClassStudents
      .map(s => ({
        name: s.name.trim(),
        phone: s.phone.trim().replace(/[\s-]/g, "")
      }))
      .filter(s => s.name.length > 0 && s.phone.length > 0);

    if (finalStudents.length === 0) {
      alert("Hãy điền đầy đủ họ tên học sinh và số điện thoại thực tế của ít nhất 1 học viên!");
      return;
    }

    const classroomPayload = {
      name: newClassNameInput.trim(),
      students: finalStudents
    };

    try {
      const res = await fetch("/api/classrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classroomPayload)
      });
      if (res.ok) {
        const data = await res.json();
        const createdClass = data.classroom;
        setClassroomsList(prev => [createdClass, ...prev.filter(c => c.id !== createdClass.id)]);
        setSelectedClassroomId(createdClass.id);
        setApiSuccessMsg(`🎉 Tạo lớp "${createdClass.name}" thành công với ${createdClass.students.length} học viên có sđt thực tế!`);
      } else {
        throw new Error("API post classrooms failed");
      }
    } catch (err) {
      console.error(err);
      // Fallback local save
      const fallbackClass: Classroom = {
        id: `class-${Date.now()}`,
        name: newClassNameInput.trim(),
        students: finalStudents,
        createdAt: Date.now()
      };
      setClassroomsList(prev => [fallbackClass, ...prev]);
      setSelectedClassroomId(fallbackClass.id);
      setApiSuccessMsg(`🎉 [Ngoại tuyến] Tạo lớp "${fallbackClass.name}" thành công!`);
    }

    setNewClassNameInput("");
    setNewClassStudents([{ name: "", phone: "" }]);
    playSound.playSuccess();
  };

  // Teacher portal - Delete specific classroom helper
  const handleDeleteClass = async (id: string) => {
    if (confirm("Thầy Cô có chắc chắn muốn xóa lớp học này không? (Toàn bộ danh sách học sinh sẽ bị gỡ bỏ)")) {
      try {
        await fetch("/api/classrooms/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        });
      } catch (err) { console.error("Error deleting classroom", err); }

      setClassroomsList(prev => prev.filter(c => c.id !== id));
      playSound.playClick();
    }
  };

  // Add a new student to the active class
  const handleAddStudentToClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClassroom) {
      alert("Vui lòng chọn hoặc tạo lớp học trước!");
      return;
    }
    const cleanName = addStudentName.trim();
    const cleanPhone = addStudentPhone.trim().replace(/[\s-]/g, "");

    if (!cleanName || !cleanPhone) {
      alert("Vui lòng nhập đầy đủ Họ tên và Số điện thoại!");
      return;
    }

    // Check if duplicate student in the same class
    const duplicate = activeClassroom.students.some(
      (s) => s.name.toLowerCase() === cleanName.toLowerCase() || s.phone === cleanPhone
    );
    if (duplicate) {
      if (!confirm("Bé có tên hoặc SĐT này đã tồn tại trong lớp. Thầy Cô có muốn tiếp tục thêm?")) {
        return;
      }
    }

    const updatedStudents = [...activeClassroom.students, { name: cleanName, phone: cleanPhone }];
    
    try {
      const res = await fetch("/api/classrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeClassroom.id,
          name: activeClassroom.name,
          students: updatedStudents,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedClass = data.classroom;
        setClassroomsList((prev) =>
          prev.map((c) => (c.id === updatedClass.id ? updatedClass : c))
        );
        setAddStudentName("");
        setAddStudentPhone("");
        setApiSuccessMsg(`🎉 Đã thêm thành công học sinh "${cleanName}" vào lớp "${activeClassroom.name}"!`);
        playSound.playSuccess();
      } else {
        throw new Error("API failed");
      }
    } catch (err) {
      console.error("Lỗi thêm bé vào lớp", err);
      // Fallback update on UI
      const fallbackClass = { ...activeClassroom, students: updatedStudents };
      setClassroomsList((prev) =>
        prev.map((c) => (c.id === fallbackClass.id ? fallbackClass : c))
      );
      setAddStudentName("");
      setAddStudentPhone("");
      setApiSuccessMsg(`🎉 Đã cập nhật ngoại tuyến học sinh "${cleanName}"!`);
    }
  };

  // Edit / Save details of a student
  const handleSaveEditedStudent = async (studentIdx: number) => {
    if (!activeClassroom) return;
    const cleanName = editStudentName.trim();
    const cleanPhone = editStudentPhone.trim().replace(/[\s-]/g, "");

    if (!cleanName || !cleanPhone) {
      alert("Vui lòng nhập đầy đủ tên và số điện thoại học sinh!");
      return;
    }

    const updatedStudents = activeClassroom.students.map((student, idx) => {
      if (idx === studentIdx) {
        return { name: cleanName, phone: cleanPhone };
      }
      return student;
    });

    try {
      const res = await fetch("/api/classrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeClassroom.id,
          name: activeClassroom.name,
          students: updatedStudents,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedClass = data.classroom;
        setClassroomsList((prev) =>
          prev.map((c) => (c.id === updatedClass.id ? updatedClass : c))
        );
        setEditingStudentIdx(null);
        setApiSuccessMsg(`📝 Đã cập nhật thành công thông tin học sinh!`);
        playSound.playSuccess();
      } else {
        throw new Error("API update failed");
      }
    } catch (err) {
      console.error("Lỗi cập nhật học sinh", err);
      const fallbackClass = { ...activeClassroom, students: updatedStudents };
      setClassroomsList((prev) =>
        prev.map((c) => (c.id === fallbackClass.id ? fallbackClass : c))
      );
      setEditingStudentIdx(null);
      setApiSuccessMsg(`📝 Đã cập nháp ngoại tuyến thông tin học sinh!`);
    }
  };

  // Open Achievement Certificate
  const openCertificate = (attempt: TestAttempt) => {
    setCertStudentName(attempt.studentName);
    setCertTeacherName(attempt.teacherName || "Cô Thảo");
    setCertScore(attempt.score);
    setCertLessonTitle(attempt.lessonTitle);
    
    const d = new Date(attempt.timestamp);
    setCertDate(`Ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`);
    
    if (loggedInStudent && loggedInStudent.phone) {
       const record = StudentRecordManager.getRecord(loggedInStudent.phone, loggedInStudent.name);
       setCertTotalStars(record.totalStars);
       setCertWeeklyStars(record.weeklyStars);
       if (record.lessonResults && record.lessonResults[attempt.lessonId]) {
         setCertGameScore(record.lessonResults[attempt.lessonId].gameScore ?? null);
         setCertQuizScore(record.lessonResults[attempt.lessonId].quizScore ?? null);
       } else {
         setCertGameScore(null);
         setCertQuizScore(null);
       }
    } else {
       // fallback for those without phone
       setCertTotalStars(currentGoldStars);
       setCertWeeklyStars(0);
       setCertGameScore(null);
       setCertQuizScore(attempt.score);
    }

    setSelectedCertificateAttempt(attempt);
    playSound.playFanfare();
  };

  // API Trigger: Generate Lesson with Gemini
  const handleGenerateLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherTopic && !teacherUploadText && !teacherUploadedFile) {
      alert("Hãy nhập chủ đề bài học, danh sách từ hoặc tải tệp tài liệu nhé!");
      return;
    }
    if (!teacherClassroomId) {
      alert("Vui lòng chọn lớp học áp dụng cho bài học này!");
      return;
    }

    setIsGenerating(true);
    setApiSuccessMsg(null);
    playSound.playClick();

    try {
      const response = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: teacherTopic || undefined,
          rawContent: teacherUploadText || undefined,
          level: teacherLevel,
          fileData: teacherUploadedFile ? teacherUploadedFile.base64 : undefined,
          fileMime: teacherUploadedFile ? teacherUploadedFile.type : undefined,
        }),
      });

      const data = await response.json();
      const parsedDeadline = teacherDeadline ? new Date(teacherDeadline).getTime() : undefined;

      if (response.ok && data.words && data.words.length > 0) {
        let lessonTitle = data.title;
        if (!lessonTitle) {
          if (teacherTopic) {
            lessonTitle = `Bài học: ${teacherTopic}`;
          } else if (teacherUploadedFile) {
            lessonTitle = `📄 Giáo trình tệp: ${teacherUploadedFile.name}`;
          } else {
            lessonTitle = "Tập từ vựng tự soạn";
          }
        }

        const newLesson: Lesson = {
          id: `lesson-${Date.now()}`,
          title: lessonTitle,
          level: teacherLevel,
          words: data.words,
          createdAt: Date.now(),
          classId: teacherClassroomId,
          deadline: parsedDeadline,
        };

        try {
          await fetch("/api/lessons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newLesson),
          });
        } catch (err) {
          console.error("Lỗi đồng bộ bài học lên máy chủ", err);
        }

        setLessonsList((prev) => [newLesson, ...prev]);
        setSelectedLessonId(newLesson.id);
        setActiveWordIdx(0);
        setTeacherTopic("");
        setTeacherUploadText("");
        setTeacherUploadedFile(null);
        setTeacherClassroomId("");
        setTeacherDeadline("");
        
        if (data.fallback) {
          setApiSuccessMsg(data.errorMsg || "✨ Đã khởi tạo bài học thông minh dự phòng siêu dễ thương thành công!");
        } else {
          setApiSuccessMsg("🎉 Tuyệt vời! Giáo án tiếng Anh ngộ nghĩnh đã được khởi tạo thành công chuẩn giáo trình!");
        }
        playSound.playSuccess();
      } else {
        throw new Error(data.error || "Không thể nhận diện cấu trúc bài học");
      }
    } catch (err: any) {
      console.warn(err);
      // Load standard local fallback words for immediate resilience so there's never a broken state
      const fallbackTitle = teacherTopic ? `🎈 Giáo án: ${teacherTopic}` : "🎈 Giáo án Tiếng Anh";
      
      // If user provided a word list, build fallback from their actual words
      let defaultSamples: any[];
      if (teacherUploadText && teacherUploadText.trim()) {
        const inputItems = parseRawContentClient(teacherUploadText);
        defaultSamples = inputItems.map((item, idx) => {
          const capitalizedWord = item.english.charAt(0).toUpperCase() + item.english.slice(1);
          const isSentence = item.english.trim().split(/\s+/).length > 1;
          const dictEntry = getOrGenerateEntryClient(capitalizedWord);
          const translation = item.vietnamese || (dictEntry ? dictEntry.translation : capitalizedWord);
          const fallbackPhonetic = `/${item.english.toLowerCase().replace(/[^a-z\s]/g, "")}/`;
          
          return {
            id: `fa-input-${idx}`,
            word: capitalizedWord,
            translation: translation,
            phonetic: dictEntry ? dictEntry.phonetic : fallbackPhonetic,
            sentence: isSentence ? capitalizedWord : (dictEntry && dictEntry.sentence ? dictEntry.sentence : `I like my ${item.english.toLowerCase()}.`),
            sentenceTranslation: isSentence ? translation : (dictEntry && dictEntry.sentenceTranslation ? dictEntry.sentenceTranslation : `Tôi yêu ${translation.toLowerCase()} của tôi.`),
            illustration: getFallbackIllustrationClient(item.english),
            category: teacherTopic || "Uploaded List",
          };
        });
      } else {
        defaultSamples = teacherLevel === "preschool" ? [
          { id: "fa1", word: "Cat", translation: "Con mèo", phonetic: "/kæt/", sentence: "The little cat says meow meow.", sentenceTranslation: "Chú mèo nhỏ kêu meow meow.", illustration: "🐱", category: "Animals" },
          { id: "fa2", word: "Dog", translation: "Con chó", phonetic: "/dɒɡ/", sentence: "The happy dog wags its tail.", sentenceTranslation: "Chú chó vui vẻ vẫy đuôi.", illustration: "🐶", category: "Animals" },
          { id: "fa3", word: "Monkey", translation: "Con khỉ", phonetic: "/ˈmʌŋ.ki/", sentence: "The monkey loves eating sweet bananas.", sentenceTranslation: "Chú khỉ thích ăn những quả chuối ngọt lịm.", illustration: "🐵", category: "Animals" }
        ] : [
          { id: "fs1", word: "Book", translation: "Quyển sách", phonetic: "/bʊk/", sentence: "This book has funny stories.", sentenceTranslation: "Quyển sách này có những câu chuyện thú vị.", illustration: "📕", category: "School" },
          { id: "fs2", word: "Pencil", translation: "Bút chì", phonetic: "/ˈpen.səl/", sentence: "I draw a smiling flower with my pencil.", sentenceTranslation: "Tớ vẽ một bông hoa mỉm cười bằng bút chì của tớ.", illustration: "✏️", category: "School" }
        ];
      }

      const parsedDeadline = teacherDeadline ? new Date(teacherDeadline).getTime() : undefined;
      const newLesson: Lesson = {
        id: `lesson-${Date.now()}`,
        title: fallbackTitle,
        level: teacherLevel,
        words: defaultSamples,
        createdAt: Date.now(),
        classId: teacherClassroomId,
        deadline: parsedDeadline,
      };

      setLessonsList((prev) => [newLesson, ...prev]);
      setSelectedLessonId(newLesson.id);
      setActiveWordIdx(0);
      setTeacherTopic("");
      setTeacherUploadText("");
      setTeacherUploadedFile(null);
      setTeacherClassroomId("");
      setTeacherDeadline("");
      setApiSuccessMsg("🎒 Đã thiết kế bộ từ vựng thông minh dự phòng cực kỳ sinh động cho bé tương tác!");
      playSound.playSuccess();
    } finally {
      setIsGenerating(false);
    }
  };

  // Student API Trigger: Generate Lesson with Gemini (by topic, content, or file)
  const handleStudentGenerateLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = studentPhoneInput.trim().replace(/[\s-]/g, "");
    if (!cleanPhone) {
      alert("Vui lòng nhập Số Điện Thoại để lưu trữ tiến độ và nhận giấy khen nhé! ⭐");
      return;
    }
    const matchedName = studentCustomName.trim();
    if (!matchedName) {
      alert("Con hãy nhập tên của con ở ô phía trên trước nhe! ⭐");
      return;
    }
    if (!studentTopic && !studentRawContent && !studentUploadedFile) {
      alert("Con hãy nhập chủ đề hoặc tải tệp ảnh/PDF bài tập lên nhé!");
      return;
    }

    // Ensure student record exists
    const record = StudentRecordManager.getRecord(cleanPhone, matchedName);

    const studentProfile = {
      phone: cleanPhone,
      name: matchedName,
      classId: "free",
      className: "Lớp Học Cô Phượng Uyên",
      teacherName: "Cô Phượng Uyên"
    };

    // Save profile to state and storage
    setLoggedInStudent(studentProfile);
    setDailyStars(record.totalStars);
    localStorage.setItem("minion_student_name", matchedName);
    localStorage.setItem("minion_student_session", JSON.stringify(studentProfile));

    setIsGenerating(true);
    setApiSuccessMsg(null);
    playSound.playClick();

    try {

      const bodyPayload: any = { level: studentLevel };
      if (createMethod === "topic") {
        bodyPayload.topic = studentTopic || undefined;
      } else if (createMethod === "text") {
        bodyPayload.rawContent = studentRawContent || undefined;
      } else if (createMethod === "image") {
        if (studentUploadedFile) {
          bodyPayload.fileData = studentUploadedFile.base64;
          bodyPayload.fileMime = studentUploadedFile.type;
        }
      }

      const response = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json();

      if (response.ok && data.words && data.words.length > 0) {
        let lessonTitle = data.title;
        if (!lessonTitle) {
          if (studentTopic) {
            lessonTitle = `🪄 AI: ${studentTopic}`;
          } else if (studentUploadedFile) {
            lessonTitle = `📄 Tự tạo từ tệp: ${studentUploadedFile.name}`;
          } else if (studentRawContent) {
            lessonTitle = `📝 Từ vựng tự soạn`;
          } else {
            lessonTitle = `🎈 Bài học tự do`;
          }
        }

        const newLesson: Lesson = {
          id: `lesson-${Date.now()}`,
          title: lessonTitle,
          level: studentLevel,
          words: data.words,
          createdAt: Date.now(),
          classId: studentProfile.classId,
        };

        try {
          await fetch("/api/lessons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newLesson),
          });
        } catch (err) {
          console.error("Lỗi đồng bộ bài học lên máy chủ", err);
        }

        setLessonsList((prev) => [newLesson, ...prev]);
        setSelectedLessonId(newLesson.id);
        setActiveWordIdx(0);
        setIsFlipped(false);

        // Log to study history
        const studentName = studentProfile.name;
        const classId = studentProfile.classId;
        const newSess: StudentStudySession = {
          lessonId: newLesson.id,
          studentName,
          classId,
          timestamp: Date.now()
        };
        setStudySessions((prev) => [newSess, ...prev.filter(s => !(s.lessonId === newLesson.id && s.studentName.toLowerCase() === studentName.toLowerCase() && s.classId === classId))]);
        const todayStr = getTodayString();
        const storageKey = `entered_${studentName.replace(/\s+/g, "_")}_${classId}_${newLesson.id}_${todayStr}`;
        localStorage.setItem(storageKey, "true");
        
        // Reset student creator inputs
        setStudentTopic("");
        setStudentRawContent("");
        setStudentUploadedFile(null);
        
        triggerStarAward(15); // Award 15 golden stars to students for generation!
        setApiSuccessMsg(`🎉 Bé tạo bài học "${newLesson.title}" bằng AI thành công! Hãy học ngay thôi con nhé! 💕 +15 Sao Vàng 🌟`);
        playSound.playSuccess();
        setActivePortal("student");
        setActiveTab("learn"); // Go back to learn tab immediately
      } else {
        throw new Error(data.error || "Không thể nhận diện cấu trúc bài học");
      }
    } catch (err: any) {
      console.warn("Lỗi tạo bài học của học sinh, chuyển sang fallback:", err);
      // Fallback words
      const fallbackTitle = studentTopic ? `🎈 AI: ${studentTopic}` : "🎈 Bài Học Tiếng Anh";
      
      // If user provided a word list, build fallback from their actual words
      let defaultSamples: any[];
      if (studentRawContent && studentRawContent.trim()) {
        const inputItems = parseRawContentClient(studentRawContent);
        defaultSamples = inputItems.map((item, idx) => {
          const capitalizedWord = item.english.charAt(0).toUpperCase() + item.english.slice(1);
          const isSentence = item.english.trim().split(/\s+/).length > 1;
          const dictEntry = getOrGenerateEntryClient(capitalizedWord);
          const translation = item.vietnamese || (dictEntry ? dictEntry.translation : capitalizedWord);
          const fallbackPhonetic = `/${item.english.toLowerCase().replace(/[^a-z\s]/g, "")}/`;
          
          return {
            id: `sfa-input-${idx}`,
            word: capitalizedWord,
            translation: translation,
            phonetic: dictEntry ? dictEntry.phonetic : fallbackPhonetic,
            sentence: isSentence ? capitalizedWord : (dictEntry && dictEntry.sentence ? dictEntry.sentence : `I like my ${item.english.toLowerCase()}.`),
            sentenceTranslation: isSentence ? translation : (dictEntry && dictEntry.sentenceTranslation ? dictEntry.sentenceTranslation : `Tôi yêu ${translation.toLowerCase()} của tôi.`),
            illustration: getFallbackIllustrationClient(item.english),
            category: studentTopic || "Uploaded List",
          };
        });
      } else {
        defaultSamples = (studentLevel === "pre-starter" || studentLevel === "starter" || studentLevel === "preschool") ? [
          { id: "sfa1", word: "Apple", translation: "Quả táo", phonetic: "/ˈæp.əl/", sentence: "The red apple is sweet.", sentenceTranslation: "Quả táo đỏ rất là ngọt.", illustration: "🍎", category: "Fruits" },
          { id: "sfa2", word: "Banana", translation: "Quả chuối", phonetic: "/bəˈnɑː.nə/", sentence: "A yellow banana is yummy.", sentenceTranslation: "Quả chuối vàng ăn thật là ngon lành.", illustration: "🍌", category: "Fruits" },
          { id: "sfa3", word: "Orange", translation: "Quả cam", phonetic: "/ˈɒr.ɪndʒ/", sentence: "I love drinking orange juice.", sentenceTranslation: "Tớ rất thích uống nước cam.", illustration: "🍊", category: "Fruits" }
        ] : [
          { id: "sfs1", word: "Computer", translation: "Máy tính", phonetic: "/kəmˈpjuː.tər/", sentence: "We play fun educational games on the computer.", sentenceTranslation: "Chúng tớ chơi những trò chơi học tập bổ ích trên máy tính.", illustration: "💻", category: "Tech" },
          { id: "sfs2", word: "Schoolbag", translation: "Cặp sách", phonetic: "/ˈskuːl.bæɡ/", sentence: "I put my new books inside my schoolbag.", sentenceTranslation: "Tớ cất những quyển sách mới vào trong cặp học sinh của tớ.", illustration: "🎒", category: "School" }
        ];
      }

      const newLesson: Lesson = {
        id: `lesson-${Date.now()}`,
        title: fallbackTitle,
        level: studentLevel,
        words: defaultSamples,
        createdAt: Date.now(),
        classId: studentProfile.classId,
      };

      setLessonsList((prev) => [newLesson, ...prev]);
      setSelectedLessonId(newLesson.id);
      setActiveWordIdx(0);
      setIsFlipped(false);

      // Log to study history
      const studentName = studentProfile.name;
      const classId = studentProfile.classId;
      const newSess: StudentStudySession = {
        lessonId: newLesson.id,
        studentName,
        classId,
        timestamp: Date.now()
      };
      setStudySessions((prev) => [newSess, ...prev.filter(s => !(s.lessonId === newLesson.id && s.studentName.toLowerCase() === studentName.toLowerCase() && s.classId === classId))]);
      const todayStr = getTodayString();
      const storageKey = `entered_${studentName.replace(/\s+/g, "_")}_${classId}_${newLesson.id}_${todayStr}`;
      localStorage.setItem(storageKey, "true");
      
      setStudentTopic("");
      setStudentRawContent("");
      setStudentUploadedFile(null);
      
      triggerStarAward(15);
      setApiSuccessMsg("🎉 Đã thiết kế bộ từ vựng thông minh tương ứng siêu đáng yêu cho con tương tác học tập!");
      playSound.playSuccess();
      setActivePortal("student");
      setActiveTab("learn");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E1F0FF] via-[#F3F9FF] to-[#FFFFFF] text-slate-800 font-sans pb-12 relative">
      <StarPopNotification showStarPopEffect={showStarPopEffect} dailyStars={dailyStars} />
      
      <CertificateModal
        selectedCertificateAttempt={selectedCertificateAttempt}
        onClose={() => setSelectedCertificateAttempt(null)}
        certStudentName={certStudentName}
        setCertStudentName={setCertStudentName}
        certTeacherName={certTeacherName}
        setCertTeacherName={setCertTeacherName}
        certLessonTitle={certLessonTitle}
        setCertLessonTitle={setCertLessonTitle}
        certDate={certDate}
        setCertDate={setCertDate}
        certQuizScore={certQuizScore}
        certGameScore={certGameScore}
        certTotalStars={certTotalStars}
        certWeeklyStars={certWeeklyStars}
        language={language}
      />

      <AppHeader
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        currentGoldStars={currentGoldStars}
        dailyStars={dailyStars}
        currentLevel={currentLevel}
        studentLevel={studentLevel}
        studentCustomName={studentCustomName}
        setStudentCustomName={setStudentCustomName}
        setLoggedInStudent={setLoggedInStudent}
        setActiveTab={setActiveTab}
      />

      <main className="max-w-6xl mx-auto px-4 mt-8">
        <SuccessAlert message={apiSuccessMsg} onClose={() => setApiSuccessMsg(null)} />

        {activePortal === "landing" && (
          <LandingPage
            handleStudentGenerateLessonSubmit={handleStudentGenerateLessonSubmit}
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
            studentCustomName={studentCustomName}
            setStudentCustomName={setStudentCustomName}
            studentPhoneInput={studentPhoneInput}
            setStudentPhoneInput={setStudentPhoneInput}
            setLoggedInStudent={setLoggedInStudent}
          />
        )}

        {activePortal === "teacher" && null && (
          <TeacherPortal
            teacherSubtab={teacherSubtab}
            setTeacherSubtab={setTeacherSubtab}
            classroomsList={classroomsList}
            teacherClassroomId={teacherClassroomId}
            setTeacherClassroomId={setTeacherClassroomId}
            setTeacherLevel={setTeacherLevel}
            teacherDeadline={teacherDeadline}
            setTeacherDeadline={setTeacherDeadline}
            teacherTopic={teacherTopic}
            setTeacherTopic={setTeacherTopic}
            teacherUploadText={teacherUploadText}
            setTeacherUploadText={setTeacherUploadText}
            teacherUploadedFile={teacherUploadedFile}
            setTeacherUploadedFile={setTeacherUploadedFile}
            isGenerating={isGenerating}
            handleGenerateLessonSubmit={handleGenerateLessonSubmit}
            lessonsList={lessonsList}
            selectedLessonId={selectedLessonId}
            setSelectedLessonId={setSelectedLessonId}
            setActiveWordIdx={setActiveWordIdx}
            handleCopyShareLink={handleCopyShareLink}
            selectedClassroomId={selectedClassroomId}
            setSelectedClassroomId={setSelectedClassroomId}
            handleDeleteClass={handleDeleteClass}
            handleCreateClassSubmit={handleCreateClassSubmit}
            newClassNameInput={newClassNameInput}
            setNewClassNameInput={setNewClassNameInput}
            newClassStudents={newClassStudents}
            setNewClassStudents={setNewClassStudents}
            activeClassroom={activeClassroom}
            handleAddStudentToClass={handleAddStudentToClass}
            addStudentName={addStudentName}
            setAddStudentName={setAddStudentName}
            addStudentPhone={addStudentPhone}
            setAddStudentPhone={setAddStudentPhone}
            testAttempts={testAttempts}
            setTestAttempts={setTestAttempts}
            editingStudentIdx={editingStudentIdx}
            setEditingStudentIdx={setEditingStudentIdx}
            editStudentName={editStudentName}
            setEditStudentName={setEditStudentName}
            editStudentPhone={editStudentPhone}
            setEditStudentPhone={setEditStudentPhone}
            handleSaveEditedStudent={handleSaveEditedStudent}
            openCertificate={openCertificate}
            setApiSuccessMsg={setApiSuccessMsg}
          />
        )}

        {activePortal === "student" && (
          <StudentPortal
            activeLesson={activeLesson}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedLessonId={selectedLessonId}
            activeWordIdx={activeWordIdx}
            setActiveWordIdx={setActiveWordIdx}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
            nextWord={nextWord}
            prevWord={prevWord}
            activeTestActive={activeTestActive}
            setActiveTestActive={setActiveTestActive}
            activeGamesActive={activeGamesActive}
            setActiveGamesActive={setActiveGamesActive}
            testReport={testReport}
            setTestReport={setTestReport}
            quizSettingsCount={quizSettingsCount}
            setQuizSettingsCount={setQuizSettingsCount}
            loggedInStudent={loggedInStudent}
            studentLessons={studentLessons}
            lessonsList={lessonsList}
            studySessions={studySessions}
            handleCopyShareLink={handleCopyShareLink}
            enterLessonToStudy={enterLessonToStudy}
            handleVocalComplete={handleVocalComplete}
            triggerStarAward={triggerStarAward}
            openCertificate={openCertificate}
            handleStudentGenerateLessonSubmit={handleStudentGenerateLessonSubmit}
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
            studentCustomName={studentCustomName}
            setStudentCustomName={setStudentCustomName}
            studentPhoneInput={studentPhoneInput}
            setStudentPhoneInput={setStudentPhoneInput}
            setTestAttempts={setTestAttempts}
            setApiSuccessMsg={setApiSuccessMsg}
          />
        )}
      </main>
      <AppFooter />
    </div>
  );
}
