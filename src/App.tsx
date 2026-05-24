/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  ShieldAlert, Layers, BookOpen, Presentation, Info, 
  CheckCircle, Hammer, HeartCrack, ChevronRight 
} from "lucide-react";
import EvaluationGate from "./components/EvaluationGate";
import ResearchHub from "./components/ResearchHub";
import PitchDeck from "./components/PitchDeck";

export default function App() {
  const [activeTab, setActiveTab] = useState<"evaluate" | "research" | "pitch">("evaluate");
  const [healthStatus, setHealthStatus] = useState<{ status: string; time: string } | null>(null);

  // Poll server health on load to verify full-stack connection is active
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setHealthStatus(data))
      .catch((err) => console.log("Health check failed (likely local startup phase):", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Absolute Header Ribbon */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Wing Brand */}
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center border border-amber-400/20 shadow-md shadow-amber-500/10">
                <ShieldAlert className="h-5 w-5 text-slate-950 stroke-[2.2px]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wider text-white uppercase font-sans">
                  SPEC-CHECK
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">
                  AI Pre-Clearance Gate
                </span>
              </div>
            </div>

            {/* Middle Nav Controls */}
            <div className="flex space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-850">
              <button
                onClick={() => setActiveTab("evaluate")}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition cursor-pointer ${
                  activeTab === "evaluate"
                    ? "bg-slate-900 text-amber-500 border border-slate-800 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Regulatory Workbench</span>
                <span className="sm:hidden">Workbench</span>
              </button>
              
              <button
                onClick={() => setActiveTab("research")}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition cursor-pointer ${
                  activeTab === "research"
                    ? "bg-slate-900 text-amber-500 border border-slate-800 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">ARCORE-ML Research Hub</span>
                <span className="sm:hidden">Research</span>
              </button>

              <button
                onClick={() => setActiveTab("pitch")}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition cursor-pointer ${
                  activeTab === "pitch"
                    ? "bg-slate-900 text-amber-500 border border-slate-800 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Presentation className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Presentation Pitch Kit</span>
                <span className="sm:hidden">Pitch Deck</span>
              </button>
            </div>

            {/* Right Wing Diagnostics */}
            <div className="hidden md:flex items-center space-x-2.5">
              <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850 text-[10px] font-mono h-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-450 opacity-75" style={{ backgroundColor: "#10b981" }} />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-slate-400 uppercase">SYSTEM GATE:</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Core Sub-Title Indicator Banner */}
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-lg">
          
          <div className="absolute top-0 right-0 h-40 w-40 bg-amber-500/5 rounded-full blur-3xl -z-10" />
          
          <div className="space-y-1.5 select-none">
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-semibold font-mono tracking-widest text-amber-500 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/30">
                Track 1 — Specification Elicitation
              </span>
              <span className="text-slate-600 font-mono text-xs">|</span>
              <span className="text-xs text-slate-400 font-mono">FDA AI Safety Model</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans sm:text-3xl">
              AI pre-clearance gate
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              SPEC-CHECK addresses specification elicitation by automatically extracting formal constraints from natural language requirements and safety specifications, evaluating LLM outputs against three failure dimensions.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2 shrink-0 md:w-80">
            <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase font-mono">
              <Info className="h-4 w-4 text-slate-500" />
              <span>Diagnostic Feed</span>
            </div>
            <div className="text-[11px] font-mono leading-relaxed space-y-1 text-slate-550">
              <div className="flex justify-between">
                <span>Evaluator model:</span>
                <span className="text-slate-400 font-semibold">Gemini 3.5 Flash</span>
              </div>
              <div className="flex justify-between">
                <span>API Connection status:</span>
                <span className={healthStatus ? "text-emerald-400 font-semibold" : "text-amber-500 font-semibold font-mono"}>
                  {healthStatus ? "Operational" : "Calibrating..."}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Evaluation standard:</span>
                <span className="text-sky-400 font-semibold">ARCORE-ML #2102</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab view routes */}
        <div className="relative">
          {activeTab === "evaluate" ? (
            <EvaluationGate />
          ) : activeTab === "research" ? (
            <ResearchHub />
          ) : (
            <PitchDeck />
          )}
        </div>

        {/* Dynamic bottom citation card */}
        <div className="mt-12 border-t border-slate-850 pt-6 text-center space-y-3">
          <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-3 text-xs text-slate-500 font-mono">
            <span>SPEC-CHECK v1.2.0 PRE-CLEARANCE GATEWAY</span>
            <span className="hidden md:inline text-slate-800">|</span>
            <span>NEURIPS 2026 #2102</span>
            <span className="hidden md:inline text-slate-800">|</span>
            <span>EMNLP 2026 #391</span>
          </div>
          <p className="text-[10px] text-slate-600 max-w-2xl mx-auto leading-relaxed">
            This workspace provides automated governance audits based on UPI database billing overestimations documented in academic litigation publications. Under no circumstances should unauthorized LLM outputs default to billing coefficients outside requested bounds.
          </p>
        </div>

      </div>
    </div>
  );
}
