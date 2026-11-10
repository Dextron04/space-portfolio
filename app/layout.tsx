import type { Metadata } from "next"
import "./globals.css"
import Shell from "@/components/Shell"

export const metadata: Metadata = {
  metadataBase: new URL("https://dextron04.in"),
  alternates: { canonical: "./" }, // both dextron04.in and www serve the site; search engines get the apex
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
