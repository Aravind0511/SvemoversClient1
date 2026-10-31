import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import type { Booking } from '../types';
import {
  generateMonthGrid,
  findConflictingBooking,
  formatDateDisplay,
  addDaysISO,
} from '../utils/dateUtils';
import './AvailabilityCalendar.css';

export interface AvailabilityCalendarProps {
  equipmentId: string;
  equipmentName: string;
  bookings: Booking[];
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  onSelectDateRange: (start: string, end: string) => void;
  onUnavailableDateSelected?: (dateStr: string, message: string) => void;
  onClearDates?: () => void;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  equipmentId,
  equipmentName,
  bookings,
  startDate,
  endDate,
  onSelectDateRange,
  onUnavailableDateSelected,
  onClearDates,
}) => {
  // Default to October 2026 to match reference UI (0-indexed: 9 = October)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9);
  const [activeHint, setActiveHint] = useState<string | null>(null);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToActiveMonth = () => {
    if (startDate) {
      const parts = startDate.split('-');
      if (parts.length === 3) {
        setCurrentYear(parseInt(parts[0], 10));
        setCurrentMonth(parseInt(parts[1], 10) - 1);
        return;
      }
    }
    setCurrentYear(2026);
    setCurrentMonth(9);
  };

  const handleClear = () => {
    setActiveHint(null);
    if (onClearDates) {
      onClearDates();
    } else {
      onSelectDateRange('', '');
    }
  };

  const daysGrid = generateMonthGrid(
    currentYear,
    currentMonth,
    equipmentId,
    bookings,
    startDate,
    endDate
  );

  // Compute selected duration in days
  const totalDays = useMemo(() => {
    if (!startDate) return 0;
    const finalEnd = endDate || startDate;
    const startD = new Date(startDate);
    const endD = new Date(finalEnd);
    const diffTime = Math.abs(endD.getTime() - startD.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : 1;
  }, [startDate, endDate]);

  // Check if current selection has any conflict
  const conflict = useMemo(() => {
    if (!startDate) return null;
    return findConflictingBooking(
      equipmentId,
      startDate,
      endDate || startDate,
      bookings
    );
  }, [equipmentId, startDate, endDate, bookings]);

  // Intelligent day click handler
  const handleDayClick = (
    dateStr: string,
    isBooked: boolean,
    isPast: boolean
  ) => {
    // CRITICAL: Clicking a booked date does NOT select it!
    // Protects the user's booking from being corrupted with an unavailable date.
    if (isBooked) {
      const msg = 'This equipment is not available on the selected date. Please choose another date.';
      setActiveHint(msg);
      if (onUnavailableDateSelected) {
        onUnavailableDateSelected(dateStr, msg);
      }
      return;
    }

    if (isPast) {
      const msg = 'Cannot select dates in the past. Please select an upcoming date.';
      setActiveHint(msg);
      if (onUnavailableDateSelected) {
        onUnavailableDateSelected(dateStr, msg);
      }
      return;
    }

    // User clicked an available date:
    // If no start date, or user previously finished a range (startDate !== endDate), start fresh
    if (!startDate || (startDate && endDate && startDate !== endDate)) {
      onSelectDateRange(dateStr, dateStr);
      setActiveHint(`Start date set to ${formatDateDisplay(dateStr)}. Tap an end date to extend, or proceed with 1-day rental.`);
    } else if (startDate && (!endDate || startDate === endDate)) {
      // User is picking the end date
      if (dateStr < startDate) {
        // If clicked date is before start date, make this the new start date
        onSelectDateRange(dateStr, dateStr);
        setActiveHint(`Start date set to ${formatDateDisplay(dateStr)}.`);
      } else if (dateStr === startDate) {
        // Clicked same date again -> keeps 1-day rental
        onSelectDateRange(dateStr, dateStr);
        setActiveHint(`1-day rental on ${formatDateDisplay(dateStr)}.`);
      } else {
        // Check if any date in the selected range is booked
        const rangeConflict = findConflictingBooking(
          equipmentId,
          startDate,
          dateStr,
          bookings
        );

        if (rangeConflict) {
          // Range hits a booked date: protect user by clamping to the day before the conflict if possible
          const conflictStart = rangeConflict.startDate;
          const dayBefore = addDaysISO(conflictStart, -1);

          if (dayBefore >= startDate) {
            onSelectDateRange(startDate, dayBefore);
            const msg = `⚠️ Range includes booked date (${formatDateDisplay(conflictStart)}). Set to available days: ${formatDateDisplay(startDate)} to ${formatDateDisplay(dayBefore)}.`;
            setActiveHint(msg);
            if (onUnavailableDateSelected) {
              onUnavailableDateSelected(dateStr, msg);
            }
          } else {
            const msg = 'This equipment is not available on the selected date. Please choose another date.';
            setActiveHint(msg);
            if (onUnavailableDateSelected) {
              onUnavailableDateSelected(dateStr, msg);
            }
          }
          return;
        }

        // Clean range with no conflicts
        onSelectDateRange(startDate, dateStr);
        setActiveHint(null);
      }
    }
  };

  // Quick preset duration buttons (1 Day, 2 Days, 3 Days, 1 Week)
  const applyPresetDuration = (days: number) => {
    const baseStart = startDate || '2026-10-12';
    const targetEnd = addDaysISO(baseStart, days - 1);

    // Verify if target range has conflict
    const rangeConflict = findConflictingBooking(
      equipmentId,
      baseStart,
      targetEnd,
      bookings
    );

    if (rangeConflict) {
      const msg = 'This equipment is not available on the selected date. Please choose another date.';
      setActiveHint(msg);
      if (onUnavailableDateSelected) {
        onUnavailableDateSelected(baseStart, msg);
      }
      return;
    }

    onSelectDateRange(baseStart, targetEnd);
    setActiveHint(null);
  };

  const isDifferentFromActiveMonth =
    currentYear !== 2026 || currentMonth !== 9;

  return (
    <div className="svem-calendar-widget" aria-label="Interactive Equipment Availability Calendar">
      {/* Quick Duration Presets for Instant Selection */}
      <div className="svem-cal-presets-bar">
        <span className="svem-cal-presets-label">
          <Clock size={13} /> Quick Presets:
        </span>
        <div className="svem-cal-presets-chips">
          <button
            type="button"
            className={`svem-preset-chip ${totalDays === 1 ? 'svem-preset-chip-active' : ''}`}
            onClick={() => applyPresetDuration(1)}
          >
            1 Day
          </button>
          <button
            type="button"
            className={`svem-preset-chip ${totalDays === 2 ? 'svem-preset-chip-active' : ''}`}
            onClick={() => applyPresetDuration(2)}
          >
            2 Days
          </button>
          <button
            type="button"
            className={`svem-preset-chip ${totalDays === 3 ? 'svem-preset-chip-active' : ''}`}
            onClick={() => applyPresetDuration(3)}
          >
            3 Days
          </button>
          <button
            type="button"
            className={`svem-preset-chip ${totalDays === 7 ? 'svem-preset-chip-active' : ''}`}
            onClick={() => applyPresetDuration(7)}
          >
            1 Week
          </button>
        </div>
      </div>

      {/* Enhanced Date Range Status Pill */}
      <div className="svem-cal-status-pill">
        <div className="svem-cal-status-content">
          <CalendarIcon size={16} className="svem-cal-status-icon" />
          {startDate ? (
            <span className="svem-cal-status-text">
              <strong>{formatDateDisplay(startDate)}</strong>
              {endDate && endDate !== startDate ? (
                <>
                  {' '}
                  to <strong>{formatDateDisplay(endDate)}</strong> ({totalDays}{' '}
                  days)
                </>
              ) : (
                ' (1-day rental)'
              )}
            </span>
          ) : (
            <span className="svem-cal-status-placeholder">
              Tap a date below to choose start date
            </span>
          )}
        </div>

        {startDate && (
          <button
            type="button"
            onClick={handleClear}
            className="svem-cal-clear-btn"
            title="Reset selected dates"
            aria-label="Reset selected dates"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Calendar Header with Navigation */}
      <div className="svem-cal-header">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="svem-cal-nav-btn"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="svem-cal-title-wrap">
          <span className="svem-cal-title">
            {monthNames[currentMonth]} {currentYear}
          </span>
          {isDifferentFromActiveMonth && (
            <button
              type="button"
              onClick={handleJumpToActiveMonth}
              className="svem-cal-jump-btn"
              title="Return to October 2026"
            >
              Current
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="svem-cal-nav-btn"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday Names Header */}
      <div className="svem-cal-weekdays">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="svem-cal-weekday">
            {day}
          </div>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="svem-cal-grid" role="grid">
        {daysGrid.map((day, idx) => {
          let dayClass = 'svem-cal-day';
          if (!day.isCurrentMonth) dayClass += ' svem-cal-day-other-month';
          if (day.isPast) dayClass += ' svem-cal-day-past';
          if (day.isBooked) dayClass += ' svem-cal-day-booked';
          if (day.isSelected) dayClass += ' svem-cal-day-selected';
          if (day.isRangeStart) dayClass += ' svem-cal-day-range-start';
          if (day.isRangeEnd) dayClass += ' svem-cal-day-range-end';
          if (day.isInRange && !day.isRangeStart && !day.isRangeEnd) {
            dayClass += ' svem-cal-day-in-range';
          }

          return (
            <button
              key={`${day.dateString}-${idx}`}
              type="button"
              className={dayClass}
              onClick={() =>
                handleDayClick(day.dateString, day.isBooked, day.isPast)
              }
              title={
                day.isBooked
                  ? `Already Booked for ${equipmentName}`
                  : day.isSelected
                  ? 'Selected rental date'
                  : 'Available for rental'
              }
              aria-label={`${day.dateString} ${
                day.isBooked ? 'Booked' : 'Available'
              }`}
            >
              <span className="svem-cal-day-num">{day.dayNumber}</span>
              {day.isBooked && (
                <span className="svem-cal-dot-booked" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      {/* Interactive Helper / Toast Hint */}
      {activeHint && (
        <div className="svem-cal-hint-box" role="status">
          <AlertCircle size={14} className="svem-cal-hint-icon" />
          <span>{activeHint}</span>
        </div>
      )}

      {/* Live Availability Feedback Banner */}
      {startDate && !activeHint && (
        <div
          className={`svem-cal-avail-alert ${
            conflict ? 'svem-cal-avail-conflict' : 'svem-cal-avail-success'
          }`}
          role="status"
        >
          {conflict ? (
            <>
              <AlertCircle size={15} className="svem-cal-alert-icon" />
              <span>
                <strong>Booked:</strong> Date overlaps with existing booking.
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 size={15} className="svem-cal-alert-icon" />
              <span>
                <strong>Available:</strong> Ready for booking ({formatDateDisplay(startDate)}
                {endDate && endDate !== startDate ? ` to ${formatDateDisplay(endDate)}` : ''})!
              </span>
            </>
          )}
        </div>
      )}

      {/* Calendar Legend */}
      <div className="svem-cal-legend">
        <div className="svem-legend-item">
          <span className="svem-legend-box svem-legend-box-available" />
          <span>Available</span>
        </div>
        <div className="svem-legend-item">
          <span className="svem-legend-box svem-legend-box-booked" />
          <span>Booked</span>
        </div>
        <div className="svem-legend-item">
          <span className="svem-legend-box svem-legend-box-selected" />
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};
