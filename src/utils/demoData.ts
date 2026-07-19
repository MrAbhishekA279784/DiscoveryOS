export const demoKpis = [
  { title: 'Total Feedback', value: '1,284', change: '12.5%', isPositive: true, type: 'feedback', iconName: 'MessageSquare', sparklineData: [40, 45, 38, 52, 48, 62, 58, 65, 74, 85, 80, 92] },
  { title: 'Pain Points Identified', value: '32', change: '8.3%', isPositive: true, type: 'painpoints', iconName: 'AlertTriangle', sparklineData: [20, 24, 22, 28, 25, 30, 28, 35, 31, 38, 34, 42] },
  { title: 'AI Accuracy', value: '96%', change: '4.2%', isPositive: true, type: 'accuracy', iconName: 'Target', sparklineData: [90, 91, 89, 92, 93, 92, 94, 95, 94, 96, 95, 96] },
  { title: 'Avg. Response Time', value: '1.2s', change: '-0.3s', isPositive: true, type: 'responsetime', iconName: 'Clock', sparklineData: [1.8, 1.7, 1.6, 1.5, 1.5, 1.4, 1.3, 1.3, 1.2, 1.2, 1.2, 1.2] }
];

export const demoPainPoints = [
  { id: '1', name: 'Offline Mode', count: 432, percentage: 33.6 },
  { id: '2', name: 'Dark Mode', count: 310, percentage: 24.1 },
  { id: '3', name: 'Navigation Issues', count: 220, percentage: 17.1 },
  { id: '4', name: 'Seat Search', count: 158, percentage: 12.3 },
  { id: '5', name: 'Price Transparency', count: 96, percentage: 7.5 },
  { id: '6', name: 'Language Support', count: 68, percentage: 5.4 }
];

export const demoSentiment = [
  { name: 'Positive', value: 512, percentage: 39.9, color: '#22C55E' },
  { name: 'Neutral', value: 423, percentage: 32.9, color: '#F59E0B' },
  { name: 'Negative', value: 278, percentage: 21.7, color: '#EF4444' },
  { name: 'Mixed', value: 71, percentage: 5.5, color: '#A855F7' }
];

export const demoFeedbackTrend = {
  daily: [
    { label: 'May 12', count: 120 },
    { label: 'May 13', count: 185 },
    { label: 'May 14', count: 150 },
    { label: 'May 15', count: 260 },
    { label: 'May 16', count: 420 },
    { label: 'May 17', count: 310 },
    { label: 'May 18', count: 340 },
    { label: 'May 19', count: 280 }
  ],
  weekly: [
    { label: 'Week 17', count: 850 },
    { label: 'Week 18', count: 980 },
    { label: 'Week 19', count: 1100 },
    { label: 'Week 20', count: 1284 }
  ]
};

export const demoRecommendations = [
  { id: 'r1', title: 'Prioritize Offline Mode', freqImpact: 'High frequency + High impact', confidence: 94, iconName: 'Sparkles' },
  { id: 'r2', title: 'Improve Navigation Flow', freqImpact: 'Medium frequency + High impact', confidence: 78, iconName: 'Zap' },
  { id: 'r3', title: 'Add Dark Mode Support', freqImpact: 'High frequency + Medium impact', confidence: 71, iconName: 'Moon' }
];

export const demoNotifications = [
  { id: 'n1', type: 'insight', title: 'New Pain Point Cluster Detected', description: 'Navigation issues in seat selection flow identified across 47 user sessions.', timestamp: '2 hours ago', isRead: false },
  { id: 'n2', type: 'system', title: 'Data Sync Complete', description: 'All 1,284 feedback items have been processed and indexed.', timestamp: '5 hours ago', isRead: false },
  { id: 'n3', type: 'alert', title: 'Sentiment Shift Alert', description: 'Negative sentiment increased by 3.2% in the last 24 hours.', timestamp: '1 day ago', isRead: true },
  { id: 'n4', type: 'insight', title: 'New Pattern Detected', description: 'Navigation-related issues cluster identified in seat selection flow.', timestamp: '2 days ago', isRead: true }
];

export const demoActivity = [
  { id: 'a1', user: 'User', action: 'uploaded', project: 'Customer Feedback Q2', timestamp: '2 hours ago' },
  { id: 'a2', user: 'User', action: 'analyzed', project: 'User Interviews May', timestamp: '4 hours ago' },
  { id: 'a3', user: 'User', action: 'generated report', project: 'Sentiment Analysis Q2', timestamp: '6 hours ago' },
  { id: 'a4', user: 'User', action: 'updated', project: 'Roadmap Priorities', timestamp: '1 day ago' },
  { id: 'a5', user: 'User', action: 'synced', project: 'Google Drive Connector', timestamp: '1 day ago' }
];

export const demoContextMemories = [
  { id: 'm1', key: 'Workspace Focus', value: 'Customer feedback analysis for StadiumIQ mobile app' },
  { id: 'm2', key: 'Recent Analysis', value: 'Processed 1,284 feedback items from May 12-19' },
  { id: 'm3', key: 'Top Priority', value: 'Offline mode implementation (432 mentions, 33.6%)' },
  { id: 'm4', key: 'Sentiment Trend', value: 'Positive 39.9%, Neutral 32.9%, Negative 21.7%' },
  { id: 'm5', key: 'Active Integrations', value: 'Google Drive, Notion, Jira, Slack, Linear' }
];

export const demoPromptTemplates = [
  { id: 'p1', title: 'Analyze Feedback', prompt: 'Analyze the latest feedback data and identify top 3 pain points with actionable recommendations.', category: 'analysis', icon: 'Search' },
  { id: 'p2', title: 'Generate Roadmap', prompt: 'Generate a product roadmap based on current pain points and sentiment analysis.', category: 'planning', icon: 'Compass' },
  { id: 'p3', title: 'Sentiment Summary', prompt: 'Summarize the current sentiment trends across all feedback sources.', category: 'analysis', icon: 'TrendingUp' },
  { id: 'p4', title: 'Export Report', prompt: 'Compile an executive summary report with all KPIs, pain points, and recommendations.', category: 'export', icon: 'FileText' }
];

export const demoFileConnectors = [
  { id: 'fc1', name: 'Google Drive', type: 'drive', volume: '2.4 GB', count: 847, status: 'synced' },
  { id: 'fc2', name: 'Notion Workspace', type: 'notion', volume: '1.1 GB', count: 423, status: 'synced' },
  { id: 'fc3', name: 'Jira Issues', type: 'jira', volume: '340 MB', count: 1289, status: 'synced' },
  { id: 'fc4', name: 'Slack Archives', type: 'slack', volume: '890 MB', count: 5602, status: 'synced' }
];

export const demoDataSources = [
  { id: 'ds1', serviceType: 'google_drive', name: 'Google Drive', status: 'connected', lastSyncAt: '2 min ago', health: 98, volume: '2.4 GB' },
  { id: 'ds2', serviceType: 'notion', name: 'Notion', status: 'connected', lastSyncAt: '5 min ago', health: 95, volume: '1.1 GB' },
  { id: 'ds3', serviceType: 'jira', name: 'Jira', status: 'connected', lastSyncAt: '1 hour ago', health: 92, volume: '340 MB' },
  { id: 'ds4', serviceType: 'slack', name: 'Slack', status: 'connected', lastSyncAt: '3 hours ago', health: 88, volume: '890 MB' },
  { id: 'ds5', serviceType: 'linear', name: 'Linear', status: 'connected', lastSyncAt: '1 day ago', health: 85, volume: '120 MB' },
  { id: 'ds6', serviceType: 'rest_api', name: 'REST API Gateway', status: 'connected', lastSyncAt: '2 days ago', health: 99, volume: '—' }
];

export const demoReports = [
  { id: 'r1', title: 'Executive Summary Q2 2025', format: 'pdf', createdAt: '2025-06-15T10:00:00Z', date: 'Jun 15, 2025', fileUrl: '#' },
  { id: 'r2', title: 'Sentiment Analysis Report', format: 'pdf', createdAt: '2025-06-10T14:30:00Z', date: 'Jun 10, 2025', fileUrl: '#' },
  { id: 'r3', title: 'Pain Points Deep Dive', format: 'pptx', createdAt: '2025-06-05T09:00:00Z', date: 'Jun 5, 2025', fileUrl: '#' },
  { id: 'r4', title: 'Feedback Raw Data Export', format: 'csv', createdAt: '2025-06-01T16:00:00Z', date: 'Jun 1, 2025', fileUrl: '#' }
];

export const demoProjects = [
  { id: 'p1', name: 'Offline Mode Implementation', description: 'Core offline SQLite state storage with atomic background sync loop', status: 'active', createdAt: '2025-05-01', deadline: '2025-08-15', risk: 'medium', progress: 65, members: 4, docs: 12, desc: 'Implement offline-first architecture with local SQLite storage and conflict resolution.' },
  { id: 'p2', name: 'Dark Mode Theme System', description: 'Universal dark mode with dynamic contrast-shifting themes', status: 'planning', createdAt: '2025-05-15', deadline: '2025-09-01', risk: 'low', progress: 0, members: 2, docs: 5, desc: 'Design and implement a comprehensive dark mode theme system.' },
  { id: 'p3', name: 'Navigation Refactor', description: 'Multi-panel workspace router with predictive caching', status: 'active', createdAt: '2025-06-01', deadline: '2025-08-30', risk: 'medium', progress: 25, members: 3, docs: 8, desc: 'Refactor navigation to support multi-panel workspace layout.' },
  { id: 'p4', name: 'PowerPoint Export Pipeline', description: 'Automated PPTX generation from dashboard data', status: 'planning', createdAt: '2025-06-10', deadline: '2025-09-01', risk: 'low', progress: 0, members: 2, docs: 3, desc: 'Build automated PowerPoint export pipeline for executive reports.' },
  { id: 'p5', name: 'AI Sentiment Classifier', description: 'Enhanced ML model for multi-language sentiment detection', status: 'active', createdAt: '2025-05-20', deadline: '2025-08-15', risk: 'medium', progress: 42, members: 5, docs: 15, desc: 'Train and deploy enhanced sentiment classification model.' }
];

export const demoSearchResults = [
  { id: 's1', title: 'Offline Mode Implementation Plan', source: 'Document', matchScore: 0.95, status: 'active', snippet: 'Technical specification for offline SQLite storage and sync engine...', createdAt: '2025-06-10' },
  { id: 's2', title: 'User Interview Transcripts May 2025', source: 'Document', matchScore: 0.88, status: 'active', snippet: 'Compiled transcripts from 47 user interview sessions...', createdAt: '2025-05-28' },
  { id: 's3', title: 'Sentiment Analysis Q2 Report', source: 'Report', matchScore: 0.82, status: 'active', snippet: 'Quarterly sentiment breakdown with positive 39.9%, neutral 32.9%...', createdAt: '2025-06-01' },
  { id: 's4', title: 'Navigation Flow Redesign Proposal', source: 'Document', matchScore: 0.76, status: 'active', snippet: 'Proposed redesign of the navigation flow to reduce user friction...', createdAt: '2025-05-15' }
];

export const demoCopilotResponses: Record<string, string> = {
  'what should we build next': 'Based on current pain point analysis, I recommend prioritizing **Offline Mode** (432 mentions, 33.6% of all feedback). This is the highest-impact feature request with strong user demand. Second priority should be **Dark Mode** (310 mentions, 24.1%), followed by **Navigation Flow improvements** (220 mentions, 17.1%). These three items represent 74.8% of all user feedback.',
  'show me user sentiment trend': 'Current sentiment breakdown across 1,284 feedback items:\n\n• **Positive**: 512 (39.9%) — Users appreciate the core functionality\n• **Neutral**: 423 (32.9%) — Mixed feedback on recent updates\n• **Negative**: 278 (21.7%) — Mainly around offline capability\n• **Mixed**: 71 (5.5%) — Feature-specific concerns\n\nThe trend shows a +12.5% increase in feedback volume compared to last period, with positive sentiment holding steady.',
  'summarize interview insights': 'Based on 47 user interview sessions conducted in May 2025:\n\n**Key Findings:**\n1. **Offline Mode** is the #1 requested feature (33.6% of mentions)\n2. **Dark Mode** is highly desired by night-shift users (24.1%)\n3. **Navigation** friction points in seat selection flow (17.1%)\n4. **Price transparency** concerns from 7.5% of users\n\n**Recommendation:** Prioritize offline mode development in Q3 2026.',
  'find top pain points': 'Top pain points ranked by user mentions:\n\n1. **Offline Mode** — 432 mentions (33.6%) — High impact\n2. **Dark Mode** — 310 mentions (24.1%) — High impact\n3. **Navigation Issues** — 220 mentions (17.1%) — Medium impact\n4. **Seat Search** — 158 mentions (12.3%) — Medium impact\n5. **Price Transparency** — 96 mentions (7.5%) — Low impact\n6. **Language Support** — 68 mentions (5.4%) — Low impact\n\nTotal: 1,284 feedback items analyzed.'
};

export const demoCopilotFallback = `I've analyzed your workspace data. Here's what I found:

**Key Insights:**
- **1,284 feedback items** processed across all sources
- **Top pain point**: Offline Mode (432 mentions, 33.6%)
- **Sentiment**: 39.9% positive, 32.9% neutral, 21.7% negative
- **AI accuracy**: 96% across all classifications

**Recommendations:**
1. Prioritize Offline Mode development (94% confidence)
2. Improve Navigation Flow (78% confidence)
3. Add Dark Mode support (71% confidence)

How can I help you further?`;

export const demoSearchFallback = [
  { id: 's1', title: 'Offline Mode Implementation Plan', source: 'Document', matchScore: 0.95, status: 'active', snippet: 'Technical specification for offline SQLite storage and sync engine...', createdAt: '2025-06-10' },
  { id: 's2', title: 'User Interview Transcripts May 2025', source: 'Document', matchScore: 0.88, status: 'active', snippet: 'Compiled transcripts from 47 user interview sessions...', createdAt: '2025-05-28' },
  { id: 's3', title: 'Sentiment Analysis Q2 Report', source: 'Report', matchScore: 0.82, status: 'active', snippet: 'Quarterly sentiment breakdown with positive 39.9%, neutral 32.9%...', createdAt: '2025-06-01' },
  { id: 's4', title: 'Navigation Flow Redesign Proposal', source: 'Document', matchScore: 0.76, status: 'active', snippet: 'Proposed redesign of the navigation flow to reduce user friction...', createdAt: '2025-05-15' }
];

export const demoAnalytics = {
  kpis: { feedback: 1284, painPoints: 32, accuracy: 96, responseTime: 1.2 },
  trends: [
    { label: 'Week 17', feedback: 850, sentiment: 72 },
    { label: 'Week 18', feedback: 980, sentiment: 68 },
    { label: 'Week 19', feedback: 1100, sentiment: 74 },
    { label: 'Week 20', feedback: 1284, sentiment: 71 }
  ],
  metadata: {}
};

export const demoWorkspaces = [
  { id: 'ws-1', name: 'StadiumIQ', slug: 'stadium-iq-enterprise', description: 'Customer feedback analysis for StadiumIQ mobile app' }
];

export const demoSettings = {
  workspaceSlug: 'stadium-iq-enterprise',
  aiModelVersion: 'Discovery-v3.5-Omni-Pro (Staging)',
  syncInterval: 'Real-Time Push Hooks',
  storageUsage: 42,
  tokenUsage: 13,
  stripeSubscription: { tier: 'Pro', plan: 'StadiumIQ Pro Tier', monthlyPrice: 490 },
  environmentStatus: [
    { label: 'Gemini Keys API', value: 'Active', color: 'emerald' },
    { label: 'Cloud Run Ingress', value: 'Connected', color: 'emerald' },
    { label: 'Linear Sync Integration', value: 'Idle', color: 'amber' },
    { label: 'OAuth Gateway', value: 'Configured', color: 'purple' },
    { label: 'DB Cluster Replica', value: '99.99% Up', color: 'emerald' },
    { label: 'Secure Socket Layers', value: 'Active', color: 'emerald' }
  ]
};

import { FileItem } from '../types';

export const demoFiles: FileItem[] = [
  { id: 'f1', name: 'user_interviews_may_2025.mp4', size: '2.4 GB', type: 'video', timestamp: '2 hours ago' },
  { id: 'f2', name: 'customer_survey_q2_2025.csv', size: '1.2 MB', type: 'csv', timestamp: '5 hours ago' },
  { id: 'f3', name: 'support_tickets_export.xlsx', size: '4.8 MB', type: 'xlsx', timestamp: '1 day ago' },
  { id: 'f4', name: 'user_session_recordings.json', size: '890 KB', type: 'json', timestamp: '2 days ago' },
  { id: 'f5', name: 'nps_survey_results.csv', size: '2.1 MB', type: 'csv', timestamp: '3 days ago' }
];
