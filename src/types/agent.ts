export interface AgentDecisionSummary {
  githubRequired: boolean;
  jiraRequired: boolean;
  slackRequired: boolean;
  patchRequired: boolean;
  reason: string;
}

export interface AgentStep {
  stepIndex: number;
  timestamp: string;
  phase: 'UNDERSTAND' | 'PLAN' | 'TOOL_SELECT' | 'SWYTCHCODE_API_CALL' | 'ANALYZE' | 'FOLLOW_UP' | 'FINAL_RESPONSE';
  tool?: 'GitHub' | 'Jira' | 'Slack' | 'AI_Reasoner';
  title: string;
  thought: string;
  apiDetails?: {
    endpoint: string;
    method: string;
    headers?: Record<string, string>;
    params?: any;
    payload?: any;
    response?: any;
    source?: string;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
}

export interface CodePatchInfo {
  targetRepo: string;
  issueNumber: number;
  issueTitle: string;
  filePath: string;
  diffSnippet: string;
}

export interface WorkflowResult {
  workflowId: string;
  userPrompt: string;
  startTime: string;
  endTime: string;
  totalSteps: number;
  steps: AgentStep[];
  decisionSummary: AgentDecisionSummary;
  swytchcodeApisUsed: string[];
  summary: {
    githubIssuesAnalyzed: number;
    jiraTicketsCreated: number;
    slackNotificationsSent: number;
  };
  codePatch?: CodePatchInfo;
  finalOutput: string;
}

export interface GithubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  labels: string[];
  user: string;
  created_at: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface JiraTicket {
  id: string;
  key: string;
  summary: string;
  description: string;
  issueType: 'Bug' | 'Task' | 'Story';
  priority: 'High' | 'Highest' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Done';
  githubIssueNumber?: number;
  created: string;
}

export interface SlackMessage {
  id: string;
  channel: string;
  text: string;
  timestamp: string;
  sender: string;
}
