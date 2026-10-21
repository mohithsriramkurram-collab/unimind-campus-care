import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send } from "lucide-react";
import { chatWithCompanion } from "@/lib/server-fns";

const GREETING =
  "Hi, I'm Sage 💚 I'm here to listen and help you through whatever's on your mind — stress, exams, loneliness, anything. How are you doing today?";

export function CompanionChat() {
  const [messages, setMessages] = useState([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const chat = useServerFn(chatWithCompanion);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = async () => {
    const text = input.trim();
    if (!text || thinking) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setThinking(true);
    try {
      const { reply } = await chat({ data: { messages: next } });
      setMessages((m) => [...m, { role: "assistant", content: reply || "I'm here for you. Tell me more." }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I had trouble responding just now. Could you try again?" },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-13rem)] flex-col lg:h-[calc(100vh-16rem)]">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">Sage</h2>
          <p className="text-xs text-muted-foreground">Your supportive companion · not a substitute for a therapist</p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-border/70 bg-card/50 p-4 sm:p-6"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[75%] ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-secondary-foreground rounded-bl-md"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-end gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Share what's on your mind…"
          className="min-h-[52px] max-h-40 resize-none"
          maxLength={2000}
        />
        <Button onClick={send} disabled={thinking || !input.trim()} size="icon" className="h-11 w-11 shrink-0 rounded-xl">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}