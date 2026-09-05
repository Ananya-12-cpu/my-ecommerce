import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { OrdersProvider } from "@/lib/orders-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { DeliveryProvider } from "@/lib/delivery-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
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
  title: "Shoply — Shop smarter",
  description: "A clean, professional storefront built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            <OrdersProvider>
              <WishlistProvider>
                <DeliveryProvider>
                  <Header />
                  <main className="flex flex-1 flex-col">{children}</main>
                  <Footer />
                  <Chatbot />
                </DeliveryProvider>
              </WishlistProvider>
            </OrdersProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
