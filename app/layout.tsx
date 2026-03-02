import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DogPath - הדואולינגו של אילוף כלבים",
  description: "פלטפורמת אימון כלבים אינטראקטיבית המחברת בין מאלפים ללקוחות",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${assistant.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
