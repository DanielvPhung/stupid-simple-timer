import { useEffect, useRef, useState } from "react";
import { playBeep, vibrateOnce } from "../../utils";
import { formatTime } from "../../utils";
import "./card.css";

type CardProps = {
  index: number;
  baseSeconds: number;
  curIndex: number | null;
  handleShortPress: (index: number) => void;
  handleLongPress: (index: number) => void;
  handleCountdownComplete: () => void;
};

export const Card = ({
  index,
  baseSeconds,
  curIndex,
  handleShortPress,
  handleLongPress,
  handleCountdownComplete
}: CardProps) => {
  const [time, setTime] = useState<number>(baseSeconds);

  const countdownIntervalRef = useRef<number | null>(null);
  const longPressTimeoutRef = useRef<number | null>(null);
  const firedRef = useRef(false);

  const isRunning = countdownIntervalRef.current !== null;
  const isActive = curIndex === index;

  // If the saved timer changes, reflect it *when not running*
  useEffect(() => {
    if (!isRunning) setTime(baseSeconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseSeconds]);

  const clearLongPress = () => {
    if (longPressTimeoutRef.current !== null) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  const stopCountdown = () => {
    if (countdownIntervalRef.current !== null) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const cancelCountdown = () => {
    stopCountdown();
    setTime(baseSeconds);
    handleCountdownComplete();
  };

  const startCountdown = () => {
    stopCountdown();

    countdownIntervalRef.current = window.setInterval(() => {
      setTime((t) => {
        if (t <= 0) {
          stopCountdown();
          playBeep();
          vibrateOnce(1000);
          handleCountdownComplete();
          return baseSeconds;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handlePressStart = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    firedRef.current = false;
    clearLongPress();

    if (isActive && isRunning) return;
    longPressTimeoutRef.current = window.setTimeout(() => {
      firedRef.current = true;
      handleLongPress(index);
      clearLongPress();
    }, 200);
  };

  const handlePressEnd = () => {
    if (!firedRef.current) {
      if (isActive && isRunning) {
        cancelCountdown();
      } else {
        handleShortPress(index);
        startCountdown();
      }
    }
    clearLongPress();
  };

  return (
    <button
      className="card-button"
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerCancel={handlePressEnd}
      onContextMenu={(e) => e.preventDefault()}
      disabled={curIndex !== index && curIndex !== null}
    >
      <h2>{formatTime(time)}</h2>
    </button>
  );
};
