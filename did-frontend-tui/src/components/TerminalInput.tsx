import { useState, KeyboardEvent, useRef, useEffect } from "react";

interface TerminalInputProps {
  onCommand: (command: string) => void;
  prompt?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function TerminalInput({
  onCommand,
  prompt = ">",
  disabled = false,
  placeholder = "Enter command...",
}: TerminalInputProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      onCommand(input.trim());
      setHistory((prev) => [...prev, input.trim()]);
      setInput("");
      setHistoryIndex(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex =
          historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div className="flex items-center gap-2 border-t border-green-500/30 pt-4 mt-4">
      <span className="text-green-400 font-bold text-lg">{prompt}</span>
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none text-green-400 font-mono text-lg placeholder:text-green-700/80 disabled:opacity-50"
          autoComplete="off"
          spellCheck="false"
        />
        <span className="absolute right-10 top-0 text-green-400 animate-pulse">
          ▮
        </span>
      </div>
    </div>
  );
}
