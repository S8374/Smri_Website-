import React, { useEffect, useState } from "react";

export default function FlashSellTime() {
  // Set the flash sale end time (change this date as needed)
  const flashSaleEndDate = new Date("2025-06-30T23:59:59").getTime();

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = flashSaleEndDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div className="flex flex-col" key={unit}>
          <span className="countdown font-mono text-5xl">
            <span
              style={{ "--value": value }}  // ✅ Removed TypeScript casting
              aria-live="polite"
              aria-label={unit}
            >
              {value}
            </span>
          </span>
          {unit}
        </div>
      ))}
    </div>
  );
}
