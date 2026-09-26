import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AgentPlayground } from './components/AgentPlayground';
import { ExecutionGraph } from './components/ExecutionGraph';
import { GitHubView } from './components/GitHubView';
import { JiraBoardView } from './components/JiraBoardView';
import { SlackFeedView } from './components/SlackFeedView';
import { ArchitectureView } from './components/ArchitectureView';
import type { AgentStep, WorkflowResult, GithubIssue, JiraTicket, SlackMessage } from './types/agent';
import { ShieldCheck } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('playground');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [currentResult, setCurrentResult] = useState<WorkflowResult | null>(null);

  const [githubIssues, setGithubIssues] = useState<GithubIssue[]>([]);
  const [jiraTickets, setJiraTickets] = useState<JiraTicket[]>([]);
  const [slackMessages, setSlackMessages] = useState<SlackMessage[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // Initial Data Fetching from Swytchcode API endpoints
  const fetchBoardData = async () => {
    try {
      setLoadingData(true);
      const [ghRes, jiraRes, slackRes] = await Promise.all([
        fetch('/api/github/issues').then(r => r.json()),
        fetch('/api/jira/tickets').then(r => r.json()),
        fetch('/api/slack/messages').then(r => r.json()),
      ]);

      if (ghRes.data) setGithubIssues(ghRes.data);
      if (Array.isArray(jiraRes)) setJiraTickets(jiraRes);
      if (Array.isArray(slackRes)) setSlackMessages(slackRes);
    } catch (err) {
      console.warn('Error fetching board data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, []);

  // Run Agentic Workflow (Streaming or HTTP POST fallback)
  const handleRunWorkflow = async (prompt: string) => {
    setIsRunning(true);
    setSteps([]);
    setCurrentResult(null);

    // Use SSE (Server-Sent Events) for real-time live execution trace
    try {
      const eventSource = new EventSource(`/api/agent/stream?prompt=${encodeURIComponent(prompt)}`);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'STEP') {
            setSteps((prev) => [...prev, data.step]);
          } else if (data.type === 'COMPLETE') {
            setCurrentResult(data.result);
            setIsRunning(false);
            eventSource.close();
            // Refresh Jira & Slack boards
            fetchBoardData();
          } else if (data.type === 'ERROR') {
            console.error('SSE Error:', data.error);
            setIsRunning(false);
            eventSource.close();
          }
        } catch (e) {
          console.error('Error parsing SSE event:', e);
        }
      };

      eventSource.onerror = (err) => {
        console.warn('SSE disconnected, falling back to HTTP POST API call:', err);
        eventSource.close();
        runFallbackPost(prompt);
      };
    } catch (err) {
      runFallbackPost(prompt);
    }
  };

  const runFallbackPost = async (prompt: string) => {
    try {
      const res = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data: WorkflowResult = await res.json();
      setSteps(data.steps);
      setCurrentResult(data);
      fetchBoardData();
    } catch (e) {
      console.error('Fallback POST error:', e);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-12">
      
      {/* Top Sticky Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} isRunning={isRunning} />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Workspace:</span>
            <span className="px-2.5 py-0.5 text-xs font-mono rounded bg-slate-900 text-indigo-300 border border-slate-800">
              thoughtworks/swytchdev-agent
            </span>
          </div>

          <button
            onClick={() => setActiveTab('arch')}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Commudle Submission Checklist
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'playground' && (
          <AgentPlayground
            onRunWorkflow={handleRunWorkflow}
            isRunning={isRunning}
            steps={steps}
            currentResult={currentResult}
          />
        )}

        {activeTab === 'graph' && (
          <ExecutionGraph steps={steps} isRunning={isRunning} />
        )}

        {activeTab === 'github' && (
          <GitHubView issues={githubIssues} loading={loadingData} />
        )}

        {activeTab === 'jira' && (
          <JiraBoardView tickets={jiraTickets} />
        )}

        {activeTab === 'slack' && (
          <SlackFeedView messages={slackMessages} />
        )}

        {activeTab === 'arch' && (
          <ArchitectureView />
        )}

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 mt-16 pt-6 border-t border-slate-900 text-center text-xs text-slate-500 font-mono">
        Built for Swytchcode Gurgaon Buildathon 2026 • AI Agent Track 1: AI Software Engineer
      </footer>

    </div>
  );
}

export default App;
