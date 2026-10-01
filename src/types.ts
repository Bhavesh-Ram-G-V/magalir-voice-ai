export type SchemeId = 'maternity' | 'magalir_urimai' | 'skill_training' | 'child_vaccine' | 'unclear';

export interface SchemeInfo {
  id: SchemeId;
  titleTa: string;
  subtitleTa: string;
  benefitAmountTa: string;
  targetLocationTa: string;
  requiredDocsTa: string[];
  icon: string;
  badgeColor: string;
  borderColor: string;
  accentBg: string;
  exampleQueriesTa: string[];
}

export interface ChatResponse {
  speechText: string;
  detectedScheme: SchemeId;
  schemeTitleTa: string;
  targetLocationTa: string;
  requiredDocsTa: string[];
  benefitSummaryTa: string;
  error?: string;
}

export interface MessageRecord {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  schemeId?: SchemeId;
  schemeTitle?: string;
  location?: string;
  docs?: string[];
}
