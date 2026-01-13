import { useEffect, useRef } from 'react'
import { CountUp } from 'countup.js';

export default function CountUpDisplay({ value }: { value: number }) {
  const countupRef = useRef<any>(null);


  useEffect(() => {
    const countUp = new (CountUp as any)(countupRef.current, value, {
      duration: 3,
    });
    if (!countUp.error) {
      countUp.start();
    } else {
      console.error(countUp.error);
    }
  }, [value]);

  return (
    <span ref={countupRef}>0</span>
  )
}
