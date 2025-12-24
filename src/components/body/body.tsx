import { useState } from "react";
import { Card } from "../cards/card";
import { Modal } from "../modal/modal";
import { useTimers } from "../../contexts/timersContext";
import "./body.css";

export const Body = () => {
  const { timers, setTimerAt } = useTimers();

  const [open, setOpen] = useState(false);
  const [curIndex, setCurIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [minutes, setMinutes] = useState<string>("0");
  const [seconds, setSeconds] = useState<string>("0");

  const handleShortPress = (index: number) => setCurIndex(index);

  const handleLongPress = (index: number) => {
    const total = timers[index] ?? 0;
    setMinutes(String(Math.floor(total / 60)));
    setSeconds(String(total % 60));
    setEditingIndex(index);
    setOpen(true);
  };

  const handleCountdownComplete = () => setCurIndex(null);

  const handleModalSave = () => {
    if (editingIndex === null) return;

    const m = Math.max(0, parseInt(minutes || "0", 10));
    const sRaw = parseInt(seconds || "0", 10);
    const s = Math.min(59, Math.max(0, isNaN(sRaw) ? 0 : sRaw));

    const totalSeconds = m * 60 + s;

    setTimerAt(editingIndex, totalSeconds);

    if (curIndex === editingIndex) setCurIndex(null);

    setOpen(false);
    setEditingIndex(null);
  };

  return (
    <div className="body">
      {timers.map((t, i) => (
        <Card
          key={i}
          index={i}
          baseSeconds={t}
          curIndex={curIndex}
          handleShortPress={handleShortPress}
          handleLongPress={handleLongPress}
          handleCountdownComplete={handleCountdownComplete}
        />
      ))}

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingIndex(null);
        }}
      >
        <div className="body-modal">
          <h2>Edit timer</h2>

          <div className="body-modal-time">
            <label className="time-field">
              <span>Minutes</span>
              <input
                type="number"
                min={0}
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
            </label>

            <label className="time-field">
              <span>Seconds</span>
              <input
                type="number"
                min={0}
                max={59}
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="body-modal-footer">
          <button
            className="modal-button secondary"
            onClick={() => {
              setOpen(false);
              setEditingIndex(null);
            }}
          >
            Cancel
          </button>
          <button className="modal-button primary" onClick={handleModalSave}>
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};
