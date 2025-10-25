import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

export interface TerminalLine {
  id: string;
  text: string;
  type: "output" | "input" | "error" | "success" | "system";
  timestamp: number;
}

interface TerminalProps {
  lines: TerminalLine[];
  onCommand: (command: string) => void;
  prompt?: string;
  isProcessing?: boolean;
  shake?: boolean;
  flash?: string;
}

export default function Terminal({
  lines,
  onCommand,
  prompt = ">",
  isProcessing = false,
  shake = false,
  flash,
}: TerminalProps) {
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setCommandHistory((prev) => [...prev, input]);
    setHistoryIndex(-1);
    onCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
  };

  return (
    <div
      className={cn(
        "h-screen w-full bg-black text-green-400 font-mono flex flex-col transition-all duration-100",
        shake && "animate-shake",
        flash && "animate-flash"
      )}
      style={{
        backgroundColor: flash || "#000000",
      }}
    >
      <div className="border-b border-green-900 px-4 py-2 bg-green-950/20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-sm text-green-500/70">
            TERMINAL v1.0.0
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-1">
          {lines.map((line) => (
            <TerminalLineComponent key={line.id} line={line} />
          ))}
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSubmit}
        className="border-t border-green-900 px-4 py-3 bg-green-950/10"
      >
        <div className="flex items-center gap-2">
          <span className="text-green-500 font-bold">{prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="flex-1 bg-transparent outline-none text-green-400 placeholder-green-700 disabled:opacity-50"
            placeholder={isProcessing ? "Processing..." : "Enter command..."}
            autoComplete="off"
            spellCheck={false}
          />
          {isProcessing && (
            <span className="text-green-600 animate-pulse">▊</span>
          )}
        </div>
      </form>
    </div>
  );
}

function TerminalLineComponent({ line }: { line: TerminalLine }) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (line.type === "input") {
      setDisplayText(line.text);
      setIsTyping(false);
      return;
    }

    let currentIndex = 0;
    const typingSpeed = line.type === "system" ? 10 : 20;

    const interval = setInterval(() => {
      if (currentIndex <= line.text.length) {
        setDisplayText(line.text.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [line]);

  const getLineColor = () => {
    switch (line.type) {
      case "error":
        return "text-red-400";
      case "success":
        return "text-green-300";
      case "system":
        return "text-cyan-400";
      case "input":
        return "text-yellow-300";
      default:
        return "text-green-400";
    }
  };

  return (
    <div className={cn("whitespace-pre-wrap break-words", getLineColor())}>
      {line.type === "input" && (
        <span className="text-green-500 font-bold mr-2">&gt;</span>
      )}
      {displayText}
      {isTyping && <span className="animate-pulse">▊</span>}
    </div>
  );
}
