import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppHeader } from "@/components/layout/app-header"
import { AppFooter } from "@/components/layout/app-footer"
import { ProgressBarProvider } from "@/components/providers/progress-bar-provider"
import "nprogress/nprogress.css"
import { Suspense } from "react"

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
})

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
})

export const metadata: Metadata = {
    title: "Track2Go",
    description: "Git-inspired repository tracking system",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html suppressHydrationWarning lang="en" className={inter.variable}>
            <body className={`${geistMono.variable} antialiased min-h-screen flex flex-col`}>
                <ThemeProvider>
                    <AppHeader />
                        <main className="flex-1">
                            {children}
                        </main> 
                    <AppFooter />
                </ThemeProvider>
            </body>
        </html>
    )
}