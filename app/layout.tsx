import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import fs from "fs/promises";
import path from "path";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Power Print & Graphic Solutions",
  description: "Te ayudamos a materializar tu marca. Cartelería corpórea, marquesinas y soluciones gráficas de alta calidad.",
};

async function getThemeColors() {
  try {
    const filePath = path.join(process.cwd(), "data", "content.json");
    const fileContent = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(fileContent);
    return data.theme;
  } catch (error) {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemeColors();

  const themeStyle = theme ? `
    :root {
      --background: ${theme.background || "#faf9fa"};
      --foreground: ${theme.foreground || "#19191a"};
      --color-neutral-50: ${theme.neutral50 || "#faf9fa"};
      --color-neutral-900: ${theme.neutral900 || "#19191a"};
      --color-orange-main: ${theme.orangeMain || "#f68322"};
      --color-orange-600: ${theme.orange600 || "#e7630f"};
      --color-orange-700: ${theme.orange700 || "#bf4b0f"};
      --color-red-main: ${theme.redMain || "#f53722"};
    }
  ` : "";

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {themeStyle && (
          <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
        )}
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
