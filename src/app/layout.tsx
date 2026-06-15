import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Safe Estimate AI — Safety-First Estimate Drafting",
  description:
    "AI-assisted estimate drafting for home service companies. Every estimate requires human review before it reaches a customer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Nav />
        <main>{children}</main>
        <footer className="border-t border-gray-200 mt-16 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            <p className="mb-1 font-medium text-gray-700">
              ⚠️ AI-generated estimates are drafts only. Every estimate requires
              professional review before being shared with customers.
            </p>
            <p>
              Safe Estimate AI does not guarantee prices, code compliance, or
              permit requirements. © {new Date().getFullYear()} Safe Estimate
              AI.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
