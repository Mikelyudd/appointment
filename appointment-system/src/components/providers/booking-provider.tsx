'use client'

import { BookingProvider } from '@/contexts/BookingContext'

export function Providers({ children }: { children: React.ReactNode }) {
    return <BookingProvider>{children}</BookingProvider>
}
