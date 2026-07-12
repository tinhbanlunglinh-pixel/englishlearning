import React from "react";
import { LogoSVG } from "../data/constants";

export const AppFooter = () => (
  <footer className="mt-16 bg-gradient-to-b from-blue-700 to-indigo-950 text-white border-t-8 border-indigo-950 pt-12 pb-8 px-6">
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-white/10 pb-8">
        
        {/* Logo and Slogan Column (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-2xl border-2 border-blue-100 flex items-center justify-center shrink-0 w-16 h-16">
              <LogoSVG className="h-full w-auto" />
            </div>
            <div>
              <h3 className="font-sans font-black text-lg tracking-tight uppercase leading-none">
                Trung Tâm Cô Phượng Uyên
              </h3>
              <p className="text-[11px] font-bold text-sky-100 uppercase tracking-wide mt-1.5">
                Learn today, better tomorrow 🌟
              </p>
            </div>
          </div>
          <p className="text-xs text-blue-100/90 leading-relaxed font-semibold italic mt-1 font-sans">
            "Đồng hành cùng học viên xây dựng nền móng vững chắc, mở khóa tương lai tươi sáng và chắp cánh ước mơ tiếng Anh bay xa."
          </p>
        </div>

        {/* Address Details Column (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-3">
          <h4 className="font-sans font-extrabold text-sm uppercase tracking-wider text-sky-200 border-l-4 border-white pl-2 leading-none">
            📍 Thông Tin Đào Tạo
          </h4>
          <div className="flex flex-col gap-2.5 text-xs text-sky-50 leading-relaxed font-bold">
            <div className="flex gap-2">
              <span className="text-sm shrink-0">🏛️</span>
              <p>
                <span className="text-white block uppercase text-[10px] tracking-wider mb-0.5">Giám Đốc Trung Tâm:</span>
                Võ Thùy Phượng Uyên
              </p>
            </div>
            <div className="flex gap-2 border-t border-white/5 pt-2">
              <span className="text-sm shrink-0">✨</span>
              <p>
                <span className="text-white block uppercase text-[10px] tracking-wider mb-0.5">Phương Châm:</span>
                Learn today, better tomorrow • Dễ tiếp thu, nâng chuẩn rèn luyện toàn diện
              </p>
            </div>
          </div>
        </div>

        {/* Contact & Social Links (3 cols) */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <h4 className="font-sans font-extrabold text-sm uppercase tracking-wider text-sky-200 border-l-4 border-white pl-2 leading-none">
            ✨ LIÊN HỆ ĐĂNG KÝ
          </h4>
          <div className="flex flex-col gap-3">
            <a
              href="tel:0985846325"
              className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-2xl flex items-center gap-3 border border-white/10 group cursor-pointer"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📱</span>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-sky-200 font-extrabold leading-none">Hotline / Zalo Cô Phượng Uyên</span>
                <span className="text-sm font-black text-white">0985.846.325</span>
              </div>
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=100045429101693"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-2xl flex items-center gap-3 border border-white/10 group cursor-pointer"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🌐</span>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-sky-200 font-extrabold leading-none">Facebook Giám Đốc</span>
                <span className="text-xs font-black text-white hover:underline truncate max-w-[150px] block">Ghé thăm Facebook Cô Phượng Uyên 🎉</span>
              </div>
            </a>
          </div>
        </div>

      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-sky-200/80 font-bold gap-2">
        <p>© {new Date().getFullYear()} Trung Tâm Ngoại Ngữ Cô Phượng Uyên. Learn today, better tomorrow.</p>
        <p className="flex items-center gap-1.5 bg-white/5 py-1 px-3 rounded-full border border-white/5">
          <span>👑 Tự Hào Chinh Phục Kiến Thức Anh Ngữ</span>
        </p>
      </div>
    </div>
  </footer>
);
