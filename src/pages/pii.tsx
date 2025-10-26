export const demoPIIDetections: PIIDetection[] = [
  {
    id: 'pii-2025-1847',
    timestamp: '2025-10-26T14:54:22Z',
    pii_type: 'SSN',
    confidence_score: 98.7,
    action_taken: 'redacted',
    defense_layer: 2,
    user_id: 'user@example.com',
    provider: 'Claude 3.5 Sonnet',
    severity: 'CRITICAL',
    original_text_hash: 'a8f3bc9e2d1...' // Never store actual PII
  },
  {
    id: 'pii-2025-1846',
    timestamp: '2025-10-26T14:53:18Z',
    pii_type: 'Credit Card',
    confidence_score: 99.2,
    action_taken: 'blocked',
    defense_layer: 2,
    user_id: 'developer@company.com',
    provider: 'GPT-4',
    severity: 'CRITICAL',
    original_text_hash: 'b7d2ea4f1c8...'
  },
  // Add more demo data...
];

export const demoPIITypes = [
  { type: 'SSN', count: 342, percentage: 18.5 },
  { type: 'Credit Card', count: 189, percentage: 10.2 },
  { type: 'Email', count: 456, percentage: 24.7 },
  { type: 'Phone', count: 234, percentage: 12.7 },
  { type: 'Address', count: 178, percentage: 9.6 },
  { type: 'Date of Birth', count: 123, percentage: 6.7 },
  { type: 'Bank Account', count: 89, percentage: 4.8 },
  { type: 'Passport', count: 67, percentage: 3.6 },
  { type: 'Medical Record', count: 95, percentage: 5.1 },
  { type: 'Other', count: 74, percentage: 4.0 }
];
