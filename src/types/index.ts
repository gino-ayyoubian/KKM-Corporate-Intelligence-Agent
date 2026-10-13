/**
 * KKM Corporate Intelligence Agent v3.0
 * Type Definitions & System Contracts
 */

export type Language = 'en' | 'fa';

export type EngineMode = 'gemini' | 'simulated';

export type ModuleId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';

export interface ModuleInfo {
  id: ModuleId;
  code: string;
  titleEn: string;
  titleFa: string;
  descEn: string;
  descFa: string;
  recordCount: number;
  activeTopicsEn: string[];
  activeTopicsFa: string[];
}

export type ClassificationLevel = 'Public-Sample' | 'Internal-Controlled' | 'Confidential-Audit';

export type VerificationStatus =
  | 'Verified Record'
  | 'Illustrative (Unverified)'
  | 'Engineering Estimate'
  | 'Simulation Concept (Unvalidated)';

export interface EvidenceRecord {
  recordId: string;
  moduleId: ModuleId;
  titleEn: string;
  titleFa: string;
  date: string; // ISO YYYY-MM-DD
  classification: ClassificationLevel;
  verificationStatus: VerificationStatus;
  confidenceScore: number; // 0 - 100
  scopeLimitationsEn: string;
  scopeLimitationsFa: string;
  summaryEn: string;
  summaryFa: string;
  fullExcerptEn: string;
  fullExcerptFa: string;
  authorRole: string;
  metrics?: { label: string; value: string; verified: boolean }[];
}

export interface SensitiveAction {
  id: string;
  title: string;
  category: 'capex' | 'ip_filing' | 'field_test' | 'governance' | 'infrastructure';
  scope: string;
  expectedImpact: string;
  rollbackPlan: string;
  verificationSteps: string[];
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  decidedAt?: string;
  decidedBy?: string;
  notes?: string;
}

export interface EpistemicBreakdown {
  facts: string[];
  inferences: string[];
  assumptions: string[];
  estimates: string[];
  recommendations: string[];
  openIssues: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  timestamp: string;
  moduleId: ModuleId;
  content: string;
  engineMode: EngineMode;
  citations: string[]; // recordIds
  epistemicBreakdown?: EpistemicBreakdown;
  sensitiveActionProposal?: SensitiveAction;
}

export interface StrategicAlternative {
  option: string;
  pros: string;
  cons: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface RiskMatrixItem {
  category: string;
  description: string;
  mitigation: string;
  residualRisk: 'low' | 'medium' | 'high';
}

export interface ActionPlanItem {
  id: string;
  action: string;
  owner: string;
  dependencies: string;
  risks: string;
  acceptanceCriteria: string;
}

export interface DecisionReport {
  id: string;
  title: string;
  moduleId: ModuleId;
  language: Language;
  createdAt: string;
  status: 'Draft' | 'Finalized' | 'Pending Human Sign-off';
  executiveConclusion: string;
  referencedEvidence: string[]; // record IDs; references are not proof of verification
  strategicAlternatives: StrategicAlternative[];
  riskMatrix: RiskMatrixItem[];
  recommendation: string;
  actionPlan: ActionPlanItem[];
  openIssues: string[];
  requiresHumanApproval: boolean;
  approvalStatus?: 'Not Required' | 'Pending' | 'Approved' | 'Rejected';
}

export interface PortfolioProject {
  id: string;
  code: string;
  nameEn: string;
  nameFa: string;
  moduleId: ModuleId;
  trl: number; // 1 to 9
  validationType: 'Simulation & Concept' | 'Lab Bench Test' | 'Field Validated (Sample)';
  status: string;
  descriptionEn: string;
  descriptionFa: string;
  leadRole: string;
  budgetSample: string;
  risks: string[];
}

export interface EvaluationCase {
  id: string;
  title: string;
  category: 'Epistemic Distinction' | 'Language Fidelity' | 'Human Sign-off' | 'Hallucination Boundary' | 'Security & Credential Protection';
  prompt: string;
  expectedBehavior: string;
  verificationCheck: string;
  result: 'passed' | 'warning' | 'failed';
  details: string;
}

export interface EvaluationResult {
  totalTests: number;
  passedTests: number;
  warningTests: number;
  failedTests: number;
  cases: EvaluationCase[];
  evaluatedAt: string;
}
