import "../../styles/tailwind.css"
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SolarPunk Image Hub - Free Sustainable Future Images",
  description: "Discover and download high-quality, free-to-use SolarPunk images. Envisioning a sustainable, green future through art.",
  keywords: "SolarPunk, sustainable, green, future, images, free, download, eco-friendly, renewable energy",
  authors: [{ name: "SolarPunk Image Hub" }],
  openGraph: {
    title: "SolarPunk Image Hub",
    description: "Free high-quality SolarPunk images for your projects",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
