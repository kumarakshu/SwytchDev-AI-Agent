import React from 'react';
import { Tag, ExternalLink } from 'lucide-react';
import { GithubIcon } from './Icons';
import type { GithubIssue } from '../types/agent';

interface GitHubViewProps {
  issues: GithubIssue[];
  loading: boolean;
}

export const GitHubView: React.FC<GitHubViewProps> = ({ issues, loading }) => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GithubIcon className="w-5 h-5 text-purple-400" /> Swytchcode GitHub API Integration Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Repository: <span className="font-mono text-purple-300">thoughtworks/swytchdev-agent</span> • Synced via Swytchcode API
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-purple-950/80 text-purple-300 border border-purple-800/50">
            {issues.length} Open Issues
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 animate-pulse">
          Loading issues via Swytchcode GitHub API...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {issues.map((issue) => {
            const isCritical = issue.severity === 'CRITICAL' || issue.labels.includes('critical');
            const isHigh = issue.severity === 'HIGH' || issue.labels.includes('high-priority');

            return (
              <div
                key={issue.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-purple-500/40 transition-all space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    #{issue.number}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                      isCritical
                        ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                        : isHigh
                        ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {issue.severity || 'NORMAL'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">
                  {issue.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-sans">
                  {issue.body}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                  {issue.labels.map((label, lIdx) => (
                    <span
                      key={lIdx}
                      className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5 text-purple-400" /> {label}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                  <span>Reporter: @{issue.user}</span>
                  <span className="flex items-center gap-1 text-purple-400">
                    Swytchcode Synced <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
