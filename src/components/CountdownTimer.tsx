import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate: Date;
  label: string;
  className?: string;
}

function calculateTimeRemaining(targetDate: Date) {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isOverdue: false };
}

function pad(num: number): string {
  return num.toString().padStart(2, "0");
}

export function CountdownTimer({ targetDate, label, className }: CountdownTimerProps) {
  const [time, setTime] = useState(() => calculateTimeRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const isUrgent = time.days < 7 && !time.isOverdue;
  const isOverdue = time.isOverdue;

  return (
    <div
      className={cn(
        "relative p-6 rounded-lg border bg-card",
        isOverdue && "border-neon-red/50",
        isUrgent && !isOverdue && "border-neon-orange/50",
        !isUrgent && !isOverdue && "border-border",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        {isOverdue ? (
          <AlertTriangle className="w-4 h-4 text-neon-red" />
        ) : (
          <Clock className="w-4 h-4 text-muted-foreground" />
        )}
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </span>
      </div>

      <div className="flex items-baseline gap-1 font-mono">
        <div className="flex items-center">
          <span
            className={cn(
              "text-4xl font-bold tabular-nums",
              isOverdue && "text-neon-red text-glow-red",
              isUrgent && !isOverdue && "text-neon-orange text-glow-orange",
              !isUrgent && !isOverdue && "text-foreground"
            )}
          >
            {isOverdue ? "00" : pad(time.days)}
          </span>
          <span className="text-lg text-muted-foreground ml-1">d</span>
        </div>
        <span className="text-2xl text-muted-foreground mx-1">:</span>
        <div className="flex items-center">
          <span
            className={cn(
              "text-4xl font-bold tabular-nums",
              isOverdue && "text-neon-red text-glow-red",
              isUrgent && !isOverdue && "text-neon-orange text-glow-orange",
              !isUrgent && !isOverdue && "text-foreground"
            )}
          >
            {isOverdue ? "00" : pad(time.hours)}
          </span>
          <span className="text-lg text-muted-foreground ml-1">h</span>
        </div>
        <span className="text-2xl text-muted-foreground mx-1">:</span>
        <div className="flex items-center">
          <span
            className={cn(
              "text-4xl font-bold tabular-nums",
              isOverdue && "text-neon-red text-glow-red",
              isUrgent && !isOverdue && "text-neon-orange text-glow-orange",
              !isUrgent && !isOverdue && "text-foreground"
            )}
          >
            {isOverdue ? "00" : pad(time.minutes)}
          </span>
          <span className="text-lg text-muted-foreground ml-1">m</span>
        </div>
        <span className="text-2xl text-muted-foreground mx-1 hidden sm:inline">:</span>
        <div className="hidden sm:flex items-center">
          <span
            className={cn(
              "text-4xl font-bold tabular-nums",
              isOverdue && "text-neon-red text-glow-red",
              isUrgent && !isOverdue && "text-neon-orange text-glow-orange",
              !isUrgent && !isOverdue && "text-foreground"
            )}
          >
            {isOverdue ? "00" : pad(time.seconds)}
          </span>
          <span className="text-lg text-muted-foreground ml-1">s</span>
        </div>
      </div>

      {isOverdue && (
        <p className="text-xs font-mono text-neon-red mt-3">
          DEADLINE EXCEEDED — IMMEDIATE ACTION REQUIRED
        </p>
      )}
    </div>
  );
}
