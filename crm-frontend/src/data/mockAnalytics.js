// Real estate CRM analytics mock data

// Monthly lead growth trends (Line Chart)
export const MONTHLY_LEADS_DATA = [
  { month: 'Jan', leads: 20 },
  { month: 'Feb', leads: 28 },
  { month: 'Mar', leads: 35 },
  { month: 'Apr', leads: 42 },
  { month: 'May', leads: 50 },
  { month: 'Jun', leads: 58 },
  { month: 'Jul', leads: 66 },
  { month: 'Aug', leads: 72 }
];

// Lead source distribution ratios (Pie Chart)
export const LEAD_SOURCE_DATA = [
  { name: 'Website', value: 35, color: '#C6FF00' },
  { name: 'Referrals', value: 25, color: '#60A5FA' },
  { name: 'Facebook', value: 15, color: '#A78BFA' },
  { name: 'Instagram', value: 10, color: '#FB923C' },
  { name: 'Walk-in', value: 8, color: '#F43F5E' },
  { name: 'Property Portals', value: 7, color: '#34D399' }
];

// Lead status counts (Bar Chart)
export const LEAD_STATUS_DATA = [
  { status: 'New', count: 32, color: '#60A5FA' },
  { status: 'Contacted', count: 28, color: '#FBBF24' },
  { status: 'Site Visit', count: 19, color: '#A78BFA' },
  { status: 'Negotiating', count: 15, color: '#F97316' },
  { status: 'Closed Deal', count: 12, color: '#34D399' },
  { status: 'Not Interested', count: 22, color: '#EF4444' }
];

// Lead Conversion Funnel details
export const LEAD_FUNNEL_DATA = [
  { stage: 'New Leads', count: 128, percentage: 100, color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  { stage: 'Contacted', count: 96, percentage: 75, color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
  { stage: 'Site Visits', count: 52, percentage: 41, color: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
  { stage: 'Negotiations', count: 24, percentage: 19, color: 'bg-orange-500/10 border-orange-500/30 text-orange-400' },
  { stage: 'Closed Deals', count: 12, percentage: 9, color: 'bg-green-500/10 border-green-500/30 text-green-400' }
];

// Top performing sources ranked list
export const TOP_SOURCES_DATA = [
  { rank: 1, source: 'Website', count: 35, conversion: '32%', color: '#C6FF00' },
  { rank: 2, source: 'Referrals', count: 28, conversion: '45%', color: '#60A5FA' },
  { rank: 3, source: 'Facebook', count: 18, conversion: '18%', color: '#A78BFA' },
  { rank: 4, source: 'Instagram', count: 14, conversion: '22%', color: '#FB923C' },
  { rank: 5, source: 'Walk-in', count: 10, conversion: '40%', color: '#F43F5E' }
];

// Follow-up performance metrics
export const FOLLOW_UP_METRICS = {
  upcoming: 18,
  overdue: 6,
  completed: 42,
  successRate: 78
};

// Simulated Date Range KPI variations
export const DATE_RANGE_KPIS = {
  'Last 7 Days': [
    { label: 'Total Leads', value: '18', change: '+8%', positive: true },
    { label: 'Conversion Rate', value: '21%', change: '+3%', positive: true },
    { label: 'Average Response Time', value: '1.8 Days', change: '-0.4 Days', positive: true },
    { label: 'Site Visits Scheduled', value: '3', change: '+25%', positive: true },
    { label: 'Closed Deals', value: '2', change: '+0%', positive: true },
    { label: 'Revenue Potential', value: '₹1.2 Cr', change: '+5%', positive: true }
  ],
  'Last 30 Days': [
    { label: 'Total Leads', value: '45', change: '+10%', positive: true },
    { label: 'Conversion Rate', value: '23%', change: '+4%', positive: true },
    { label: 'Average Response Time', value: '2.1 Days', change: '-0.7 Days', positive: true },
    { label: 'Site Visits Scheduled', value: '8', change: '+12%', positive: true },
    { label: 'Closed Deals', value: '5', change: '+2%', positive: true },
    { label: 'Revenue Potential', value: '₹3.4 Cr', change: '+10%', positive: true }
  ],
  'Last 90 Days': [
    { label: 'Total Leads', value: '128', change: '+12%', positive: true },
    { label: 'Conversion Rate', value: '24%', change: '+5%', positive: true },
    { label: 'Average Response Time', value: '2.4 Days', change: '-1.0 Day', positive: true },
    { label: 'Site Visits Scheduled', value: '19', change: '+8%', positive: true },
    { label: 'Closed Deals', value: '12', change: '+3%', positive: true },
    { label: 'Revenue Potential', value: '₹8.5 Cr', change: '+15%', positive: true }
  ],
  'This Year': [
    { label: 'Total Leads', value: '480', change: '+22%', positive: true },
    { label: 'Conversion Rate', value: '25%', change: '+6%', positive: true },
    { label: 'Average Response Time', value: '2.6 Days', change: '-1.2 Days', positive: true },
    { label: 'Site Visits Scheduled', value: '74', change: '+18%', positive: true },
    { label: 'Closed Deals', value: '42', change: '+9%', positive: true },
    { label: 'Revenue Potential', value: '₹28.4 Cr', change: '+28%', positive: true }
  ]
};

// Insights & Recommendations
export const BUSINESS_INSIGHTS = [
  { id: 1, type: 'success', text: 'Website leads have the highest conversion rate at 32% this quarter.' },
  { id: 2, type: 'info', text: 'Referral leads convert 30% faster than online advertising campaigns.' },
  { id: 3, type: 'warning', text: 'Overdue follow-ups increased by 10% in the last 7 days. Check agent allocations.' },
  { id: 4, type: 'recommend', text: 'Consider increasing Facebook ad spend; Instagram leads show rising engagement metrics.' }
];
