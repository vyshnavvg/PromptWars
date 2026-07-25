export type PersonaType = 'caregiver' | 'individual';

export interface CrisisResponse {
  headline: string;
  toneSummary: string;
  deEscalationScript: string[];
  physicalIntervention: string[];
  sosMessage: string;
  respirationPacing: {
    inhaleSec: number;
    holdSec: number;
    exhaleSec: number;
    guidance: string;
  };
  harmReductionTips: {
    category: string;
    title: string;
    description: string;
  }[];
  geminiMetadata: {
    latencyMs: number;
    model: string;
    safetyRatingsPassed: boolean;
    systemInstructionUsed: string;
    enforcedSchema: string;
  };
}

export interface PromptInspectorData {
  systemInstruction: string;
  enforcedSchema: string;
  latencyMs: number;
  safetySettings: { category: string; threshold: string }[];
  lastPromptSent: string;
  rawResponse: string;
}
