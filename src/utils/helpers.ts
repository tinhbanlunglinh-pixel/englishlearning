import { Lesson } from "../types";
import { DictionaryEntry, commonWordsDictClient } from "../data/dictionary";

export function getOrGenerateEntryClient(word: string): DictionaryEntry | undefined {
  const key = word.toLowerCase().trim();
  const cleanKey = key.endsWith(".") ? key.slice(0, -1).trim() : key;
  const entry = commonWordsDictClient[key] || commonWordsDictClient[cleanKey];
  if (!entry) return undefined;
  
  if (entry.sentence && entry.sentenceTranslation) {
    return entry;
  }
  
  // Heuristic sentence generation
  let sentence = "";
  let sentenceTranslation = "";
  const translation = entry.translation;
  
  // Check if it is a color
  const colors = ["red", "blue", "green", "yellow", "pink", "purple", "black", "white", "brown", "grey", "gray"];
  // Check if it is a number
  const numbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  // Check if it is a greeting
  const greetings = ["hello", "goodbye"];
  
  if (colors.includes(cleanKey)) {
    sentence = `I like ${cleanKey}.`;
    sentenceTranslation = `Tôi thích màu ${translation.toLowerCase()}.`;
  } else if (numbers.includes(cleanKey)) {
    sentence = `I have ${cleanKey} apples.`;
    sentenceTranslation = `Tôi có ${translation.toLowerCase()} quả táo.`;
  } else if (greetings.includes(cleanKey)) {
    sentence = `I say ${cleanKey} to you.`;
    sentenceTranslation = `Tôi nói ${translation.toLowerCase()} với bạn.`;
  } else {
    sentence = `I like my ${cleanKey}.`;
    sentenceTranslation = `Tôi yêu ${translation.toLowerCase()} của tôi.`;
  }
  
  return {
    ...entry,
    sentence,
    sentenceTranslation
  };
}

export function parseRawContentClient(rawContent: string): { english: string; vietnamese: string }[] {
  let lines = rawContent.split(/[\n;]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0);
  if (lines.length === 1 && lines[0].includes(",")) {
    lines = lines[0].split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0);
  }
  
  return lines.map(line => {
    let english = line;
    let vietnamese = "";
    
    const separators = [" - ", " – ", " : ", " / ", " (", "=>"];
    for (const sep of separators) {
      const idx = line.indexOf(sep);
      if (idx !== -1) {
        english = line.substring(0, idx).trim();
        vietnamese = line.substring(idx + sep.length).replace(/\)$/, "").trim();
        break;
      }
    }
    
    english = english.replace(/^\d+[\s.\-_)]+/, "").trim();
    return { english, vietnamese };
  }).filter(item => item.english.length > 0);
}

// Helper function to group and sort lessons by day (newest first)
export const groupLessonsByDate = (lessons: Lesson[]): { [dateStr: string]: Lesson[] } => {
  const groups: { [dateStr: string]: Lesson[] } = {};
  if (!lessons || !Array.isArray(lessons)) return groups;
  const sorted = [...lessons].sort((sourceA, sourceB) => (sourceB.createdAt || 0) - (sourceA.createdAt || 0));
  
  sorted.forEach((lesson) => {
    const ts = lesson.createdAt || Date.now();
    const d = new Date(ts);
    const dateStr = `Ngày ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(lesson);
  });
  return groups;
};

export const formatLessonDate = (timestamp: number) => {
  const d = new Date(timestamp);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

export const formatLessonDeadline = (timestamp?: number) => {
  if (!timestamp) return "Không giới hạn";
  const d = new Date(timestamp);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} lúc ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<string> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    img.onerror = () => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    };
  });
};
