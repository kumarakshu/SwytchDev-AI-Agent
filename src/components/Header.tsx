import React from 'react';
import { Cpu, MessageSquare, Terminal, GitBranch, Sparkles } from 'lucide-react';
import { GithubIcon, JiraIcon } from './Icons';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, isRunning }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Track Info */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/30">
            <Cpu className="w-6 h-6 text-white" />
            {isRunning && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight">
                SwytchDev AI
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Track 1: Software Engineer
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Autonomous Software Engineer for Issue-to-Action Workflows
            </p>
          </div>
        </div>

        {/* Swytchcode Mode & API Badges */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SWYTCHCODE LIVE / SANDBOX MODE
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
            <GithubIcon className="w-3.5 h-3.5 text-purple-400" /> GitHub
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
            <JiraIcon className="w-3.5 h-3.5 text-blue-400" /> Jira
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Slack
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('playground')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'playground'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Playground
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'graph'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" /> Execution DAG
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'github'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <GithubIcon className="w-3.5 h-3.5 text-purple-400" /> GitHub
          </button>

          <button
            onClick={() => setActiveTab('jira')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'jira'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <JiraIcon className="w-3.5 h-3.5 text-blue-400" /> Jira
          </button>

          <button
            onClick={() => setActiveTab('slack')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'slack'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Slack
          </button>
        </nav>

      </div>
    </header>
  );
};
