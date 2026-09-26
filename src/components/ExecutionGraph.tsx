import React from 'react';
import { GitBranch, Cpu, MessageSquare, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { GithubIcon, JiraIcon } from './Icons';
import type { AgentStep } from '../types/agent';

interface ExecutionGraphProps {
  steps: AgentStep[];
  isRunning: boolean;
}

export const ExecutionGraph: React.FC<ExecutionGraphProps> = ({ steps, isRunning }) => {
  const currentStepPhase = steps.length > 0 ? steps[steps.length - 1].phase : null;

  const nodes = [
    {
      id: 'UNDERSTAND',
      label: '1. User Request',
      subtitle: 'Natural Language Intent',
      icon: Cpu,
      color: 'from-indigo-600 to-indigo-800',
      activeColor: 'ring-2 ring-indigo-400 glow-blue',
      api: null
    },
    {
      id: 'TOOL_SELECT_GITHUB',
      label: '2. Swytchcode GitHub API',
      subtitle: 'Issue Extraction & Context',
      icon: GithubIcon,
      color: 'from-purple-600 to-purple-800',
      activeColor: 'ring-2 ring-purple-400 glow-purple',
      api: 'Swytchcode GitHub Tool'
    },
    {
      id: 'ANALYZE',
      label: '3. Severity Reasoning',
      subtitle: 'Triage & Root Cause',
      icon: AlertCircle,
      color: 'from-amber-600 to-amber-800',
      activeColor: 'ring-2 ring-amber-400',
      api: 'AI Reasoner'
    },
    {
      id: 'TOOL_SELECT_JIRA',
      label: '4. Swytchcode Jira API',
      subtitle: 'Auto Ticket Creation',
      icon: JiraIcon,
      color: 'from-blue-600 to-blue-800',
      activeColor: 'ring-2 ring-blue-400 glow-blue',
      api: 'Swytchcode Jira Tool'
    },
    {
      id: 'TOOL_SELECT_SLACK',
      label: '5. Swytchcode Slack API',
      subtitle: 'Team Digest & Alert',
      icon: MessageSquare,
      color: 'from-emerald-600 to-emerald-800',
      activeColor: 'ring-2 ring-emerald-400 glow-emerald',
      api: 'Swytchcode Slack Tool'
    },
    {
      id: 'FINAL_RESPONSE',
      label: '6. Outcome Delivered',
      subtitle: 'Multi-Tool Execution Complete',
      icon: CheckCircle2,
      color: 'from-pink-600 to-purple-700',
      activeColor: 'ring-2 ring-pink-400',
      api: null
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-400" /> Multi-Step Agentic Workflow Architecture (DAG)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visual graph showing how SwytchDev Agent reasons, selects tools, and executes Swytchcode APIs sequentially.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            Status: {isRunning ? 'Executing Agent Loop...' : 'Idle / Ready'}
          </span>
        </div>
      </div>

      {/* Interactive Node DAG Flow Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative py-4">
        {nodes.map((node, index) => {
          const isNodeCompleted = steps.some(s => s.phase === node.id || (node.id.includes('GITHUB') && s.tool === 'GitHub') || (node.id.includes('JIRA') && s.tool === 'Jira') || (node.id.includes('SLACK') && s.tool === 'Slack'));
          const isCurrentActive = isRunning && currentStepPhase === node.id;
          const NodeIcon = node.icon;

          return (
            <div
              key={node.id}
              className={`p-5 rounded-2xl bg-slate-900/90 border transition-all duration-300 relative overflow-hidden ${
                isCurrentActive
                  ? `${node.activeColor} border-transparent bg-slate-800/90 scale-105`
                  : isNodeCompleted
                  ? 'border-indigo-500/40 bg-slate-900/90 shadow-md'
                  : 'border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl bg-gradient-to-tr ${node.color} text-white shadow-md`}>
                  <NodeIcon className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-2">
                  {node.api && (
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {node.api}
                    </span>
                  )}
                  {isNodeCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">{node.label}</h4>
              <p className="text-xs text-slate-400 font-sans">{node.subtitle}</p>

              {index < nodes.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-slate-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
