import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// ฟอนต์แบรนด์ DB Heavent (ไฟล์จาก D:\0.2026\Set Up 4Ai\Font\DB_Heavent\DB_Heavent_Original)
// Regular = เนื้อหา · Med = หัวข้อ · Bold = ตัวเลขผลลัพธ์
const dbHeavent = localFont({
  src: [
    { path: "./fonts/DBHeavent-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/DBHeavent-Med.ttf", weight: "500", style: "normal" },
    { path: "./fonts/DBHeavent-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-db-heavent",
  display: "swap",
});

export const metadata: Metadata = {
  title: "คำนวณผ่อนบ้าน | Kanda",
  description: "คำนวณยอดผ่อนต่อเดือน และรายได้ขั้นต่ำที่ธนาคารน่าจะอนุมัติ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${dbHeavent.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
