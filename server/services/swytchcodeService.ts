import axios from 'axios';

// Swytchcode API Configuration & Types
export interface SwytchcodeConfig {
  apiKey?: string;
  githubToken?: string;
  jiraDomain?: string;
  jiraEmail?: string;
  jiraApiToken?: string;
  slackWebhookUrl?: string;
  isSandboxMode: boolean;
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
  blocks?: any[];
  timestamp: string;
  sender: string;
}

// In-Memory Sandbox Storage (resets on restart or state mutation)
let sandboxGithubIssues: GithubIssue[] = [
  {
    id: 101,
    number: 101,
    title: "[CRITICAL] Memory Leak in Payment Gateway Webhook Worker",
    body: "Out-of-memory error causing node worker crashes under heavy load during checkout process. Stack trace shows unreleased memory buffer in stripe-webhook-handler.ts:L45.",
    state: "open",
    labels: ["bug", "critical", "backend", "payments"],
    user: "alex-dev",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    severity: "CRITICAL"
  },
  {
    id: 102,
    number: 102,
    title: "[HIGH] JWT Authentication Token Expiration Race Condition",
    body: "Users are getting logged out abruptly when refreshing token on mobile client. HTTP 401 unhandled exception in AuthProvider.tsx.",
    state: "open",
    labels: ["bug", "auth", "security", "high-priority"],
    user: "sarah-sec",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    severity: "HIGH"
  },
  {
    id: 103,
    number: 103,
    title: "[MEDIUM] Optimize PostgreSQL Indexing for Analytics Queries",
    body: "Slow response time (>2.4s) on user activity dashboard query. Missing composite index on (tenant_id, created_at).",
    state: "open",
    labels: ["performance", "database"],
    user: "db-admin",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    severity: "MEDIUM"
  },
  {
    id: 104,
    number: 104,
    title: "[HIGH] Rate Limiter Redis Cache Disconnection Handling",
    body: "When Redis cluster re-shards, rate limiter middleware throws unhandled connection exception instead of failing open.",
    state: "open",
    labels: ["bug", "infrastructure", "redis"],
    user: "devops-guru",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    severity: "HIGH"
  }
];

let sandboxJiraTickets: JiraTicket[] = [
  {
    id: "JIRA-401",
    key: "SWYTCH-401",
    summary: "Setup Base CI/CD Pipeline for Swytchcode Agent",
    description: "Configured GitHub actions workflow for buildathon deployment.",
    issueType: "Task",
    priority: "Medium",
    status: "In Progress",
    created: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

let sandboxSlackMessages: SlackMessage[] = [
  {
    id: "msg-1",
    channel: "#dev-alerts",
    text: "🚀 SwytchDev AI Software Engineer Agent initialized and ready for automated triage.",
    timestamp: new Date().toLocaleTimeString(),
    sender: "SwytchDev AI Agent"
  }
];

export class SwytchcodeService {
  private config: SwytchcodeConfig;

  constructor(config?: Partial<SwytchcodeConfig>) {
    this.config = {
      apiKey: process.env.SWYTCHCODE_API_KEY || config?.apiKey || '',
      isSandboxMode: !process.env.SWYTCHCODE_API_KEY && !config?.apiKey
    };
  }

  // --- SWYTCHCODE API 1: GITHUB INTEGRATION ---
  async fetchGithubIssues(repo: string = 'thoughtworks/swytchdev-agent', filter: string = 'open'): Promise<{ success: boolean; data: GithubIssue[]; source: string }> {
    console.log(`[Swytchcode API: GitHub] Fetching issues for ${repo}`);

    // 1. Try Swytchcode Gateway Endpoint
    if (this.config.apiKey) {
      try {
        const response = await axios.get(`https://api.swytchcode.com/v1/github/repos/${repo}/issues`, {
          headers: { 'Authorization': `Bearer ${this.config.apiKey}` },
          params: { state: filter }
        });
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          return { success: true, data: response.data, source: 'Swytchcode Live API' };
        }
      } catch (err: any) {
        console.warn(`[Swytchcode API: GitHub] Swytchcode API gateway notice:`, err.message);
      }
    }

    // 2. Try Direct Real GitHub Public REST API
    try {
      const ghResponse = await axios.get(`https://api.github.com/repos/${repo}/issues`, {
        params: { state: filter, per_page: 10 },
        headers: { 'User-Agent': 'SwytchDev-AI-Agent' }
      });

      if (ghResponse.data && Array.isArray(ghResponse.data)) {
        const formatted: GithubIssue[] = ghResponse.data.map((item: any) => {
          const title = item.title || 'Untitled Issue';
          const labels = (item.labels || []).map((l: any) => typeof l === 'string' ? l : l.name);
          const isCritical = title.toLowerCase().includes('critical') || labels.some((l: string) => l.toLowerCase().includes('critical') || l.toLowerCase().includes('bug'));
          const isHigh = title.toLowerCase().includes('high') || labels.some((l: string) => l.toLowerCase().includes('high'));
          
          return {
            id: item.id,
            number: item.number,
            title: item.title,
            body: item.body || 'No description provided.',
            state: item.state === 'closed' ? 'closed' : 'open',
            labels: labels,
            user: item.user?.login || 'github-user',
            created_at: item.created_at,
            severity: isCritical ? 'CRITICAL' : (isHigh ? 'HIGH' : 'MEDIUM')
          };
        });

        return { success: true, data: formatted, source: `Live GitHub REST API (${repo})` };
      }
    } catch (err: any) {
      console.warn(`[GitHub Public API] Fallback to sandbox:`, err.message);
    }

    // 3. High-fidelity Sandbox Fallback
    const issues = sandboxGithubIssues.filter(i => filter === 'all' || i.state === filter);
    return { success: true, data: issues, source: 'Swytchcode API Sandbox' };
  }

  async getGithubIssueDetails(issueNumber: number): Promise<{ success: boolean; data: GithubIssue | null }> {
    const issue = sandboxGithubIssues.find(i => i.number === issueNumber) || null;
    return { success: true, data: issue };
  }

  async createGithubIssue(title: string, body: string, labels: string[]): Promise<GithubIssue> {
    const newIssue: GithubIssue = {
      id: 100 + sandboxGithubIssues.length + 1,
      number: 100 + sandboxGithubIssues.length + 1,
      title,
      body,
      state: 'open',
      labels,
      user: 'SwytchDev-AI',
      created_at: new Date().toISOString(),
      severity: labels.includes('critical') ? 'CRITICAL' : 'HIGH'
    };
    sandboxGithubIssues.unshift(newIssue);
    return newIssue;
  }

  // --- SWYTCHCODE API 2: JIRA INTEGRATION ---
  async createJiraTicket(params: {
    summary: string;
    description: string;
    issueType?: 'Bug' | 'Task' | 'Story';
    priority?: 'High' | 'Highest' | 'Medium' | 'Low';
    githubIssueNumber?: number;
  }): Promise<{ success: boolean; ticket: JiraTicket; source: string }> {
    console.log(`[Swytchcode API: Jira] Creating ticket: ${params.summary}`);

    if (this.config.apiKey) {
      try {
        const response = await axios.post(`https://api.swytchcode.com/v1/jira/issue`, {
          fields: {
            summary: params.summary,
            description: params.description,
            issuetype: { name: params.issueType || 'Bug' },
            priority: { name: params.priority || 'High' }
          }
        }, {
          headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
        });
        return {
          success: true,
          ticket: {
            id: response.data.id,
            key: response.data.key,
            summary: params.summary,
            description: params.description,
            issueType: params.issueType || 'Bug',
            priority: params.priority || 'High',
            status: 'To Do',
            githubIssueNumber: params.githubIssueNumber,
            created: new Date().toISOString()
          },
          source: 'Swytchcode Live API'
        };
      } catch (err: any) {
        console.warn(`[Swytchcode API: Jira] API call fallback to Sandbox:`, err.message);
      }
    }

    // Sandbox Response
    const ticketIdNum = sandboxJiraTickets.length + 402;
    const ticket: JiraTicket = {
      id: `JIRA-${ticketIdNum}`,
      key: `SWYTCH-${ticketIdNum}`,
      summary: params.summary,
      description: params.description,
      issueType: params.issueType || 'Bug',
      priority: params.priority || 'High',
      status: 'To Do',
      githubIssueNumber: params.githubIssueNumber,
      created: new Date().toISOString()
    };

    sandboxJiraTickets.unshift(ticket);
    return { success: true, ticket, source: 'Swytchcode API Sandbox' };
  }

  async fetchJiraTickets(): Promise<JiraTicket[]> {
    return sandboxJiraTickets;
  }

  // --- SWYTCHCODE API 3: SLACK INTEGRATION ---
  async sendSlackNotification(params: {
    channel: string;
    text: string;
    title?: string;
    jiraKey?: string;
    githubIssueNumber?: number;
    severity?: string;
  }): Promise<{ success: boolean; message: SlackMessage; source: string }> {
    console.log(`[Swytchcode API: Slack] Sending notification to ${params.channel}`);

    if (this.config.apiKey) {
      try {
        await axios.post(`https://api.swytchcode.com/v1/slack/chat.postMessage`, {
          channel: params.channel,
          text: params.text
        }, {
          headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
        });
        return {
          success: true,
          message: {
            id: `msg-${Date.now()}`,
            channel: params.channel,
            text: params.text,
            timestamp: new Date().toLocaleTimeString(),
            sender: 'SwytchDev AI Agent'
          },
          source: 'Swytchcode Live API'
        };
      } catch (err: any) {
        console.warn(`[Swytchcode API: Slack] API call fallback to Sandbox:`, err.message);
      }
    }

    // Sandbox Slack Message creation
    const slackMsg: SlackMessage = {
      id: `msg-${Date.now()}`,
      channel: params.channel || '#dev-alerts',
      text: params.text,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'SwytchDev AI Agent'
    };

    sandboxSlackMessages.unshift(slackMsg);
    return { success: true, message: slackMsg, source: 'Swytchcode API Sandbox' };
  }

  async fetchSlackMessages(): Promise<SlackMessage[]> {
    return sandboxSlackMessages;
  }
}
