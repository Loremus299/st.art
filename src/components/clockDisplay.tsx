/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export function ClockDisplay() {
  const [time, setTime] = useState(new Date());
  const [format, setFormat] = useState(() => {
    let f = localStorage.getItem("clock-format");
    if (f == "" || !f) {
      localStorage.setItem("clock-format", "HH:mm:ss");
      f = "HH:mm:ss";
    }

    return f;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    setFormat(localStorage.getItem("clock-format")!);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="border rounded-md w-full min-h-20 h-full grid place-items-center bg-primary font-mono text-background text-3xl tracking-tighter">
      {dayjs(time).format(format)}
    </div>
  );
}
