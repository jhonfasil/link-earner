import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const ADSENSE_ID = "ca-pub-1991660235760053";

export const metadata: Metadata = {
  title: "LinkEarner - Professional Link Shortener",
  description: "Shorten links, track analytics, and manage your traffic.",
  // THIS IS THE MAGIC TAG GOOGLE LOOKS FOR:
  other: {
    "google-adsense-account": ADSENSE_ID,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### Step 2: Push the changes
You know the drill! Send this update to Vercel.

```bash
git add .
git commit -m "Add AdSense meta tag for verification"
git push