import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react';
import StyledComponentsRegistry from '../lib/AntdRegistry';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChatCard',
  description: 'ChatGPT WebUI by zmlix',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
