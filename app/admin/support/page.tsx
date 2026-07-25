"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Ticket, MessageSquare, CheckCircle2, Clock, AlertTriangle, Send, X, StickyNote } from "lucide-react";

type TicketStatus = "Open" | "Assigned" | "In Progress" | "Waiting" | "Resolved" | "Closed";

interface SupportTicket {
  id: string; customer: string; subject: string; priority: "HIGH" | "MEDIUM" | "LOW"; status: TicketStatus; lastUpdated: string; message: string; replies: string[]; internalNotes: string[];
}

export default function AdminSupportPage() {
  const [filter, setFilter] = useState("All");
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: "TICK-904", customer: "Priya Sharma", subject: "Bouquet Preservation Inquiry", priority: "HIGH", status: "Open", lastUpdated: "10 mins ago", message: "Can I send fresh roses from Bangalore via speed post for preservation?", replies: [], internalNotes: [] },
    { id: "TICK-903", customer: "Rohan Mehta", subject: "GST Tax Invoice Request", priority: "MEDIUM", status: "Resolved", lastUpdated: "2 hours ago", message: "Please send official B2B GST tax invoice for order #AUR-8410.", replies: ["Invoice has been emailed to your registered address."], internalNotes: ["Verified B2B GST number"] },
  ]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [noteText, setNoteText] = useState<Record<string, string>>({});

  const updateStatus = (id: string, status: TicketStatus) => setTickets(prev => prev.map(t => t.id === id ? { ...t, status, lastUpdated: "just now" } : t));
  const addReply = (id: string) => { if (!replyText[id]) return; setTickets(prev => prev.map(t => t.id === id ? { ...t, replies: [...t.replies, replyText[id]], lastUpdated: "just now" } : t)); setReplyText({...replyText, [id]: ""}); };
  const addNote = (id: string) => { if (!noteText[id]) return; setTickets(prev => prev.map(t => t.id === id ? { ...t, internalNotes: [...t.internalNotes, noteText[id]] } : t)); setNoteText({...noteText, [id]: ""}); };

  const statusColors: Record<TicketStatus, string> = { Open: "bg-amber-500 text-white", Assigned: "bg-blue-500/20 text-blue-600", "In Progress": "bg-blue-500 text-white", Waiting: "bg-amber-100 text-amber-700", Resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", Closed: "bg-gray-100 text-gray-500" };
  const priorityColors: Record<string, string> = { HIGH: "bg-rose-100 text-rose-700", MEDIUM: "bg-amber-100 text-amber-700", LOW: "bg-gray-100 text-gray-600" };
  const nextStatuses: Record<TicketStatus, TicketStatus[]> = { Open: ["Assigned", "In Progress"], Assigned: ["In Progress"], "In Progress": ["Waiting", "Resolved"], Waiting: ["In Progress", "Resolved"], Resolved: ["Closed", "Open"], Closed: ["Open"] };
  const filterTabs = ["All", "Open", "In Progress", "Resolved"];
  const filtered = filter === "All" ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Support & Ticket Center</h1>
          <p className="text-xs text-muted-foreground">Open → Assigned → In Progress → Waiting → Resolved → Closed</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filterTabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${filter === t ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-bold" : "glass-panel text-foreground hover:bg-amber-500/8"}`}>{t}</button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(t => (
          <GlassCard key={t.id} glow="gold" className="p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono font-bold text-sm text-amber-500">{t.id}</span>
                <h3 className="font-serif font-bold text-base">{t.subject}</h3>
                <span className="text-xs text-muted-foreground">{t.customer} • {t.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${priorityColors[t.priority]}`}>{t.priority}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusColors[t.status]}`}>{t.status}</span>
              </div>
            </div>

            <p className="text-xs text-foreground bg-secondary-cream/20 dark:bg-white/5 p-3 rounded-xl border border-border/20">{t.message}</p>

            {/* Replies */}
            {t.replies.length > 0 && (
              <div className="space-y-2 pl-4 border-l-2 border-amber-400/30">
                {t.replies.map((r, i) => (
                  <div key={i} className="text-xs text-foreground bg-amber-500/5 p-2.5 rounded-lg">
                    <span className="text-[10px] font-bold text-amber-500 block mb-0.5">Admin Reply:</span>{r}
                  </div>
                ))}
              </div>
            )}

            {/* Internal Notes (admin-only) */}
            {t.internalNotes.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1"><StickyNote className="w-3 h-3" /> Internal Notes:</span>
                {t.internalNotes.map((n, i) => (
                  <div key={i} className="text-[11px] text-muted-foreground bg-gray-100 dark:bg-gray-800/50 p-2 rounded-lg italic">{n}</div>
                ))}
              </div>
            )}

            {/* Reply & Note Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/20">
              <div className="flex gap-2">
                <input value={replyText[t.id] || ""} onChange={e => setReplyText({...replyText, [t.id]: e.target.value})} placeholder="Reply to customer..." className="flex-1 bg-background border rounded-lg px-3 py-1.5 text-xs" />
                <Button variant="gold" size="sm" onClick={() => addReply(t.id)} className="text-[10px]"><Send className="w-3 h-3" /></Button>
              </div>
              <div className="flex gap-2">
                <input value={noteText[t.id] || ""} onChange={e => setNoteText({...noteText, [t.id]: e.target.value})} placeholder="Internal note..." className="flex-1 bg-background border rounded-lg px-3 py-1.5 text-xs" />
                <Button variant="outline" size="sm" onClick={() => addNote(t.id)} className="text-[10px]"><StickyNote className="w-3 h-3" /></Button>
              </div>
            </div>

            {/* Status Actions */}
            <div className="flex gap-2 justify-end">
              {nextStatuses[t.status]?.map(s => (
                <Button key={s} variant={s === "Resolved" ? "gold" : "outline"} size="sm" className="text-[10px]" onClick={() => updateStatus(t.id, s)}>
                  → {s}
                </Button>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
