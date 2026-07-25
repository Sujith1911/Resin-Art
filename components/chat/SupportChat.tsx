"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getOrderChatMessages, sendChatMessage, DbChatMessage } from "@/lib/supabase/db";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { MessageSquare, Send, X, Shield, User, Bot, Loader2 } from "lucide-react";

interface SupportChatProps {
  orderId?: string;
  orderNumber?: string;
  currentUserId?: string;
  currentUserName: string;
  currentUserRole?: "Customer" | "Admin" | "Support Agent";
  isOpen?: boolean;
  onClose?: () => void;
}

export function SupportChat({
  orderId,
  orderNumber,
  currentUserId,
  currentUserName,
  currentUserRole = "Customer",
  isOpen = false,
  onClose,
}: SupportChatProps) {
  const [messages, setMessages] = useState<DbChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch initial messages & subscribe to Supabase Realtime
  useEffect(() => {
    if (!orderId) return;

    const supabase = createClient();

    // 1. Fetch initial chat history
    getOrderChatMessages(orderId).then((msgs) => {
      setMessages(msgs);
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    });

    // 2. Subscribe to realtime inserts
    const channel = supabase
      .channel(`chat_${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          const newMsg = payload.new as DbChatMessage;
          setMessages((prev) => [...prev, newMsg]);
          setTimeout(scrollToBottom, 50);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const text = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      await sendChatMessage({
        order_id: orderId,
        sender_id: currentUserId || undefined,
        sender_name: currentUserName,
        sender_role: currentUserRole,
        message: text,
      });
    } catch (err) {
      console.error("Failed to send chat message:", err);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <GlassCard glow="gold" className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 h-[480px] flex flex-col shadow-2xl overflow-hidden border border-amber-400/30">
      {/* Chat Header */}
      <div className="p-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <div>
            <h4 className="font-serif font-bold text-sm leading-tight">AURELIA Live Concierge</h4>
            {orderNumber && <p className="text-[11px] opacity-90 font-mono">Order #{orderNumber}</p>}
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20">
            <X className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-background/50 text-sm">
        {loading ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
            <Bot className="w-10 h-10 text-amber-500/40 mb-2" />
            <p className="font-bold text-foreground">Have questions about your order?</p>
            <p className="text-xs mt-1">Send a message below. Our Atelier team replies in real-time!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_name === currentUserName;
            const isAdmin = msg.sender_role === "Admin" || msg.sender_role === "Support Agent";

            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-1 mb-1 text-[10px] text-muted-foreground font-semibold">
                  {isAdmin ? <Shield className="w-3 h-3 text-amber-500" /> : <User className="w-3 h-3" />}
                  <span>{msg.sender_name}</span>
                  {isAdmin && <span className="px-1.5 py-0.2 rounded bg-amber-500 text-white font-bold">{msg.sender_role}</span>}
                </div>
                <div
                  className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? "bg-amber-500 text-white rounded-br-none shadow-sm"
                      : isAdmin
                      ? "bg-amber-500/10 border border-amber-400/30 text-foreground rounded-bl-none"
                      : "glass-panel text-foreground rounded-bl-none"
                  }`}
                >
                  {msg.message}
                </div>
                <span className="text-[9px] text-muted-foreground mt-0.5">
                  {new Date(msg.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 border-t border-border/20 bg-background flex items-center gap-2">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-background border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <Button variant="gold" size="sm" type="submit" disabled={sending || !inputText.trim()} className="px-3">
          {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
        </Button>
      </form>
    </GlassCard>
  );
}
