import type { Metadata } from "next";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Bricolage_Grotesque } from "next/font/google";
import { Space_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { cn } from "@/lib/utils";
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const fontHeading = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "antialiased",
            fontHeading.variable,
            fontBody.variable,
            "mb-8"
          )}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
