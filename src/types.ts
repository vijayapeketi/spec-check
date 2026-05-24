/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Constraint {
  id: string;
  category: string;
  statement: string;
  sourceText: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

export interface EvaluationResult {
  constraintId: string;
  status: "COMPLIANT" | "VIOLATED" | "NOT_REFERENCED" | "NOT_APPLICABLE";
  observedValue: string;
  evidence: string;
}

export interface FailureModeScore {
  score: number; // 0 (Worst/Heavy Bias) to 100 (Stellar/No Bias)
  description: string;
  finding: string;
}

export interface FailureModes {
  templateExecutionBias: FailureModeScore;
  silentConstraintOverride: FailureModeScore;
  singleVendorOutputTendency: FailureModeScore;
}

export interface Remediation {
  promptPatch: string;
  explanation: string;
  systemInstructionPatch: string;
}

export interface SafetyReport {
  verdict: "APPROVED" | "BLOCKED";
  score: number; // 0 - 100
  timestamp: string;
  evaluatorModel: string;
  metadata: {
    specTitle: string;
    targetSystem: string;
    failureModesDetectedCount: number;
    totalConstraints: number;
  };
  extractedConstraints: Constraint[];
  evaluations: EvaluationResult[];
  failureModes: FailureModes;
  evidenceTrail: string[];
  remediation: Remediation;
}

export interface ScenarioTemplate {
  id: string;
  title: string;
  targetSystem: string;
  specificationText: string;
  candidates: {
    id: string;
    label: string;
    type: "compliant" | "bias" | "override" | "vendor" | "custom";
    responseText: string;
    // Pre-calculated offline analysis for instant UI or fallback
    precalculatedReport: SafetyReport;
  }[];
}
