import { useState } from "react";
import { Bot, Loader2, Send, Sparkles, User2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

interface VaidyaAssistBotProps {
  contextLabel?: string;
}

export default function VaidyaAssistBot({
  contextLabel = "Active Consultation",
}: VaidyaAssistBotProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Namaste. I am Vaidya Assist. Ask about dosha balance, herbs, interactions, or treatment support while you consult.",
    },
  ]);

  const ragApiUrl = "/api/appointments/vaidya-assist";

  const sendMessage = async () => {
    const query = input.trim();
    if (!query || isTyping) return;

    setMessages((previous) => [...previous, { role: "user", content: query }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(ragApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`RAG service returned ${response.status}`);
      }

      const data = await response.json();
      const payload = data?.data || data;
      const answer =
        payload?.answer ||
        payload?.response ||
        payload?.text ||
        payload?.message ||
        "I could not generate a response right now.";

      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: String(answer) },
      ]);
    } catch (_error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "I am currently unavailable. Please retry in a moment while the RAG service reconnects.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          className="fixed right-4 top-1/2 z-40 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-700 to-[#1F5C3F] px-4 py-2 text-white shadow-lg hover:from-emerald-800 hover:to-[#1A4F36]"
        >
          <Sparkles className="h-4 w-4" />
          Vaidya Assist
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[420px] max-w-[95vw] border-l border-emerald-100 bg-gradient-to-b from-emerald-50 via-white to-[#f8fcf9] p-0"
      >
        <SheetHeader className="border-b border-emerald-100 bg-white/80 px-5 py-4 backdrop-blur">
          <SheetTitle className="flex items-center gap-2 text-[#184734]">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
              <Sparkles className="h-4 w-4" />
            </span>
            Vaidya Assist
          </SheetTitle>
          <p className="text-xs text-emerald-700/80">{contextLabel}</p>
        </SheetHeader>

        <div className="flex h-[calc(100vh-88px)] flex-col">
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-3 pb-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                      message.role === "user"
                        ? "bg-[#1F5C3F] text-white"
                        : "border border-emerald-100 bg-white text-slate-700"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] opacity-80">
                      {message.role === "assistant" ? (
                        <Bot className="h-3 w-3" />
                      ) : (
                        <User2 className="h-3 w-3" />
                      )}
                      {message.role === "assistant" ? "Vaidya Assist" : "Doctor"}
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-700" />
                      Vaidya Assist is thinking...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-emerald-100 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask for Ayurvedic guidance..."
                className="border-emerald-200 focus-visible:ring-emerald-500"
              />
              <Button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="bg-[#1F5C3F] text-white hover:bg-[#184734]"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
