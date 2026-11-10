import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

// Static fallback for Safari / iOS, which ignore animated SVG favicons.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg width="180" height="180" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" fill="#0a0b0d" />
        <g fill="none" stroke="#f5f5f7" strokeWidth="5.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 19H26M17 19V47" />
          <path d="M35 19V47M35 34L47 19M39 30.5L48 47" />
        </g>
        <rect x="52" y="41" width="5" height="6" rx="1" fill="#f5f5f7" />
      </svg>
    ),
    size
  )
}
