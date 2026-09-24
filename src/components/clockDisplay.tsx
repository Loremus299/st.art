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
      setFormat(localStorage.getItem("clock-format")!);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="border backdrop-blur-md rounded-md w-full min-h-20 h-full grid place-items-center bg font-mono text-background text-3xl tracking-tighter">
      {dayjs(time).format(format)}
    </div>
  );
}
