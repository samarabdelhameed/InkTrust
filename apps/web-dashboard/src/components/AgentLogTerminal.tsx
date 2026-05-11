"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "success";
  message: string;
  agent: string;
}

const sampleLogs: LogEntry[] = [
  { id: "1", timestamp: "10:32:14", level: "info", agent: "orchestrator", message: "New fax received — parsing inbound document..." },
  { id: "2", timestamp: "10:32:16", level: "info", agent: "ocr", message: "Running OCR on document #fax-20240511-003..." },
  { id: "3", timestamp: "10:32:19", level: "success", agent: "ocr", message: "OCR complete — extracted handwritten text (confidence 94.2%)" },
  { id: "4", timestamp: "10:32:22", level: "info", agent: "gemini-ai", message: "Analyzing intent: 'Please pay pharmacy bill of ¥4,200'" },
  { id: "5", timestamp: "10:32:25", level: "warn", agent: "risk-engine", message: "Risk assessment: MEDIUM (new merchant, amount within daily limit)" },
  { id: "6", timestamp: "10:32:28", level: "info", agent: "orchestrator", message: "Forwarding to family circle for approval..." },
  { id: "7", timestamp: "10:32:31", level: "info", agent: "blink-service", message: "Preparing Solana Action blink for caregiver approval..." },
  { id: "8", timestamp: "10:32:35", level: "success", agent: "orchestrator", message: "Awaiting caregiver signature — push notification sent" },
];

const levelColors = {
  info: "text-blue-400",
  warn: "text-amber-400",
  error: "text-red-400",
  success: "text-green-400",
};

const agentColors: Record<string, string> = {
  orchestrator: "text-purple-400",
  ocr: "text-cyan-400",
  "gemini-ai": "text-pink-400",
  "risk-engine": "text-amber-400",
  "blink-service": "text-blue-400",
};

export function AgentLogTerminal({ live = true }: { live?: boolean }) {
  const [logs, setLogs] = useState<LogEntry[]>(live ? [] : sampleLogs);
  const [isStreaming, setIsStreaming] = useState(live);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!live) return;
    let i = 0;
    setIsStreaming(true);
    const interval = setInterval(() => {
      if (i < sampleLogs.length) {
        setLogs(prev => [...prev, sampleLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [live]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="bg-[rgb(15_22_50)] rounded-xl border border-[rgb(255_255_255_/_0.06)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgb(255_255_255_/_0.06)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <span className="text-xs font-medium text-white/40 ml-2">agent-terminal</span>
        </div>
        {isStreaming && (
          <span className="flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live
          </span>
        )}
      </div>

      <div className="p-3 font-mono text-xs leading-relaxed max-h-[300px] overflow-y-auto">
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="py-0.5"
            >
              <span className="text-white/30">[{log.timestamp}]</span>{" "}
              <span className={agentColors[log.agent] || "text-white/50"}>
                &lt;{log.agent}&gt;
              </span>{" "}
              <span className={levelColors[log.level]}>{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {isStreaming && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-white/50"
          >
            _
          </motion.span>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
