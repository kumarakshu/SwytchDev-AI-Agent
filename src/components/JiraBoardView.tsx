import React from 'react';
import { JiraIcon } from './Icons';
import type { JiraTicket } from '../types/agent';

interface JiraBoardViewProps {
  tickets: JiraTicket[];
}

export const JiraBoardView: React.FC<JiraBoardViewProps> = ({ tickets }) => {
  const columns = [
    { title: 'To Do (Backlog)', status: 'To Do', color: 'border-slate-800' },
    { title: 'In Progress', status: 'In Progress', color: 'border-blue-900/60' },
    { title: 'Done / Resolved', status: 'Done', color: 'border-emerald-900/60' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <JiraIcon className="w-5 h-5 text-blue-400" /> Swytchcode Jira Kanban Sprint Board
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Project: <span className="font-mono text-blue-300">SWYTCH (Swytchcode AI Agent Sprint)</span> • Auto-synced Jira Tickets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-blue-950/80 text-blue-300 border border-blue-800/50">
            {tickets.length} Active Tickets
          </span>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTickets = tickets.filter(t => t.status === col.status);

          return (
            <div key={col.status} className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {col.title}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                  {colTickets.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[350px]">
                {colTickets.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                    No tickets in {col.status}
                  </div>
                ) : (
                  colTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition-all space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-blue-400">
                          {ticket.key}
                        </span>

                        <span
                          className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase ${
                            ticket.priority === 'Highest' || ticket.priority === 'High'
                              ? 'bg-rose-950 text-rose-300 border-rose-800'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white line-clamp-2">
                        {ticket.summary}
                      </h4>

                      <p className="text-[11px] text-slate-400 font-sans line-clamp-3 leading-relaxed">
                        {ticket.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                        {ticket.githubIssueNumber && (
                          <span className="text-purple-400">
                            Linked: GitHub #{ticket.githubIssueNumber}
                          </span>
                        )}
                        <span className="text-slate-400">Swytchcode Jira API</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
