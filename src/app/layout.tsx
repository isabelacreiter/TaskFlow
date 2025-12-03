import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AccessibilityBar from "@/components/accessibility/AccessibilityBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow - Gerenciador de Tarefas",
  description: "TaskFlow: gerenciamento de tarefas com acessibilidade digital",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* VLibras - Intérprete de Libras */}
        <script src="https://vlibras.gov.br/app/vlibras.js"></script>
        <script>
          {`
            new window.VLibras.Widget('https://vlibras.gov.br/app');
          `}
        </script>
        {/* Meta tags para acessibilidade */}
        <meta name="color-scheme" content="light dark" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          fontSize: "var(--font-size, 16px)",
          lineHeight: "1.6",
        }}
      >
        {/* VLibras Widget */}
        <div id="vlibras-widget"></div>

        {/* Botão de Acessibilidade Flutuante */}
        <AccessibilityBar />

        {children}
        <Toaster />
      </body>
    </html>
  );
}

