/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { BookOpen, AlertTriangle, HelpCircle, ShieldCheck, ChevronRight, BarChart2 } from "lucide-react";

export default function ResearchHub() {
  const [volume, setVolume] = useState<number>(38000000);
  const [specifiedRate, setSpecifiedRate] = useState<number>(0.0001);
  const [templatedRate, setTemplatedRate] = useState<number>(0.0003);

  const specifiedCost = volume * specifiedRate;
  const templatedCost = volume * templatedRate;
  const inflationPercent = Math.round(((templatedCost - specifiedCost) / specifiedCost) * 100);

  return (
    <div className="space-y-8 text-slate-100" id="spec-research-hub">
      {/* Editorial Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-3 text-amber-500 mb-2">
          <BookOpen className="h-5 w-5" />
          <span className="text-xs uppercase tracking-widest font-mono font-semibold">Empirical Grounding</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-sans sm:text-4xl">
          ARCORE-ML Empirical Case Study
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          SPEC-CHECK was created to address a critical vulnerability in pre-deployment safety testing. 
          Our architecture directly operationalizes empirical findings from ARCORE-ML (NeurIPS 2026 #2102, EMNLP 2026 #391).
        </p>
      </div>

      {/* The Core Story Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/60 border border-slate-805 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">The Discovery: Silent System Overestimation</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              During comprehensive stress-testing of a high-throughput <strong className="text-amber-400 font-medium">UPI merchant payments architecture</strong>, researchers documented that state-of-the-art models (including Gemini 1.5 Pro) committed a major, non-obvious failure. 
              When tasked with computing configuration budgets based on explicit instructions, the models <span className="text-red-400 font-semibold">silently substituted default enterprise subscription pricing ($0.0003 per msg)</span> for the explicitly specified custom transactional SES rate of <strong className="text-emerald-400 font-medium">$0.0001 per message</strong>.
            </p>
            <div className="bg-slate-950 p-4 rounded-lg border border-red-900/40 flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">A 212% Silent Margin Inflation Anomaly</h4>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  The model did not throw any error, flag, or warning. It drafted a fully cohesive business recommendation, yet the estimate was inflated by exactly 212%. In a massive national-scale system, this silent override translates directly to millions of dollars in wasted capital and false planning blockades.
                </p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              SPEC-CHECK translates these empirical findings into an automated <strong className="text-white">Governance pre-clearance gate</strong>. Rather than trusting black-box models or simple unit-testing, SPEC-CHECK extracts formal specifications, matches them directly against candidate architectures, and measures structural departures before production.
            </p>
          </div>

          {/* Three Failure Modes Detailed Explanation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">The Three Core Failure Modes Tested</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition">
                <span className="text-xs font-mono text-amber-500 font-bold">MODE-01</span>
                <h4 className="font-semibold text-white text-sm mt-1 mb-2">Template-Execution Bias</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Model slides back into high-frequency textbook solutions stored in weights rather than following the strict, unique parameter ranges of the document.
                </p>
              </div>
              <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition">
                <span className="text-xs font-mono text-rose-500 font-bold">MODE-02</span>
                <h4 className="font-semibold text-white text-sm mt-1 mb-2">Silent Constraint Override</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Numeric parameters (such as rates, sizing rules, database capacities, data retention values) are silently altered in output without raising alarm logs.
                </p>
              </div>
              <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition">
                <span className="text-xs font-mono text-sky-500 font-bold">MODE-03</span>
                <h4 className="font-semibold text-white text-sm mt-1 mb-2">Single-Vendor Tendency</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Hard architectural lock-in towards standard hyperscalers (like Amazon or GCP) even when specifying independent, private, or localized on-prem nodes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Cost Simulator Wing */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <BarChart2 className="h-5 w-5 text-amber-500" />
            <h3 className="text-md uppercase tracking-wider font-mono font-bold text-white">Inflation Simulator</h3>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            Adjust the sliders below to simulate the UPI notification overestimation anomaly in real time. Compare the specified budget bounds against the templated overrides.
          </p>

          <div className="space-y-4">
            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Monthly Message Volume</span>
                <span className="text-amber-400 font-mono">{(volume / 1000000).toFixed(1)}M</span>
              </div>
              <input
                type="range"
                min="5000000"
                max="100000000"
                step="500000"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Slider 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Custom Rate Specified</span>
                <span className="text-emerald-400 font-mono">${specifiedRate.toFixed(4)} / msg</span>
              </div>
              <input
                type="range"
                min="0.00005"
                max="0.00020"
                step="0.00001"
                value={specifiedRate}
                onChange={(e) => setSpecifiedRate(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Slider 3 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Templated Default Overwritten</span>
                <span className="text-red-400 font-mono">${templatedRate.toFixed(4)} / msg</span>
              </div>
              <input
                type="range"
                min="0.00021"
                max="0.00050"
                step="0.00001"
                value={templatedRate}
                onChange={(e) => setTemplatedRate(Number(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>
          </div>

          {/* Results Comparison Block */}
          <div className="bg-slate-950 p-4 rounded-lg space-y-3 border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Cost Under Constraint:</span>
              <span className="font-mono text-emerald-400 font-semibold">${specifiedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Actual Cost Proposed (Override):</span>
              <span className="font-mono text-red-400 font-semibold">${templatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            
            <div className="h-px bg-slate-800 my-2" />

            <div className="flex flex-col items-center justify-center py-2 bg-slate-900/50 rounded border border-amber-900/20">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Simulated Cost Inflation</span>
              <span className="text-3xl font-extrabold text-amber-500 font-mono mt-1">+{inflationPercent}%</span>
              <span className="text-[11px] text-slate-400 font-medium mt-1">Silent overestimation anomaly</span>
            </div>
          </div>

          {/* Visualization visual bar chart inside widget */}
          <div className="space-y-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Expected Billing footprint</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "32.2%" }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>With Silent Model Overrides</span>
                <span>{32.2 * (1 + inflationPercent / 100) > 100 ? "Max" : `${Math.round(32.2 * (1 + inflationPercent / 100))}%`}</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-red-505 h-full rounded-full transition-all duration-300" style={{ backgroundColor: "#ef4444", width: `${Math.min(100, 32.2 * (1 + inflationPercent / 100))}%` }} />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 leading-normal flex items-start space-x-1.5 pt-2">
            <HelpCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-500" />
            <span>This interactive chart mirrors the EXACT 212% overestimation documented in ARCORE EMNLP publications ($0.0001 custom rate vs $0.0003 template default).</span>
          </div>
        </div>
      </div>

      {/* FDA Style Pre-Clearance Analog */}
      <div className="bg-slate-900/40 rounded-xl p-6 border border-slate-800 space-y-6">
        <div className="flex items-center space-x-3 text-emerald-400">
          <ShieldCheck className="h-6 w-6" />
          <h3 className="text-lg font-semibold text-white">Why &quot;FDA-Style Pre-Clearance&quot;?</h3>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
          The 2026 International AI Safety Report declared that pre-deployment safety testing for enterprise LLMs is structurally broken. This is because current testing paradigms mainly focus on general benchmarking (e.g. general code generation or toxicity levels) rather than validating whether the AI model adheres strictly to the unique, customized functional constraints documented in system spec files.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Traditional Testing (Broken)</h4>
            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>Relies on static evaluations or generalized metrics.</li>
              <li>Fails to check outputs against raw input specifications.</li>
              <li>Misses silent numeric drifts or parameters substituted by pre-training default memorization.</li>
              <li>Cannot identify Single-Vendor ecosystems bias during prompt pipelines.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider font-mono">SPEC-CHECK Pre-Clearance (FDA Standards)</h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>
                <strong className="text-white">Active Constraint Extraction</strong>: Instantly maps specification files into formal, structured regulatory rules.
              </li>
              <li>
                <strong className="text-white">Three-Dimension Assessment</strong>: Scores specifically for template defaults, silent limits overrides, and lock-in bias.
              </li>
              <li>
                <strong className="text-white">Actionable Patch Generation</strong>: Builds immediate, self-correcting prompt patches to suppress weights defaults.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
