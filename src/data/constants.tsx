import React from "react";

// Dynamic gorgeous image logo for "Trung Tâm Ngoại Ngữ Cô Phượng Uyên"
export const LogoSVG = ({ className = "h-14 w-14" }) => (
  <img
    src="https://i.postimg.cc/L4nGqs4D/650361495-1628861905304764-7370063187505837857-n.jpg"
    alt="Logo Cô Phượng Uyên"
    referrerPolicy="no-referrer"
    className={`${className} object-cover rounded-xl border border-blue-200 shadow-sm`}
  />
);
