// src/app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css'
import { BookingProvider } from '@/contexts/BookingContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "GoldEngine | Professional Appointments",
  description: "Next generation appointment management system",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <BookingProvider>
                        {children}
                        <Toaster position="top-center" />
                    </BookingProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
