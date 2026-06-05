import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export type DatePickerMode = "single" | "month" | "range";

export interface DatePickerProps {
  mode: DatePickerMode;
  /** single: "YYYY-MM-DD" | month: "YYYY-MM" */
  value?: string;
  onChange?: (value: string) => void;
  /** range mode: both "YYYY-MM" */
  from?: string;
  to?: string;
  onRangeChange?: (from: string, to: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Align the popover to the right edge of the trigger */
  align?: "left" | "right";
  className?: string;
}

function parseDateStr(str: string): Date | null {
  if (!str) return null;
  const parts = str.split("-").map(Number);
  if (parts.length === 3 && parts[0] && parts[1] && parts[2])
    return new Date(parts[0], parts[1] - 1, parts[2]);
  if (parts.length === 2 && parts[0] && parts[1])
    return new Date(parts[0], parts[1] - 1, 1);
  return null;
}

function toMonthStr(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function displaySingle(value: string): string {
  const d = parseDateStr(value);
  if (!d) return "";
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

function displayMonth(value: string): string {
  const d = parseDateStr(value);
  if (!d) return "";
  return `${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export const DatePicker: React.FC<DatePickerProps> = ({
  mode,
  value = "",
  onChange,
  from = "",
  to = "",
  onRangeChange,
  label,
  placeholder,
  disabled = false,
  align = "left",
  className = "",
}) => {
  const todayDate = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(todayDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(todayDate.getMonth());
  const [hoverMonth, setHoverMonth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = mode === "range" ? from : value;
    const d = parseDateStr(target);
    if (d) {
      setViewYear(d.getFullYear());
      if (mode === "single") setViewMonth(d.getMonth());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHoverMonth(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const rangeFrom = parseDateStr(from);
  const rangeTo = parseDateStr(to);
  const rangeStage: "from" | "to" = mode === "range" && from && !to ? "to" : "from";

  const displayValue = (): string => {
    if (mode === "single") return displaySingle(value);
    if (mode === "month") return displayMonth(value);
    if (mode === "range") {
      const f = from ? displayMonth(from) : "";
      const t = to ? displayMonth(to) : "";
      if (f && t) return `${f} → ${t}`;
      if (f) return `From ${f}`;
      return "";
    }
    return "";
  };

  const hasValue = mode === "range" ? !!from || !!to : !!value;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mode !== "range") onChange?.("");
    else onRangeChange?.("", "");
  };

  const handleDayClick = (day: number) => {
    onChange?.(toDateStr(viewYear, viewMonth, day));
    setOpen(false);
  };

  const handleMonthCellClick = (monthIdx: number) => {
    if (mode === "month") {
      onChange?.(toMonthStr(viewYear, monthIdx));
      setOpen(false);
      return;
    }
    if (mode === "range") {
      const clickedDate = new Date(viewYear, monthIdx, 1);
      if (rangeStage === "from") {
        onRangeChange?.(toMonthStr(viewYear, monthIdx), "");
      } else {
        if (rangeFrom && clickedDate < rangeFrom) {
          onRangeChange?.(toMonthStr(viewYear, monthIdx), from);
        } else {
          onRangeChange?.(from, toMonthStr(viewYear, monthIdx));
        }
        setOpen(false);
        setHoverMonth(null);
      }
    }
  };

  const getMonthHighlight = (monthIdx: number): "endpoint" | "inRange" | null => {
    if (mode === "month") {
      const d = parseDateStr(value);
      if (d && d.getFullYear() === viewYear && d.getMonth() === monthIdx) return "endpoint";
      return null;
    }
    if (mode === "range") {
      const cellDate = new Date(viewYear, monthIdx, 1);
      if (rangeFrom && cellDate.getTime() === rangeFrom.getTime()) return "endpoint";
      if (rangeTo && cellDate.getTime() === rangeTo.getTime()) return "endpoint";

      let effectiveEnd = rangeTo;
      if (!effectiveEnd && rangeStage === "to" && hoverMonth !== null) {
        effectiveEnd = new Date(viewYear, hoverMonth, 1);
      }
      if (rangeFrom && effectiveEnd) {
        const start = rangeFrom <= effectiveEnd ? rangeFrom : effectiveEnd;
        const end = rangeFrom <= effectiveEnd ? effectiveEnd : rangeFrom;
        if (cellDate > start && cellDate < end) return "inRange";
      }
    }
    return null;
  };

  const isDaySelected = (day: number) => {
    const d = parseDateStr(value);
    return !!d && d.getFullYear() === viewYear && d.getMonth() === viewMonth && d.getDate() === day;
  };

  const isDayToday = (day: number) => {
    return (
      todayDate.getFullYear() === viewYear &&
      todayDate.getMonth() === viewMonth &&
      todayDate.getDate() === day
    );
  };

  const renderCalendar = () => {
    const totalDays = daysInMonth(viewYear, viewMonth);
    const startDay = firstDayOfMonth(viewYear, viewMonth);
    const cells: React.ReactNode[] = [];

    for (let i = 0; i < startDay; i++) cells.push(<div key={`e${i}`} />);
    for (let d = 1; d <= totalDays; d++) {
      const selected = isDaySelected(d);
      const isToday = isDayToday(d);
      cells.push(
        <button
          key={d}
          type="button"
          onClick={() => handleDayClick(d)}
          className={[
            "h-8 w-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
            selected
              ? "bg-primary text-white shadow-sm"
              : isToday
                ? "border border-primary/40 text-primary font-semibold"
                : "text-gray-700 hover:bg-primary/10 hover:text-primary",
          ].join(" ")}
        >
          {d}
        </button>
      );
    }

    return (
      <div className="w-64">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => {
              if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
              else setViewMonth((m) => m - 1);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-sm font-semibold text-gray-800">
            {MONTHS_LONG[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={() => {
              if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
              else setViewMonth((m) => m + 1);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="h-7 flex items-center justify-center text-xs font-semibold text-gray-400">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">{cells}</div>
      </div>
    );
  };

  const renderMonthGrid = () => (
    <div className="w-52">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setViewYear((y) => y - 1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="text-sm font-semibold text-gray-800">{viewYear}</span>
        <button
          type="button"
          onClick={() => setViewYear((y) => y + 1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {MONTHS_SHORT.map((m, idx) => {
          const highlight = getMonthHighlight(idx);
          return (
            <button
              key={m}
              type="button"
              onClick={() => handleMonthCellClick(idx)}
              onMouseEnter={() => {
                if (mode === "range" && rangeStage === "to") setHoverMonth(idx);
              }}
              onMouseLeave={() => setHoverMonth(null)}
              className={[
                "h-9 rounded-xl text-sm font-medium transition-colors",
                highlight === "endpoint"
                  ? "bg-primary text-white shadow-sm"
                  : highlight === "inRange"
                    ? "bg-primary/15 text-primary"
                    : "text-gray-700 hover:bg-primary/10 hover:text-primary",
              ].join(" ")}
            >
              {m}
            </button>
          );
        })}
      </div>
      {mode === "range" && (
        <p className="mt-2.5 text-center text-xs text-gray-400">
          {rangeStage === "from" ? "Select start month" : "Select end month"}
        </p>
      )}
    </div>
  );

  const inputDisplay = displayValue();

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className={[
          "w-full flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm text-left transition-all",
          disabled
            ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
            : open
              ? "bg-white border-primary/50 ring-2 ring-primary/10 text-gray-800"
              : "bg-white border-gray-200 text-gray-700 hover:border-gray-300",
        ].join(" ")}
      >
        <Calendar size={14} className={`shrink-0 ${disabled ? "text-gray-300" : "text-gray-400"}`} />
        <span className={`flex-1 truncate ${!inputDisplay ? "text-gray-400" : ""}`}>
          {inputDisplay ||
            placeholder ||
            (mode === "single"
              ? "Select date"
              : mode === "month"
                ? "Select month"
                : "Select range")}
        </span>
        {hasValue && !disabled && (
          <X
            size={13}
            className="shrink-0 text-gray-400 hover:text-gray-700 transition-colors"
            onClick={handleClear}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className={[
              "absolute z-50 mt-1.5 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl",
              align === "right" ? "right-0" : "left-0",
            ].join(" ")}
          >
            {mode === "single" ? renderCalendar() : renderMonthGrid()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;
