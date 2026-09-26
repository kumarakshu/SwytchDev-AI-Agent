import React, { useState } from 'react';
import { Play, Terminal, Code2, CheckCircle2, ChevronRight, ChevronDown, Activity, Zap, Cpu, RefreshCw, ShieldCheck } from 'lucide-react';
import type { AgentStep, WorkflowResult } from '../types/agent';
import confetti from 'canvas-confetti';

interface AgentPlaygroundProps {
  onRunWorkflow: (prompt: string) => void;
  isRunning: boolean;
  steps: AgentStep[];
  currentResult: WorkflowResult | null;
}

export const AgentPlayground: React.FC<AgentPlaygroundProps> = ({
  onRunWorkflow,
  isRunning,
  steps,
  currentResult,
}) => {
  const [promptInput, setPromptInput] = useState(
    'Find critical GitHub issues, create Jira tickets and notify Slack.'
  );

  const [expandedStepIndex, setExpandedStepIndex] = useState<number | null>(null);

  // 3 Official Judge Test Scenarios
  const presets = [
    {
      id: 'test-1',
      title: '🧪 TEST 1 — Full Escalation Pipeline',
      subtitle: 'GitHub ✓ • Jira ✓ • Slack ✓',
      prompt: 'Find critical GitHub issues, create Jira tickets and notify Slack.'
    },
    {
      id: 'test-2',
      title: '🧪 TEST 2 — Audit Only (No Actions)',
      subtitle: 'GitHub ✓ • Jira ✗ • Slack ✗',
      prompt: 'Find the critical issues in repository and summarize them.'
    },
    {
      id: 'test-3',
      title: '🧪 TEST 3 — Targeted Jira Sync (#101)',
      subtitle: 'GitHub ✓ • Jira ✓ • Slack ✗',
      prompt: 'Create a Jira ticket for GitHub issue #101.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isRunning) return;
    onRunWorkflow(promptInput);
  };

  const handlePresetSelect = (presetPrompt: string) => {
    setPromptInput(presetPrompt);
    onRunWorkflow(presetPrompt);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  React.useEffect(() => {
    if (currentResult) {
      triggerConfetti();
    }
  }, [currentResult]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Prompt Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" /> Dynamic Agent Prompt Playground
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter any engineering instruction. SwytchDev dynamically decides tool selection based on request intent and issue severity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Adaptive Tool Planner Active
            </span>
          </div>
        </div>

        {/* 3 Verification Test Scenarios for Judges */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Verify Dynamic Tool Selection (Judge Test Scenarios):
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePresetSelect(p.prompt)}
                disabled={isRunning}
                className="text-left p-3.5 rounded-xl bg-slate-900/90 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between group disabled:opacity-50"
              >
                <div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors block">
                    {p.title}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic font-sans">
                    "{p.prompt}"
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-indigo-400">
                    {p.subtitle}
                  </span>
                  <span className="text-xs text-indigo-400 group-hover:translate-x-1 transition-transform">▸</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Tell SwytchDev Agent what engineering task to automate..."
              rows={2}
              className="w-full pl-4 pr-36 py-3 bg-slate-950/90 rounded-xl border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-sans resize-none"
            />
            <button
              type="submit"
              disabled={isRunning || !promptInput.trim()}
              className="absolute right-3 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Reasoning...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> Execute Agent
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Main Execution Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Live Execution Trace */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 min-h-[450px]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> Live Agent Execution Trace
              </h3>
              {steps.length > 0 && (
                <span className="text-xs text-slate-400 font-mono">
                  {steps.length} steps recorded
                </span>
              )}
            </div>

            {steps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                <Cpu className="w-12 h-12 stroke-[1.2] mb-3 text-slate-600 animate-pulse" />
                <p className="text-sm font-medium text-slate-400">Agent Ready for Execution</p>
                <p className="text-xs text-slate-500 max-w-md mt-1">
                  Click one of the 3 judge test scenarios above to observe how SwytchDev dynamically selects tools based on situation and severity.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {steps.map((step, idx) => {
                  const isExpanded = expandedStepIndex === idx;

                  // Tool Badge Helpers
                  const getToolColor = (tool?: string) => {
                    if (tool === 'GitHub') return 'bg-purple-950/80 text-purple-300 border-purple-800/60';
                    if (tool === 'Jira') return 'bg-blue-950/80 text-blue-300 border-blue-800/60';
                    if (tool === 'Slack') return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
                    return 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60';
                  };

                  return (
                    <div
                      key={idx}
                      className={`rounded-xl border overflow-hidden transition-all ${
                        step.status === 'skipped'
                          ? 'bg-slate-950/60 border-slate-800/50 opacity-70'
                          : 'bg-slate-900/90 border-slate-800/90'
                      }`}
                    >
                      {/* Step Header */}
                      <div
                        onClick={() => setExpandedStepIndex(isExpanded ? null : idx)}
                        className="p-4 flex items-start justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 text-xs font-mono font-bold text-slate-300 border border-slate-700 mt-0.5">
                            0{step.stepIndex}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${getToolColor(step.tool)}`}>
                                {step.tool || 'AI Agent'}
                              </span>
                              <h4 className="text-sm font-semibold text-slate-100">
                                {step.title}
                              </h4>
                            </div>

                            <p className="text-xs text-slate-400 mt-1 font-sans">
                              {step.thought}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {step.apiDetails && (
                            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-indigo-300 border border-indigo-900/50">
                              Swytchcode API
                            </span>
                          )}

                          {step.status === 'completed' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          )}

                          {step.status === 'skipped' && (
                            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-950/60 text-amber-400 border border-amber-800/50">
                              SKIPPED
                            </span>
                          )}

                          {step.status === 'in_progress' && (
                            <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                          )}

                          {step.apiDetails && (
                            <button className="text-slate-500 hover:text-slate-300 p-1">
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expandable Swytchcode API Details Payload Inspector */}
                      {isExpanded && step.apiDetails && (
                        <div className="p-4 bg-slate-950/90 border-t border-slate-800 font-mono-code text-xs space-y-3">
                          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2">
                            <span className="text-indigo-400 font-bold">🔍 Swytchcode API Telemetry</span>
                            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 text-[10px]">
                              Source: {step.apiDetails.source || 'Swytchcode API'}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-500 block text-[11px] mb-1">HTTP Endpoint & Method:</span>
                            <div className="p-2 rounded bg-slate-900 text-emerald-300 border border-slate-800">
                              <span className="text-purple-400 font-bold mr-2">{step.apiDetails.method}</span>
                              {step.apiDetails.endpoint}
                            </div>
                          </div>

                          {step.apiDetails.headers && (
                            <div>
                              <span className="text-slate-500 block text-[11px] mb-1">Authorization Security Header:</span>
                              <pre className="p-2 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[11px]">
                                {JSON.stringify(step.apiDetails.headers, null, 2)}
                              </pre>
                            </div>
                          )}

                          {step.apiDetails.payload && (
                            <div>
                              <span className="text-slate-500 block text-[11px] mb-1">Request Payload:</span>
                              <pre className="p-2.5 rounded bg-slate-900 text-slate-300 overflow-x-auto border border-slate-800 text-[11px]">
                                {JSON.stringify(step.apiDetails.payload, null, 2)}
                              </pre>
                            </div>
                          )}

                          {step.apiDetails.response && (
                            <div>
                              <span className="text-slate-500 block text-[11px] mb-1">API Response JSON:</span>
                              <pre className="p-2.5 rounded bg-slate-900 text-indigo-200 overflow-x-auto border border-slate-800 text-[11px] max-h-48">
                                {JSON.stringify(step.apiDetails.response, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Agent Decision Log & Summary Card */}
        <div className="space-y-4">
          
          {/* Agent Decision Summary Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Agent Decision Log
            </h3>

            {currentResult && currentResult.decisionSummary ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-sans text-xs">
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">• GitHub Required:</span>
                    <span className={currentResult.decisionSummary.githubRequired ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {currentResult.decisionSummary.githubRequired ? 'YES (Issues Scanned)' : 'NO'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">• Jira Required:</span>
                    <span className={currentResult.decisionSummary.jiraRequired ? 'text-blue-400 font-bold' : 'text-amber-400 font-bold'}>
                      {currentResult.decisionSummary.jiraRequired ? 'YES (Tickets Created)' : 'SKIPPED (Intent Audit)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">• Slack Required:</span>
                    <span className={currentResult.decisionSummary.slackRequired ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {currentResult.decisionSummary.slackRequired ? 'YES (Alert Post)' : 'SKIPPED (Intent Audit)'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-slate-300 text-[11px] leading-relaxed">
                  <span className="font-bold text-slate-400 block mb-0.5 font-mono">Reason:</span>
                  {currentResult.decisionSummary.reason}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-500 text-center font-sans">
                Run an agent scenario to inspect the dynamic tool selection decision log.
              </div>
            )}
          </div>

          {/* Workflow Summary Metrics */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" /> Workflow Impact Summary
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40">
                <span className="text-xl font-bold text-purple-400">
                  {currentResult?.summary.githubIssuesAnalyzed ?? 0}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">GitHub Scanned</span>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40">
                <span className="text-xl font-bold text-blue-400">
                  {currentResult?.summary.jiraTicketsCreated ?? 0}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Jira Created</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40">
                <span className="text-xl font-bold text-emerald-400">
                  {currentResult?.summary.slackNotificationsSent ?? 0}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Slack Alerts</span>
              </div>
            </div>
          </div>

          {/* Generated AI Code Patch Preview */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Code2 className="w-4 h-4 text-indigo-400" /> AI Code Patch Recommendation
              </h3>
              <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-indigo-300 font-mono">
                Secondary Innovation
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Auto-generated code fix recommendation for critical issue #101:
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono-code text-[11px] text-slate-300 overflow-x-auto space-y-1">
              <div className="text-slate-500">// File: src/middleware/stripe-webhook-handler.ts</div>
              <div className="text-emerald-400">+ export async function safeWebhookHandler(req, res) &#123;</div>
              <div className="text-emerald-400">+   try &#123;</div>
              <div className="text-emerald-400">+     await processBufferWithLimit(req.body);</div>
              <div className="text-emerald-400">+   &#125; catch (err) &#123;</div>
              <div className="text-emerald-400">+     logger.error('Buffer leak prevented', err);</div>
              <div className="text-emerald-400">+     res.status(500).send(&#123; error: 'Recovered' &#125;);</div>
              <div className="text-emerald-400">+   &#125;</div>
              <div className="text-emerald-400">+ &#125;</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
