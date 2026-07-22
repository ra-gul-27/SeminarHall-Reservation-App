import { useState, useMemo } from 'react';

export function useCalendar() {
  const [monthOffset, setMonthOffset] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<'fn' | 'an' | null>(null);

  const { activeDate, daysInMonth, firstDayIndex } = useMemo(() => {
    const today = new Date();
    const date = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    
    return {
      activeDate: date,
      daysInMonth: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
      firstDayIndex: date.getDay(),
    };
  }, [monthOffset]);

  const nextMonth = () => {
    if (monthOffset < 2) {
      setMonthOffset(prev => prev + 1);
      setSelectedDay(null);
      setSelectedSlot(null);
    }
  };

  const prevMonth = () => {
    if (monthOffset > 0) {
      setMonthOffset(prev => prev - 1);
      setSelectedDay(null);
      setSelectedSlot(null);
    }
  };

  return {
    monthOffset,
    activeDate,
    daysInMonth,
    firstDayIndex,
    selectedDay,
    setSelectedDay,
    selectedSlot,
    setSelectedSlot,
    nextMonth,
    prevMonth,
  };
}
