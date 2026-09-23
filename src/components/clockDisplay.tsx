import { useEffect, useState } from "react";

export function ClockDisplay() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="border rounded-md w-full min-h-20 h-full grid place-items-center bg-primary font-mono text-background text-3xl tracking-tighter">
      {`${time.getHours().toLocaleString().padStart(2, "0")}:${time.getMinutes().toLocaleString().padStart(2, "0")}:${time.getSeconds().toLocaleString().padStart(2, "0")}`}
    </div>
  );
}
