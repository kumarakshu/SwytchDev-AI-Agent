import React from 'react';
import { MessageSquare, Bot, Hash, CheckCircle2 } from 'lucide-react';
import type { SlackMessage } from '../types/agent';

interface SlackFeedViewProps {
  messages: SlackMessage[];
}

export const SlackFeedView: React.FC<SlackFeedViewProps> = ({ messages }) => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" /> Swytchcode Slack Notification Feed
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Channel: <span className="font-mono text-emerald-300">#dev-alerts</span> • Powered by Swytchcode Slack API
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 flex items-center gap-1">
            <Hash className="w-3 h-3" /> dev-alerts (Live)
          </span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white">{msg.sender}</span>
                  <span className="px-2 py-0.5 ml-2 text-[10px] rounded bg-emerald-950 text-emerald-300 border border-emerald-900 font-mono">
                    APP / SWYTCHCODE
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-mono text-slate-500">{msg.timestamp}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
              {msg.text}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
              <span>Channel: {msg.channel}</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Delivered via Swytchcode Slack API
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
