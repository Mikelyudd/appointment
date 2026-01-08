'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Service, Specialist, TimeSlot } from '@/types';

interface BookingState {
    selectedService: Service | null;
    selectedSpecialist: Specialist | null;
    selectedTimeSlot: TimeSlot | null;
}

type BookingAction =
    | { type: 'SELECT_SERVICE'; payload: Service }
    | { type: 'SELECT_SPECIALIST'; payload: Specialist | null }
    | { type: 'SELECT_TIME_SLOT'; payload: TimeSlot }
    | { type: 'RESET' };

const initialState: BookingState = {
    selectedService: null,
    selectedSpecialist: null,
    selectedTimeSlot: null,
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
    switch (action.type) {
        case 'SELECT_SERVICE':
            return {
                ...state,
                selectedService: action.payload,
                selectedSpecialist: null,
                selectedTimeSlot: null,
            };
        case 'SELECT_SPECIALIST':
            return {
                ...state,
                selectedSpecialist: action.payload,
                selectedTimeSlot: null,
            };
        case 'SELECT_TIME_SLOT':
            return {
                ...state,
                selectedTimeSlot: action.payload,
            };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

const BookingContext = createContext<{
    state: BookingState;
    dispatch: React.Dispatch<BookingAction>;
} | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(bookingReducer, initialState);

    return (
        <BookingContext.Provider value={{ state, dispatch }}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
}
