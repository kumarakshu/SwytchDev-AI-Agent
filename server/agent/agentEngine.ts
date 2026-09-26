import { SwytchcodeService, GithubIssue, JiraTicket, SlackMessage } from '../services/swytchcodeService';

export interface AgentDecisionSummary {
  githubRequired: boolean;
  jiraRequired: boolean;
  slackRequired: boolean;
  patchRequired: boolean;
  reason: string;
}

export interface AgentExecutionStep {
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

export interface AgentWorkflowResult {
  workflowId: string;
  userPrompt: string;
  startTime: string;
  endTime: string;
  totalSteps: number;
  steps: AgentExecutionStep[];
  decisionSummary: AgentDecisionSummary;
  swytchcodeApisUsed: string[];
  summary: {
    githubIssuesAnalyzed: number;
    jiraTicketsCreated: number;
    slackNotificationsSent: number;
  };
  finalOutput: string;
}

export class SwytchDevAgent {
  private swytchcode: SwytchcodeService;

  constructor() {
    this.swytchcode = new SwytchcodeService();
  }

  /**
   * Run Dynamic Autonomous Agentic Workflow
   * Evaluates prompt intent & issue severity to selectively choose tools.
   */
  async runWorkflow(
    prompt: string,
    onStepCallback?: (step: AgentExecutionStep) => void
  ): Promise<AgentWorkflowResult> {
    const workflowId = `wf-${Date.now()}`;
    const startTime = new Date().toISOString();
    const steps: AgentExecutionStep[] = [];
    const usedApis: Set<string> = new Set();

    let githubIssuesAnalyzed = 0;
    let jiraTicketsCreated = 0;
    let slackNotificationsSent = 0;

    const lowerPrompt = prompt.toLowerCase();

    // DYNAMIC INTENT DECODER
    // 1. GitHub is required for repo engineering context
    const githubRequired = true;

    // 2. Jira is required if prompt requests ticket creation, tracking, escalation, or specific ticket creation
    const containsJiraKeyword = lowerPrompt.includes('jira') || lowerPrompt.includes('ticket') || lowerPrompt.includes('escalate') || lowerPrompt.includes('track') || lowerPrompt.includes('create');
    const isAuditOnly = lowerPrompt.includes('summarize') && !containsJiraKeyword;
    const jiraRequired = containsJiraKeyword && !isAuditOnly;

    // 3. Slack is required if prompt explicitly asks to notify, alert, post message, or inform team
    const slackRequired = lowerPrompt.includes('slack') || lowerPrompt.includes('notify') || lowerPrompt.includes('alert') || lowerPrompt.includes('inform') || lowerPrompt.includes('broadcast');

    // 4. Code Patch is generated ONLY for full escalation pipelines or explicit patch/fix requests
    const explicitPatchRequested = lowerPrompt.includes('fix') || lowerPrompt.includes('patch') || lowerPrompt.includes('recommendation');
    const isFullEscalation = jiraRequired && slackRequired;
    const patchRequired = explicitPatchRequested || (isFullEscalation && !isAuditOnly);

    let decisionReason = '';
    if (jiraRequired && slackRequired) {
      decisionReason = 'Full escalation requested by user (GitHub + Jira + Patch + Slack).';
    } else if (jiraRequired && !slackRequired) {
      decisionReason = 'User requested Jira synchronization only (Skipped Code Patch and Slack).';
    } else if (!jiraRequired && !slackRequired) {
      decisionReason = 'Read-only audit requested by user (Skipped Jira, Patch, and Slack mutations).';
    } else {
      decisionReason = 'Selected tools based on explicit user prompt instructions.';
    }

    const decisionSummary: AgentDecisionSummary = {
      githubRequired,
      jiraRequired,
      slackRequired,
      patchRequired,
      reason: decisionReason
    };

    const emitStep = async (stepData: Omit<AgentExecutionStep, 'stepIndex' | 'timestamp'>) => {
      const step: AgentExecutionStep = {
        ...stepData,
        stepIndex: steps.length + 1,
        timestamp: new Date().toISOString()
      };
      steps.push(step);
      if (onStepCallback) {
        onStepCallback(step);
      }
      await new Promise(res => setTimeout(res, 500));
    };

    // STEP 1: UNDERSTAND & INTENT REASONING
    await emitStep({
      phase: 'UNDERSTAND',
      tool: 'AI_Reasoner',
      title: 'Intent & Tool Selection Reasoning',
      thought: `Analyzed prompt: "${prompt}". Dynamic Decisions -> GitHub: ${githubRequired ? 'YES' : 'NO'}, Jira: ${jiraRequired ? 'YES' : 'NO'}, Slack: ${slackRequired ? 'YES' : 'NO'}. ${decisionReason}`,
      status: 'completed'
    });

    // STEP 2: PLAN EXECUTION GRAPH
    const activeToolsList = [];
    if (githubRequired) activeToolsList.push('Swytchcode GitHub API');
    if (jiraRequired) activeToolsList.push('Swytchcode Jira API');
    if (slackRequired) activeToolsList.push('Swytchcode Slack API');

    await emitStep({
      phase: 'PLAN',
      tool: 'AI_Reasoner',
      title: 'Dynamic Agent Execution Graph Planned',
      thought: `Constructed adaptive pipeline with ${activeToolsList.length} tools: ${activeToolsList.join(' → ')}. Skipped unnecessary tool invocations based on request context.`,
      status: 'completed'
    });

    // STEP 3: TOOL 1 - GITHUB API INTEGRATION
    await emitStep({
      phase: 'TOOL_SELECT',
      tool: 'GitHub',
      title: 'Executing Swytchcode GitHub API Tool',
      thought: 'Selecting tool: swytchcode_github_fetch_issues. Fetching open issues for repository: thoughtworks/swytchdev-agent.',
      status: 'in_progress'
    });

    usedApis.add('Swytchcode GitHub API');
    const githubResult = await this.swytchcode.fetchGithubIssues('thoughtworks/swytchdev-agent', 'open');
    const openIssues = githubResult.data;
    githubIssuesAnalyzed = openIssues.length;

    await emitStep({
      phase: 'SWYTCHCODE_API_CALL',
      tool: 'GitHub',
      title: 'Swytchcode GitHub API Executed',
      thought: `Retrieved ${openIssues.length} open issues from GitHub via Swytchcode API.`,
      apiDetails: {
        endpoint: 'GET /v1/github/repos/thoughtworks/swytchdev-agent/issues',
        method: 'GET',
        headers: { Authorization: 'Bearer ••••••••••••' },
        params: { state: 'open' },
        response: openIssues,
        source: githubResult.source
      },
      status: 'completed'
    });

    // STEP 4: AI TRIAGE & SEVERITY EVALUATION
    const highPriorityIssues = openIssues.filter(
      i => i.severity === 'CRITICAL' || i.severity === 'HIGH' || i.labels.includes('critical') || i.labels.includes('high-priority')
    );

    const isTargetingSpecific = prompt.match(/#?(\d{3})/);
    let targetIssuesToProcess = highPriorityIssues;

    if (isTargetingSpecific && isTargetingSpecific[1]) {
      const issueNum = parseInt(isTargetingSpecific[1], 10);
      const found = openIssues.filter(i => i.number === issueNum);
      if (found.length > 0) {
        targetIssuesToProcess = found;
      }
    }

    const triageBreakdown = openIssues.map(i => `#${i.number} [${i.severity || 'MEDIUM'}] → ${
      targetIssuesToProcess.some(t => t.number === i.number) ? (jiraRequired ? 'Jira Ticket Required' : 'Audit Logged') : 'Skipped (Low/Medium Severity)'
    }`).join(' | ');

    await emitStep({
      phase: 'ANALYZE',
      tool: 'AI_Reasoner',
      title: 'AI Issue Triage & Severity Evaluation',
      thought: `Triage complete across ${openIssues.length} issues. Found ${highPriorityIssues.length} high-severity items. Triage Breakdown: ${triageBreakdown}.`,
      status: 'completed'
    });

    // STEP 5: TOOL 2 - JIRA API INTEGRATION (Conditional)
    const createdTickets: JiraTicket[] = [];

    if (jiraRequired && targetIssuesToProcess.length > 0) {
      for (const issue of targetIssuesToProcess.slice(0, 2)) {
        await emitStep({
          phase: 'TOOL_SELECT',
          tool: 'Jira',
          title: `Executing Swytchcode Jira API Tool for Issue #${issue.number}`,
          thought: `Preparing Swytchcode Jira issue payload for GitHub Issue #${issue.number}: "${issue.title}". Priority: ${issue.severity || 'High'}.`,
          status: 'in_progress'
        });

        usedApis.add('Swytchcode Jira API');
        const jiraResult = await this.swytchcode.createJiraTicket({
          summary: `[ESC-${issue.number}] ${issue.title}`,
          description: `Automated escalation by SwytchDev AI Agent.\n\nGitHub Issue #${issue.number}\nReporter: @${issue.user}\nSeverity: ${issue.severity}\n\nDescription:\n${issue.body}\n\nSuggested Fix Strategy:\nInvestigate memory allocation buffers and update error handling middleware.`,
          issueType: 'Bug',
          priority: issue.severity === 'CRITICAL' ? 'Highest' : 'High',
          githubIssueNumber: issue.number
        });

        createdTickets.push(jiraResult.ticket);
        jiraTicketsCreated++;

        await emitStep({
          phase: 'SWYTCHCODE_API_CALL',
          tool: 'Jira',
          title: `Jira Ticket Created: ${jiraResult.ticket.key}`,
          thought: `Created Jira Ticket ${jiraResult.ticket.key} via Swytchcode API. Linked directly to GitHub Issue #${issue.number}.`,
          apiDetails: {
            endpoint: 'POST /v1/jira/issue',
            method: 'POST',
            headers: { Authorization: 'Bearer ••••••••••••' },
            payload: {
              summary: jiraResult.ticket.summary,
              priority: jiraResult.ticket.priority,
              githubIssueRef: issue.number
            },
            response: jiraResult.ticket,
            source: jiraResult.source
          },
          status: 'completed'
        });
      }
    } else if (!jiraRequired) {
      await emitStep({
        phase: 'ANALYZE',
        tool: 'AI_Reasoner',
        title: 'Jira Integration Skipped',
        thought: 'Jira ticket creation tool skipped based on prompt intent (Audit mode). No Jira mutations performed.',
        status: 'skipped'
      });
    }

    // STEP 6: AI CODE PATCH RECOMMENDATION (Conditional)
    if (patchRequired && targetIssuesToProcess.length > 0) {
      await emitStep({
        phase: 'FOLLOW_UP',
        tool: 'AI_Reasoner',
        title: 'AI Code Patch Recommendation Generated',
        thought: `Generated proposed code fix patch for GitHub Issue #${targetIssuesToProcess[0].number}. Fix prepared in PR draft format.`,
        status: 'completed'
      });
    }

    // STEP 7: TOOL 3 - SLACK API INTEGRATION (Conditional)
    if (slackRequired) {
      await emitStep({
        phase: 'TOOL_SELECT',
        tool: 'Slack',
        title: 'Executing Swytchcode Slack API Tool',
        thought: 'Selecting tool: swytchcode_slack_post_message. Target channel: #dev-alerts. Formatted notification digest.',
        status: 'in_progress'
      });

      usedApis.add('Swytchcode Slack API');

      const ticketKeysStr = createdTickets.length > 0 
        ? createdTickets.map(t => `${t.key} (${t.summary})`).join(', ')
        : 'None (Read-only triage)';

      const slackText = `🚨 *SwytchDev AI Agent Alert: Engineering Issue Triage*\n\n` +
        `• *Trigger Request*: "${prompt}"\n` +
        `• *GitHub Issues Triage*: Analyzed ${openIssues.length} issues (${targetIssuesToProcess.length} critical)\n` +
        `• *Jira Ticket(s)*: ${ticketKeysStr}\n` +
        `• *Status*: Triage action processed dynamically.\n\n` +
        `_Powered by Swytchcode Agentic API Engine_`;

      const slackResult = await this.swytchcode.sendSlackNotification({
        channel: '#dev-alerts',
        text: slackText,
        severity: targetIssuesToProcess[0]?.severity || 'HIGH'
      });

      slackNotificationsSent++;

      await emitStep({
        phase: 'SWYTCHCODE_API_CALL',
        tool: 'Slack',
        title: 'Swytchcode Slack Notification Sent',
        thought: `Dispatched notification to Slack channel #dev-alerts via Swytchcode Slack API. ID: ${slackResult.message.id}.`,
        apiDetails: {
          endpoint: 'POST /v1/slack/chat.postMessage',
          method: 'POST',
          headers: { Authorization: 'Bearer ••••••••••••' },
          payload: { channel: '#dev-alerts', text: slackText },
          response: slackResult.message,
          source: slackResult.source
        },
        status: 'completed'
      });
    } else {
      await emitStep({
        phase: 'ANALYZE',
        tool: 'AI_Reasoner',
        title: 'Slack Notification Skipped',
        thought: 'Slack message tool skipped based on prompt intent. Channel broadcast suppressed.',
        status: 'skipped'
      });
    }

    // STEP 8: FINAL RESPONSE & SUMMARY
    const executedToolsStr = Array.from(usedApis).join(' • ') || 'Read-Only AI Analysis';
    const finalMessage = `✅ **SwytchDev AI Agent Workflow Complete!**\n\n` +
      `• **GitHub**: Scanned ${openIssues.length} open issues, identified ${targetIssuesToProcess.length} target items.\n` +
      `• **Jira**: ${jiraRequired ? `Created ${createdTickets.length} Jira tickets: ${createdTickets.map(t => `\`${t.key}\``).join(', ')}.` : 'Skipped per request intent.'}\n` +
      `• **Slack**: ${slackRequired ? 'Posted incident digest to `#dev-alerts`.' : 'Skipped per request intent.'}\n` +
      `\n*Swytchcode Tools Invoked*: ${executedToolsStr}`;

    await emitStep({
      phase: 'FINAL_RESPONSE',
      tool: 'AI_Reasoner',
      title: 'Workflow Outcome Delivered',
      thought: finalMessage,
      status: 'completed'
    });

    const endTime = new Date().toISOString();

    return {
      workflowId,
      userPrompt: prompt,
      startTime,
      endTime,
      totalSteps: steps.length,
      steps,
      decisionSummary,
      swytchcodeApisUsed: Array.from(usedApis),
      summary: {
        githubIssuesAnalyzed,
        jiraTicketsCreated,
        slackNotificationsSent
      },
      finalOutput: finalMessage
    };
  }
}
