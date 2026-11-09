import type { Metadata } from "next"
import "./globals.css"
import Shell from "@/components/Shell"

export const metadata: Metadata = {
  title: "Tushin Kulshreshtha — Software Engineer",
  description: "Software engineer building secure, scalable backend, cloud and ML systems.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
