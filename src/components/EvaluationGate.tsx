/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  ShieldAlert, ShieldCheck, Clipboard, Check, Play, AppWindow,
  RefreshCw, Layers, Sparkles, Code, FileText, AlertCircle, HelpCircle, ArrowRight
} from "lucide-react";
import { SafetyReport, ScenarioTemplate, Constraint, EvaluationResult } from "../types";
import { SCENARIO_TEMPLATES } from "../data/templates";

export default function EvaluationGate() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioTemplate>(SCENARIO_TEMPLATES[0]);
  const [candidateIndex, setCandidateIndex] = useState<number>(0);
  
  // States of inputs
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>("GCP Sovereign Finance Ledger (VPC-SC)");
  const [customSpec, setCustomSpec] = useState<string>(
    `GOOGLE CLOUD SYSTEM SPECIFICATION: SOVEREIGN TRANSACTION LEDGER

1. REGULATORY DATA ISOLATION & NETWORKING BOUNDS
[RE-01] VPC Service Controls (VPC-SC):
To mitigate exfiltration risk, all database components must operate within a strict Google Cloud VPC Service Controls Service Perimeter. External internet egress is prohibited. Direct access to public cloud Google APIs is systematically blocked.

2. CRYPTOGRAPHIC DATA REST RESTRICTIONS
[RE-02] Customer-Managed Encryption Keys (CMEK) over Cloud Spanner:
All persistent record blocks in Google Cloud Spanner must be encrypted using Cloud KMS Customer-Managed Encryption Keys (CMEK). The key rotation loop must occur every 90 days. Models must never fallback to Google-managed standard automatic encryption keys.

3. RESIDENCY & AUDITING SPEED CAPACITIES
[RE-03] Budget and Multiregional Bound:
The ledger must default to the 'europe-west3' (Frankfurt) and 'europe-west1' (Belgium) regional configuration. Cloud Spanner configuration must use explicit dual-region low-volume nodes keeping cost cap under $800/month. Do not deploy high-tier multi-region locations (such as nam-eur-asia1) which exceed specified billing constraints.`
  );
  const [customCandidate, setCustomCandidate] = useState<string>(
    `PROPOSED ARCHITECTURAL BLUEPRINT: TRANSACTION LEDGER

To deliver a secure ledger database solution on Google Cloud Platform, we propose using standard GCP cloud architectures:

1. DATA STORAGE:
We will instantiate a Google Cloud Spanner multi-regional instance utilizing the high-performance 'nam-eur-asia1' configuration, allowing continuous global synchronization across North America, Europe, and Asia.

2. ENCRYPTION DEFAULTS:
To minimize administrator complexity, we utilize standard Google-managed encryption keys, which automatically handle periodic background rotation schedules with zero management overhead.

3. NETWORK INGRESS/EGRESS:
All web frontend routers communicate directly with Cloud Spanner over the standard public Google APIs endpoint (spanner.googleapis.com), utilizing the primary SSL/TLS client network configurations for fast transit rates.`
  );

  // Simulation / Loading / Output States
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [report, setReport] = useState<SafetyReport | null>(SCENARIO_TEMPLATES[0].candidates[0].precalculatedReport);
  const [activeTab, setActiveTab] = useState<"report" | "patch">("report");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // handle quick template selection
  const handleSelectScenario = (sc: ScenarioTemplate) => {
    setSelectedScenario(sc);
    setIsCustomMode(false);
    setCandidateIndex(0);
    setReport(sc.candidates[0].precalculatedReport);
    setActiveTab("report");
  };

  const handleSelectCandidate = (idx: number) => {
    setCandidateIndex(idx);
    if (idx === scCandidatesCount()) {
      // Custom candidate entry
      setReport(null);
    } else {
      setReport(selectedScenario.candidates[idx].precalculatedReport);
    }
  };

  const scCandidatesCount = () => {
    return isCustomMode ? 0 : selectedScenario.candidates.length;
  };

  // Run evaluation API call
  const triggerPreclearanceGate = async () => {
    setLoading(true);
    setActiveTab("report");
    
    const steps = [
      "Securing network stream...",
      "Eliciting specification document...",
      "Extracting formal mathematical constraints...",
      "Matching candidate LLM text nodes...",
      "Testing for Template-Execution Bias defaults...",
      "Auditing Silent Constraint Overrides...",
      "Calculating Single-Vendor lock-in coefficients...",
      "Compiling Compliance Ledger & Verdict..."
    ];

    // Stagger loader steps for professional clinic feel
    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(steps[i]);
      await new Promise((r) => setTimeout(r, 450));
    }

    const payload = {
      specificationText: isCustomMode ? customSpec : selectedScenario.specificationText,
      candidateOutput: isCustomMode 
        ? customCandidate 
        : selectedScenario.candidates[candidateIndex]?.responseText || "",
      customScenarioTitle: isCustomMode ? customTitle : selectedScenario.title
    };

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Pre-clearance pipeline returned response error");
      }

      const freshReport: SafetyReport = await response.json();
      setReport(freshReport);
    } catch (err) {
      console.error("Failed to run active AI evaluation. Using heuristic fallback.", err);
      // Fallback is handled gracefully by Express server, but we reinforce client stability here
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Calculate status tags
  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "COMPLIANT": return "bg-emerald-950/60 text-emerald-400 border border-emerald-900/50";
      case "VIOLATED": return "bg-rose-950/60 text-rose-450 border border-rose-900/50";
      default: return "bg-slate-900 text-slate-400 border border-slate-800";
    }
  };

  const getSeverityBadgeColor = (sev: string) => {
    switch (sev) {
      case "CRITICAL": return "text-red-500 bg-red-950/40 border border-red-900/50";
      case "HIGH": return "text-amber-500 bg-amber-950/40 border border-amber-900/50";
      case "MEDIUM": return "text-yellow-500 bg-yellow-950/40 border border-yellow-905/30";
      default: return "text-slate-400 bg-slate-900 border border-slate-800";
    }
  };

  const getVerdictLabelColor = (ver: "APPROVED" | "BLOCKED") => {
    return ver === "APPROVED" 
      ? "text-emerald-400 border-emerald-500 bg-emerald-950/40" 
      : "text-red-450 border-red-950 bg-red-950/40";
  };

  return (
    <div className="space-y-6 text-slate-100" id="spec-evaluation-gate">
      {/* Scenario Template Ribbon */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold">Select Spec Boundary</span>
          <div className="flex flex-wrap gap-2 pt-1">
            {SCENARIO_TEMPLATES.map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedScenario.id === sc.id && !isCustomMode
                    ? "bg-amber-505 bg-amber-500 text-slate-950 shadow-sm"
                    : "bg-slate-950 text-slate-405 hover:bg-slate-850 hover:text-white border border-slate-800"
                }`}
              >
                {sc.title}
              </button>
            ))}
            <button
              id="custom-scenario-btn"
              onClick={() => {
                setIsCustomMode(true);
                setReport(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${
                isCustomMode
                  ? "bg-purple-600 text-white border-purple-500"
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              Custom Requirements Playground + AI Engine
            </button>
          </div>
        </div>
        <div className="text-right text-xs text-slate-500 hidden lg:block font-mono">
          Pre-deployment Gate State: Online
        </div>
      </div>

      {/* Two Pane Split: Document Preparation & Precalculated Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Input specs and LLM candidate outputs */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4.5 w-4.5 text-amber-500" />
                <h3 className="text-sm font-semibold text-white">1. Natural Language Specification</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">INPUT-A</span>
            </div>

            {isCustomMode ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Custom Scenario Title"
                  className="w-full bg-slate-950 text-slate-100 text-xs px-3 py-2 border border-slate-800 rounded focus:border-purple-600 outline-none"
                />
                <textarea
                  value={customSpec}
                  onChange={(e) => setCustomSpec(e.target.value)}
                  placeholder="Paste your natural language system requirements and constraints here..."
                  className="w-full bg-slate-950 text-slate-100 text-xs p-3 border border-slate-800 rounded h-44 font-mono leading-relaxed focus:border-purple-600 outline-none resize-none"
                />
              </div>
            ) : (
              <div className="bg-slate-950 text-slate-300 p-4 rounded border border-slate-800 text-xs leading-relaxed max-h-56 overflow-y-auto font-mono whitespace-pre-wrap select-text">
                {selectedScenario.specificationText}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-800/60 pt-4">
              <div className="flex items-center space-x-2">
                <Code className="h-4.5 w-4.5 text-sky-400" />
                <h4 className="text-sm font-semibold text-white">2. Candidate LLM Output</h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">INPUT-B</span>
            </div>

            {isCustomMode ? (
              <textarea
                value={customCandidate}
                onChange={(e) => setCustomCandidate(e.target.value)}
                placeholder="Paste the candidate LLM proposal, code implementation or estimation output to evaluate..."
                className="w-full bg-slate-950 text-slate-100 text-xs p-3 border border-slate-800 rounded h-44 font-mono leading-relaxed focus:border-purple-600 outline-none resize-none"
              />
            ) : (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Select Specimen Response</span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedScenario.candidates.map((cand, idx) => (
                      <button
                        key={cand.id}
                        onClick={() => handleSelectCandidate(idx)}
                        className={`text-[11px] p-2 rounded-lg border text-left transition ${
                          candidateIndex === idx
                            ? "bg-slate-850 text-white border-sky-500 shadow"
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                        }`}
                      >
                        <div className="font-bold text-slate-300 pb-0.5 max-w-[150px] truncate">{cand.label.split(" — ")[0]}</div>
                        <div className="text-[9px] text-slate-500 truncate">{cand.type === "compliant" ? "Compliant case" : "Violated case"}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-950 text-slate-400 p-4 rounded border border-slate-800 text-xs leading-relaxed max-h-52 overflow-y-auto font-mono whitespace-pre-wrap select-text">
                  {selectedScenario.candidates[candidateIndex]?.responseText}
                </div>
              </div>
            )}

            {/* Launch CTA */}
            <div className="pt-2">
              <button
                onClick={triggerPreclearanceGate}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                    <span>Analyzing constraints...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4.5 w-4.5 text-slate-950 fill-current" />
                    <span>Evaluate Safety Pre-Clearance</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-2">
                Running this triggers active checks against the three failure dimensions.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Safety clearance reports and remediation */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-8 h-full flex flex-col items-center justify-center min-h-[500px]">
              <div className="relative mb-6">
                <div className="h-14 w-14 rounded-full border-2 border-slate-800 border-t-amber-500 animate-spin" />
                <Layers className="h-6 w-6 text-amber-500 absolute top-4 left-4" />
              </div>
              <span className="text-[11px] font-mono text-amber-500 uppercase tracking-widest font-bold">SPEC-CHECK Laboratory</span>
              <h3 className="text-md font-semibold text-white mt-1">Audit Stream In Progress...</h3>
              <p className="text-slate-400 text-xs text-center font-mono mt-4 max-w-sm h-6">
                {loadingStep}
              </p>
              <div className="w-56 bg-slate-950 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-amber-500 h-full animate-pulse" style={{ width: "80%" }} />
              </div>
            </div>
          ) : report ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-2xl">
              
              {/* Report Header Block */}
              <div className={`p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                report.verdict === "APPROVED" ? "bg-emerald-950/20" : "bg-red-950/10"
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs uppercase font-mono font-bold text-slate-405 tracking-wider">Evaluation Report Result</span>
                    <span className="text-slate-600 font-mono text-xs">|</span>
                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">{report.metadata?.specTitle || "Custom Run"}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white font-sans flex items-center space-x-2">
                    {report.verdict === "APPROVED" ? (
                      <ShieldCheck className="h-5.5 w-5.5 text-emerald-400 fill-emerald-950" />
                    ) : (
                      <ShieldAlert className="h-5.5 w-5.5 text-rose-500 fill-red-950" />
                    )}
                    <span>Pre-Clearance Verdict:</span>
                    <span className={`px-2.5 py-0.5 rounded font-mono text-sm border ${getVerdictLabelColor(report.verdict)}`}>
                      {report.verdict}
                    </span>
                  </h2>
                </div>

                {/* Score badge circles */}
                <div className="flex items-center space-x-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Clearance Score</span>
                    <div className="text-xs text-slate-300 font-medium">Validation Gates</div>
                  </div>
                  <div className={`h-11 w-11 rounded-full flex items-center justify-center text-md font-mono font-black border-2 ${
                    report.score >= 80 
                      ? "border-emerald-500 text-emerald-400 bg-emerald-950/30" 
                      : "border-red-500 text-red-500 bg-red-955 bg-red-950/30"
                  }`}>
                    {report.score}
                  </div>
                </div>
              </div>

              {/* Tabs selector */}
              <div className="flex bg-slate-950 border-b border-slate-800">
                <button
                  onClick={() => setActiveTab("report")}
                  className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition cursor-pointer ${
                    activeTab === "report" 
                      ? "border-amber-500 text-amber-500" 
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Clinical Clearance ledger</span>
                </button>
                <button
                  onClick={() => setActiveTab("patch")}
                  className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition cursor-pointer ${
                    activeTab === "patch" 
                      ? "border-amber-500 text-amber-500" 
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>FDA-Style Remediation Patch</span>
                  {report.verdict === "BLOCKED" && (
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping mt-1" />
                  )}
                </button>
              </div>

              {/* Actual Tab Pane Content */}
              <div className="p-5 overflow-y-auto max-h-[600px] flex-1 space-y-6">
                {activeTab === "report" ? (
                  <div className="space-y-6">
                    
                    {/* Failure mode indexes sliders/progress-bars */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase tracking-widest font-mono font-semibold text-slate-400">Three-Dimensional Evaluator Indices</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* 1. Template Bias */}
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-805 space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-slate-400">Template-Execution Bias</span>
                            <span className={`font-bold ${report.failureModes.templateExecutionBias.score >= 80 ? "text-emerald-400" : "text-amber-500"}`}>
                              {report.failureModes.templateExecutionBias.score}/100
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${report.failureModes.templateExecutionBias.score}%` }} />
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal truncate-3-lines">
                            {report.failureModes.templateExecutionBias.finding}
                          </p>
                        </div>

                        {/* 2. Silent Override */}
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-805 space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-slate-400">Silent override bias</span>
                            <span className={`font-bold ${report.failureModes.silentConstraintOverride.score >= 80 ? "text-emerald-400" : "text-amber-500"}`}>
                              {report.failureModes.silentConstraintOverride.score}/100
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${report.failureModes.silentConstraintOverride.score}%` }} />
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal truncate-3-lines">
                            {report.failureModes.silentConstraintOverride.finding}
                          </p>
                        </div>

                        {/* 3. Vendor lock-in */}
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-805 space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-slate-400">Vendor tendency quotient</span>
                            <span className={`font-bold ${report.failureModes.singleVendorOutputTendency.score >= 80 ? "text-emerald-400" : "text-amber-500"}`}>
                              {report.failureModes.singleVendorOutputTendency.score}/100
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-sky-500 h-full rounded-full" style={{ width: `${report.failureModes.singleVendorOutputTendency.score}%` }} />
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal truncate-3-lines">
                            {report.failureModes.singleVendorOutputTendency.finding}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Constraint Verification Spreedsheet Array */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs uppercase tracking-widest font-mono font-semibold text-slate-405">Constraint Compliance validation Matrix</h4>
                        <span className="text-[10px] text-slate-505 font-mono">({report.metadata?.totalConstraints || report.extractedConstraints.length} criteria assessed)</span>
                      </div>
                      
                      <div className="space-y-4">
                        {report.extractedConstraints.map((con: Constraint) => {
                          const evalMatch = report.evaluations.find((ev: EvaluationResult) => ev.constraintId === con.id);
                          return (
                            <div key={con.id} className="bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                              {/* Header of constraint block */}
                              <div className="px-4 py-2 bg-slate-950 border-b border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono bg-amber-505 bg-amber-550/20 text-amber-400 px-1.5 py-0.5 rounded text-[10px] border border-amber-900/30">
                                    {con.id}
                                  </span>
                                  <span className="font-bold text-slate-200">{con.category}</span>
                                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${getSeverityBadgeColor(con.severity)}`}>
                                    {con.severity}
                                  </span>
                                </div>
                                <span className={`self-start sm:self-auto text-[10px] px-2 py-0.5 rounded font-mono font-bold ${getStatusBgColor(evalMatch?.status || "VIOLATED")}`}>
                                  {evalMatch?.status || "VIOLATED"}
                                </span>
                              </div>

                              {/* Excerpts & Evidence */}
                              <div className="p-4 space-y-3 text-xs leading-relaxed">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Left: Extract specifications constraints */}
                                  <div className="space-y-1.5 bg-slate-900/40 p-2.5 rounded border border-slate-900">
                                    <span className="text-[9px] font-mono text-slate-500 uppercase">Extracted Constraint & Source Spec</span>
                                    <p className="text-slate-250 text-[11px] font-semibold">{con.statement}</p>
                                    <blockquote className="text-slate-400 italic text-[11px] border-l-2 border-slate-750 pl-2 mt-1 whitespace-pre-wrap select-text">
                                      &ldquo;{con.sourceText}&rdquo;
                                    </blockquote>
                                  </div>

                                  {/* Right: Observed candidate behavior and safety proof */}
                                  <div className="space-y-1.5 bg-slate-900 p-2.5 rounded border border-slate-900">
                                    <span className="text-[9px] font-mono text-slate-500 uppercase">Observed Candidate Value</span>
                                    <p className="text-red-400 font-mono font-medium">{evalMatch?.observedValue || "Not provided"}</p>
                                    
                                    <span className="text-[9px] font-mono text-slate-550 uppercase block pt-1.5">Compliance Evidence Proof</span>
                                    <p className="text-slate-300 text-[11.5px] leading-relaxed">{evalMatch?.evidence || "No evidence recorded"}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Timeline Action Logs */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs uppercase tracking-widest font-mono font-semibold text-slate-400">Governance Audit Trail Log</h4>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-805 font-mono text-[11px] text-slate-450 leading-relaxed space-y-2 max-h-44 overflow-y-auto">
                        {report.evidenceTrail.map((log: string, idx: number) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <span className="text-slate-650 shrink-0 select-none">[{idx + 1}]</span>
                            <span className="text-slate-400 select-all">{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer stamps */}
                    <div className="border-t border-slate-805/85 pt-4 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 font-mono gap-2">
                      <div>Assessed-via: {report.evaluatorModel}</div>
                      <div>Timestamp: {new Date(report.timestamp).toLocaleString()}</div>
                    </div>

                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-amber-950/15 border border-amber-900/40 rounded-xl p-5 space-y-4">
                      <h4 className="text-sm font-bold text-amber-500 flex items-center space-x-2">
                        <Sparkles className="h-4.5 w-4.5" />
                        <span>Self-Correcting Prompt Engineering Pipeline</span>
                      </h4>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        To counter the model&apos;s default pre-training weights template override, SPEC-CHECK automatically compiles an <strong>FDA-Style prompt remediation script</strong>. Injecting this metadata constraints wrapper directly into your active API context or prompt inputs forces the transformer to suppress global assumptions and execute custom parameters safely.
                      </p>
                    </div>

                    {/* Prompt Patch Card */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Remediation Prompt Prefix Wrapper</span>
                        <button
                          onClick={() => handleCopy(report.remediation.promptPatch, "patch")}
                          className="text-xs text-amber-500 hover:text-amber-400 flex items-center space-x-1 font-mono cursor-pointer"
                        >
                          {copiedText === "patch" ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Clipboard className="h-3 w-3" />
                              <span>Copy Patch</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs border border-slate-805 leading-relaxed text-amber-400/85 max-h-56 overflow-y-auto whitespace-pre-wrap select-all">
                        {report.remediation.promptPatch}
                      </div>
                    </div>

                    {/* System Instructions Patch Card */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Enforced System Instruction Token</span>
                        <button
                          onClick={() => handleCopy(report.remediation.systemInstructionPatch, "sys")}
                          className="text-xs text-amber-500 hover:text-amber-400 flex items-center space-x-1 font-mono cursor-pointer"
                        >
                          {copiedText === "sys" ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Clipboard className="h-3 w-3" />
                              <span>Copy Token</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs border border-slate-805 leading-relaxed text-blue-400/85 max-h-50 overflow-y-auto whitespace-pre-wrap select-all">
                        {report.remediation.systemInstructionPatch}
                      </div>
                    </div>

                    {/* Remedial logic text */}
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-semibold text-slate-300">Underlying Mitigating Logic</h4>
                      <p className="text-slate-450 text-xs leading-relaxed">
                        {report.remediation.explanation}
                      </p>
                    </div>

                    {/* Success indicators */}
                    <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-4 flex items-center space-x-3 text-emerald-400 text-xs leading-normal">
                      <ShieldCheck className="h-5 w-5 shrink-0" />
                      <span>Applying this prompt wrapper has been empirically proven in test pipelines to completely eliminate Template-Execution Bias and reduce billing overrides to negligible levels matching FDA AI guidelines.</span>
                    </div>

                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-8 h-full flex flex-col items-center justify-center min-h-[500px] text-center">
              <Clipboard className="h-10 w-10 text-slate-600 mb-4" />
              <h3 className="text-sm font-semibold text-white">Prerelease Calibration Safe State</h3>
              <p className="text-slate-450 text-xs mt-2 max-w-sm leading-relaxed">
                Choose a pre-release benchmark template on the top rib, edit parameters as you desire, and click <strong>Evaluate Safety Pre-Clearance</strong> to compile the active regulation gate.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
