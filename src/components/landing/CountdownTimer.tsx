import { useEffect, useState } from "react";

const getTargetDate = () => {
  const key = "promo_countdown_target";
  const stored = localStorage.getItem(key);
  if (stored) {
    const date = new Date(stored);
    if (date.getTime() > Date.now()) return date;
  }
  // Set 48h from now
  const target = new Date(Date.now() + 48 * 60 * 60 * 1000);
  localStorage.setItem(key, target.toISOString());
  return target;
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = getTargetDate();
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
      <span className="text-primary-foreground/60">⏰ Oferta expira em:</span>
      <span className="bg-accent/20 text-accent px-2 py-0.5 rounded font-mono">
        {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
      </span>
    </div>
  );
};

export default CountdownTimer;
