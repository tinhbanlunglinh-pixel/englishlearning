export interface DictionaryEntry {
  translation: string;
  phonetic: string;
  sentence?: string;
  sentenceTranslation?: string;
}

export const commonWordsDictClient: Record<string, DictionaryEntry> = {
  "teacher": { translation: "Giáo viên", phonetic: "/ˈtiːtʃə(r)/", sentence: "I love my teacher.", sentenceTranslation: "Tôi yêu cô giáo của tôi." },
  "student": { translation: "Học sinh", phonetic: "/ˈstjuːdnt/", sentence: "I am a good student.", sentenceTranslation: "Tôi là một học sinh ngoan." },
  "classroom": { translation: "Lớp học", phonetic: "/ˈklɑːsruːm/", sentence: "I like my classroom.", sentenceTranslation: "Tôi yêu lớp học của tôi." },
  "schoolbag": { translation: "Cặp sách", phonetic: "/ˈskuːlbæɡ/", sentence: "I put books in my schoolbag.", sentenceTranslation: "Tôi cất sách vào cặp." },
  "homework": { translation: "Bài tập về nhà", phonetic: "/ˈhəʊmwɜːk/", sentence: "I do my homework every day.", sentenceTranslation: "Tôi làm bài tập về nhà mỗi ngày." },
  "playground": { translation: "Sân chơi", phonetic: "/ˈpleɪɡraʊnd/", sentence: "I run in the playground.", sentenceTranslation: "Tôi chạy nhảy ở sân chơi." },
  "home": { translation: "Nhà", phonetic: "/həʊm/", sentence: "I go home after school.", sentenceTranslation: "Tôi về nhà sau giờ học." },
  "school": { translation: "Trường học", phonetic: "/skuːl/", sentence: "I go to school every day.", sentenceTranslation: "Tôi đi học mỗi ngày." },
  "book": { translation: "Quyển sách", phonetic: "/bʊk/", sentence: "I read a fun book.", sentenceTranslation: "Tôi đọc một quyển sách thú vị." },
  "pencil": { translation: "Bút chì", phonetic: "/ˈtensl/", sentence: "I write with my pencil.", sentenceTranslation: "Tôi vẽ bằng bút chì của tôi." },
  "desk": { translation: "Bàn học", phonetic: "/desk/", sentence: "I sit at my desk.", sentenceTranslation: "Tôi ngồi ở bàn học của tôi." },
  "chair": { translation: "Ghế", phonetic: "/tʃeə(r)/", sentence: "I sit on my chair.", sentenceTranslation: "Tôi ngồi trên ghế của tôi." },
  "blackboard": { translation: "Bảng đen", phonetic: "/ˈblækbɔːd/", sentence: "The teacher writes on the blackboard.", sentenceTranslation: "Cô giáo viết trên bảng đen." },
  "pen": { translation: "Bút mực", phonetic: "/pen/", sentence: "I write with my pen.", sentenceTranslation: "Tôi viết bằng bút mực của tôi." },
  "eraser": { translation: "Cục tẩy", phonetic: "/ɪˈreɪzə(r)/", sentence: "I rub with my eraser.", sentenceTranslation: "Tôi tẩy bằng cục tẩy của tôi." },
  "ruler": { translation: "Thước kẻ", phonetic: "/ˈruːlə(r)/", sentence: "I use my ruler to draw lines.", sentenceTranslation: "Tôi dùng thước kẻ để vẽ các đường thẳng." },
  "notebook": { translation: "Vở ghi", phonetic: "/ˈnəʊtbʊk/", sentence: "I write in my notebook.", sentenceTranslation: "Tôi viết vào vở của tôi." },
  "cat": { translation: "Con mèo", phonetic: "/kæt/", sentence: "I like my cat.", sentenceTranslation: "Tôi yêu con mèo của tôi." },
  "dog": { translation: "Con chó", phonetic: "/dɒɡ/", sentence: "I like my dog.", sentenceTranslation: "Tôi yêu con chó của tôi." },
  "bird": { translation: "Con chim", phonetic: "/bɜːd/", sentence: "The bird sings sweet songs.", sentenceTranslation: "Chú chim hót những khúc ca ngọt ngào." },
  "monkey": { translation: "Con khỉ", phonetic: "/ˈmʌŋki/", sentence: "The monkey eats sweet bananas.", sentenceTranslation: "Chú khỉ ăn những quả chuối ngọt lịm." },
  "rabbit": { translation: "Con thỏ", phonetic: "/ˈræbɪt/", sentence: "The white rabbit hops fast.", sentenceTranslation: "Chú thỏ trắng nhảy thật nhanh." },
  "lion": { translation: "Sư tử", phonetic: "/ˈlaɪən/", sentence: "The big lion rules the jungle.", sentenceTranslation: "Sư tử to lớn thống trị khu rừng." },
  "elephant": { translation: "Con voi", phonetic: "/ˈelɪfənt/", sentence: "The elephant has a very long nose.", sentenceTranslation: "Chú voi có một chiếc mũi rất dài." },
  "frog": { translation: "Con ếch", phonetic: "/frɒɡ/", sentence: "The green frog jumps high.", sentenceTranslation: "Chú ếch xanh nhảy thật cao." },
  "apple": { translation: "Quả táo", phonetic: "/ˈæpl/", sentence: "I eat a crunchy red apple.", sentenceTranslation: "Tôi ăn một quả táo đỏ giòn rụm." },
  "banana": { translation: "Quả chuối", phonetic: "/bəˈnɑːnə/", sentence: "I love eating sweet yellow bananas.", sentenceTranslation: "Tôi thích ăn những quả chuối vàng ngọt lịm." },
  "orange": { translation: "Quả cam", phonetic: "/ˈɒrɪndʒ/", sentence: "I drink orange juice in the morning.", sentenceTranslation: "Tôi uống nước cam vào buổi sáng." },
  "hello": { translation: "Xin chào", phonetic: "/həˈləʊ/", sentence: "I say hello to my friends.", sentenceTranslation: "Tôi chào các bạn của tôi." },
  "goodbye": { translation: "Tạm biệt", phonetic: "/ˌɡʊdˈbaɪ/", sentence: "I say goodbye to my teacher.", sentenceTranslation: "Tôi chào tạm biệt cô giáo của tôi." },
  "mother": { translation: "Mẹ", phonetic: "/ˈmʌðə(r)/", sentence: "I love my mother very much.", sentenceTranslation: "Tôi yêu mẹ của tôi rất nhiều." },
  "father": { translation: "Bố", phonetic: "/ˈfɑːðə(r)/", sentence: "My father plays games with me.", sentenceTranslation: "Bố chơi trò chơi với tôi." },
  "brother": { translation: "Anh/Em trai", phonetic: "/ˈbrʌðə(r)/", sentence: "I play football with my brother.", sentenceTranslation: "Tôi chơi đá bóng với anh/em trai của tôi." },
  "sister": { translation: "Chị/Em gái", phonetic: "/ˈsɪstə(r)/", sentence: "I share my toys with my sister.", sentenceTranslation: "Tôi chia sẻ đồ chơi với chị/em gái của tôi." },
  "baby": { translation: "Em bé", phonetic: "/ˈbeɪbi/", sentence: "The cute baby is sleeping.", sentenceTranslation: "Em bé đáng yêu đang ngủ." },
  "family": { translation: "Gia đình", phonetic: "/ˈfæməli/", sentence: "I love my happy family.", sentenceTranslation: "Tôi yêu gia đình hạnh phúc của tôi." },
  "house": { translation: "Ngôi nhà", phonetic: "/haʊs/", sentence: "This is my lovely house.", sentenceTranslation: "Đây là ngôi nhà đáng yêu của tôi." },
  "door": { translation: "Cửa ra vào", phonetic: "/dɔː(r)/", sentence: "I open the door for my mom.", sentenceTranslation: "Tôi mở cửa cho mẹ." },
  "window": { translation: "Cửa sổ", phonetic: "/ˈwɪndəʊ/", sentence: "I look out of the window.", sentenceTranslation: "Tôi nhìn ra ngoài cửa sổ." },
  "bag": { translation: "Cặp sách", phonetic: "/bæɡ/", sentence: "I pack my books into my bag.", sentenceTranslation: "Tôi xếp sách vào cặp học sinh." },
  "board": { translation: "Bảng học", phonetic: "/bɔːd/", sentence: "Please look at the board.", sentenceTranslation: "Xin vui lòng nhìn lên bảng." },
  "marker": { translation: "Bút viết bảng", phonetic: "/ˈmɑːkə(r)/", sentence: "I write on the white board with a marker.", sentenceTranslation: "Tôi viết lên bảng trắng bằng bút lông." },
  "computer": { translation: "Máy tính", phonetic: "/kəmˈpjuːtə(r)/", sentence: "We learn English on the computer.", sentenceTranslation: "Chúng tôi học tiếng Anh trên máy tính." },
  "crayon": { translation: "Bút sáp màu", phonetic: "/ˈkreɪɒn/", sentence: "I draw a picture with my crayon.", sentenceTranslation: "Tôi vẽ một bức tranh bằng bút sáp màu của tôi." },
  "crayons": { translation: "Bút sáp màu", phonetic: "/ˈkreɪɒnz/", sentence: "I color with my crayons.", sentenceTranslation: "Tôi tô màu bằng bút sáp màu của tôi." }
};

export function getFallbackIllustrationClient(word: string): string {
  const dict: Record<string, string> = {
    "classroom": "🏫",
    "teacher": "👩‍🏫",
    "student": "🧑‍🎓",
    "school": "🎒",
    "book": "📖",
    "pencil": "✏️",
    "desk": "✍️",
    "chair": "🪑",
    "blackboard": "📋",
    "pen": "🖊️",
    "eraser": "🧽",
    "ruler": "📏",
    "notebook": "📓",
    "schoolbag": "🎒",
    "computer": "💻",
    "homework": "📝",
    "home": "🏠",
    "house": "🏠",
    "playground": "🛝",
    "mother": "👩",
    "father": "👨",
    "brother": "👦",
    "sister": "👧",
    "baby": "👶",
    "family": "👪",
    "door": "🚪",
    "window": "🪟",
    "bag": "🎒",
    "board": "📋",
    "marker": "🖊️",
    "crayon": "🖍️",
    "crayons": "🖍️",
    "hello": "👋",
    "goodbye": "👋",
    "cat": "🐱",
    "dog": "🐶",
    "bird": "🐦",
    "monkey": "🐵",
    "rabbit": "🐰",
    "lion": "🦁",
    "elephant": "🐘",
    "frog": "🐸",
    "apple": "🍎",
    "banana": "🍌",
    "orange": "🍊",
    "watermelon": "🍉",
    "cherry": "🍒",
    "strawberry": "🍓",
    "lemon": "🍋",
    "peach": "🍑",
    "pear": "🍐",
    "mango": "🥭",
    "pineapple": "🍍",
    "grape": "🍇",
    "grapes": "🍇",
    "melon": "🍈",
    "kiwi": "🥝",
    "coconut": "🥥",
    "avocado": "🥑",
    "tomato": "🍅"
  };
  const key = word.toLowerCase().trim().replace(/[.,?!]/g, "");
  if (dict[key]) return dict[key];
  
  const list = ["✨", "🌟", "💫", "⭐", "🎯", "🧩", "💡", "🔔", "🎵", "🎶", "💮", "💠", "🌈", "💎", "🔮", "🪄", "🏆", "🏅", "🎨", "🎈", "🎉", "🎊", "🎀", "🎁", "🪄", "🔮", "🧸"];
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % list.length;
  return list[index];
}
