import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { SwytchDevAgent, AgentExecutionStep } from './agent/agentEngine';
import { SwytchcodeService } from './services/swytchcodeService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const agent = new SwytchDevAgent();
const swytchcode = new SwytchcodeService();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    agent: 'SwytchDev AI Software Engineer',
    version: '1.0.0',
    swytchcodeApis: ['GitHub', 'Jira', 'Slack'],
    mode: process.env.SWYTCHCODE_API_KEY ? 'Live API' : 'Sandbox / Mock Mode'
  });
});

// Run Agent Workflow (Synchronous execution)
app.post('/api/agent/run', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await agent.runWorkflow(prompt);
    return res.json(result);
  } catch (error: any) {
    console.error('Error running agent workflow:', error);
    return res.status(500).json({ error: error.message || 'Internal Agent Error' });
  }
});

// Stream Agent Execution (SSE - Server-Sent Events for Live Judge Demo)
app.get('/api/agent/stream', async (req, res) => {
  const prompt = (req.query.prompt as string) || 'Check high priority GitHub bugs, sync with Jira, and notify Slack team.';

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    sendEvent({ type: 'START', prompt });

    const result = await agent.runWorkflow(prompt, (step: AgentExecutionStep) => {
      sendEvent({ type: 'STEP', step });
    });

    sendEvent({ type: 'COMPLETE', result });
    res.end();
  } catch (err: any) {
    sendEvent({ type: 'ERROR', error: err.message });
    res.end();
  }
});

// Data endpoints for interactive board views
app.get('/api/github/issues', async (req, res) => {
  const issues = await swytchcode.fetchGithubIssues();
  res.json(issues);
});

app.get('/api/jira/tickets', async (req, res) => {
  const tickets = await swytchcode.fetchJiraTickets();
  res.json(tickets);
});

app.get('/api/slack/messages', async (req, res) => {
  const msgs = await swytchcode.fetchSlackMessages();
  res.json(msgs);
});

app.listen(PORT, () => {
  console.log(`🚀 SwytchDev AI Agent Backend running on http://localhost:${PORT}`);
});
