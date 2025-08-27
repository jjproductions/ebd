"use client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const theme = createTheme({ palette: { mode } });

  // Simple toggle button for demonstration
  const handleToggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <button
            style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}
            onClick={handleToggleTheme}
          >
            Toggle {mode === 'light' ? 'Dark' : 'Light'} Mode
          </button>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
