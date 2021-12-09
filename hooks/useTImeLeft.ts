import { useEffect, useState } from "react";
import { interval, map, mapTo } from "rxjs";


export const useTimeLeft = (endTime: number) => {
  const [timeLeft, setTimeLeft] = useState<null | string>(null);

  useEffect(() => {
    const sub = interval(1000).pipe(
      map(() => endTime - (new Date()).getTime()),
      map((time) => {
        if (time < 0) {
          return null;
        }
        const d = new Date(time);
        const minutes = d.getMinutes();
        const seconds = d.getSeconds();
        return `${minutes}:${seconds < 10 ? '0' + seconds.toString() : seconds}`;
      })
    ).subscribe(setTimeLeft);

      return () => {
        sub.unsubscribe();
      }
  }, [endTime]);

  return timeLeft;
}
