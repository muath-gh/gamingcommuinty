import { AuthProvider } from "@/lib/providers/AuthProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import { Toaster } from "react-hot-toast";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARENA — مركز الألعاب",
  description: "تواصل مع اللاعبين، وانضم إلى الفرق، وتسلق قوائم المتصدرين",
  openGraph: {
    images: [{ url: "https://bolt.new/static/og_default.png" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: "https://bolt.new/static/og_default.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${cairo.variable}`}>
      <AuthProvider>
        <body className="font-sans antialiased">
          {children}
          <Toaster position="bottom-right" />
        </body>
      </AuthProvider>
    </html>
  );
}
