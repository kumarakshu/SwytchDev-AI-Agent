import React from 'react';
import { MessageSquare, CheckCircle2, Award, ExternalLink, Layers, GitBranch, ShieldCheck } from 'lucide-react';
import { GithubIcon, JiraIcon } from './Icons';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" /> SwytchDev Architecture & Submission Overview
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Buildathon Gurgaon • Track 1: AI Software Engineer • Commudle Ready
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> 100% Hackathon Compliant
          </span>
        </div>
      </div>

      {/* Visual System Architecture */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
          <GitBranch className="w-4 h-4 text-indigo-400" /> End-to-End Agent Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-sans">
          
          <div className="p-4 rounded-xl bg-slate-900 border border-indigo-900/60 space-y-2">
            <div className="text-indigo-400 font-bold text-xs uppercase font-mono">1. Prompt / Event</div>
            <p className="text-xs text-slate-300">User Prompt / GitHub Webhook Trigger</p>
            <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-400 block font-mono">Natural Language</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-purple-900/60 space-y-2">
            <div className="text-purple-400 font-bold text-xs uppercase font-mono">2. Agent Engine</div>
            <p className="text-xs text-slate-300">SwytchDev Multi-Step Reasoning Loop</p>
            <span className="px-2 py-0.5 text-[10px] rounded bg-purple-950 text-purple-300 block font-mono">Intent & Triage</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-blue-900/60 space-y-2">
            <div className="text-blue-400 font-bold text-xs uppercase font-mono">3. Swytchcode APIs</div>
            <p className="text-xs text-slate-300">GitHub API • Jira API • Slack API</p>
            <span className="px-2 py-0.5 text-[10px] rounded bg-blue-950 text-blue-300 block font-mono">3+ Integrated</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-emerald-900/60 space-y-2">
            <div className="text-emerald-400 font-bold text-xs uppercase font-mono">4. Action Outcome</div>
            <p className="text-xs text-slate-300">Jira Tickets + Slack Digest + AI PR Patch</p>
            <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-950 text-emerald-300 block font-mono">Automated Resolution</span>
          </div>

        </div>
      </div>

      {/* Submission Deliverables & Criteria Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Swytchcode APIs Used */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Integrated Swytchcode APIs (30% Weightage)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <GithubIcon className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">1. Swytchcode GitHub API</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Scans open repository issues, evaluates severity labels, extracts stack traces and user metadata.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <JiraIcon className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">2. Swytchcode Jira API</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Transforms GitHub bug context into structured Jira backlog tickets with priorities, descriptions, and assignees.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">3. Swytchcode Slack API</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Dispatches real-time interactive alert digests to `#dev-alerts` channel with Jira ticket links & AI code patches.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Commudle Deliverables Checklist */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Commudle Submission Deliverables
          </h3>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Working AI Agent (Multi-step reasoning pipeline)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Minimum 3 Swytchcode APIs (GitHub, Jira, Slack)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Public GitHub Repository & Codebase</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Comprehensive README with setup instructions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>System Architecture Diagram</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Interactive Real-Time Judge Demo Playground</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <a
              href="https://www.commudle.com/builds/create?campaign=BuildWithSwytchcode"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30"
            >
              Submit on Commudle Platform <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
