
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Groupware Solution",
  description: "Enterprise groupware solution",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-[#F4F5F7] text-[#172B4D] font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
