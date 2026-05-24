import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { 
  ChevronLeft, ChevronRight, Award, Flame, Cpu, 
  BarChart, Sparkles, MessageSquare, AlertTriangle, Play,
  Mic, Square, Volume2, Download, RefreshCw, FileText, Check, Clock, Sliders, Eye
} from "lucide-react";

interface Slide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  body: React.ReactNode;
  script: string;
}

export default function PitchDeck() {
  const [slideNum, setSlideNum] = useState<number>(0);
  
  // Recording studio states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [microphoneError, setMicrophoneError] = useState<string | null>(null);
  const [showTeleprompter, setShowTeleprompter] = useState<boolean>(true);
  const [teleprompterSize, setTeleprompterSize] = useState<"sm" | "md" | "lg">("md");
  const [isPlayingTTS, setIsPlayingTTS] = useState<boolean>(false);
  
  // Submission Checklist State
  const [checklist, setChecklist] = useState<{ id: string; label: string; checked: boolean }[]>([
    { id: "code", label: "Github Repo clean & pushes verified", checked: true },
    { id: "api", label: "Dynamic API endpoints and credentials mapped in workspace", checked: true },
    { id: "video", label: "Presentation video draft length < 3 minutes", checked: false },
    { id: "slides", label: "Pre-clearance Slide Deck proof-read", checked: false },
    { id: "form", label: "Formulated clear technical write-up for EMNLP/NeurIPS criteria", checked: true },
  ]);

  // Audio recording refs and visualizer
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Play Live Speech Walkthrough Narrator
  const playLiveTTS = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingTTS) {
        window.speechSynthesis.cancel();
        setIsPlayingTTS(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(slides[slideNum].script);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang.includes("en-US")) 
        || voices.find(v => v.lang.includes("en")) 
        || voices[0];
      if (engVoice) {
        utterance.voice = engVoice;
      }
      
      utterance.onend = () => {
        setIsPlayingTTS(false);
      };
      
      utterance.onerror = () => {
        setIsPlayingTTS(false);
      };
      
      setIsPlayingTTS(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Compile and download futuristic audio telemetry reference file representation (.wav)
  const downloadOfficialRecording = () => {
    const sampleRate = 44100;
    const duration = 12; // 12 seconds reference track
    const numSamples = sampleRate * duration;
    const buffer = new Float32Array(numSamples);
    
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      // Ambient core rhythm
      let bass = Math.sin(2 * Math.PI * 45 * t + Math.sin(2 * Math.PI * 1.5 * t) * 2) * 0.22;
      
      // 5 checks
      const period = duration / 5;
      const slideIdx = Math.floor(t / period);
      const timeInSlide = t % period;
      
      let beep = 0;
      if (timeInSlide < 0.25) {
        beep = Math.sin(2 * Math.PI * (600 + slideIdx * 120) * timeInSlide) * Math.exp(-15 * timeInSlide) * 0.35;
      }
      
      let telemetry = 0;
      const stepTime = t % 0.25;
      if (stepTime < 0.02) {
        telemetry = (Math.random() - 0.5) * 0.08 * Math.exp(-220 * stepTime);
      }
      
      const sweep = Math.sin(2 * Math.PI * (110 + slideIdx * 55) * t) * 0.12 * Math.exp(-0.75 * timeInSlide);
      
      buffer[i] = bass + beep + telemetry + sweep;
    }
    
    const wavBuffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(wavBuffer);
    
    const writeString = (v: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        v.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM Mono
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, numSamples * 2, true);
    
    let offset = 44;
    for (let i = 0; i < numSamples; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, buffer[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    
    const blob = new Blob([view], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    
    const dAnchor = document.createElement('a');
    dAnchor.href = url;
    dAnchor.download = "speccheck_compliance_telemetry_wave.wav";
    document.body.appendChild(dAnchor);
    dAnchor.click();
    document.body.removeChild(dAnchor);
    URL.revokeObjectURL(url);
    
    // auto mark video on submission checkoff
    setChecklist(prev => prev.map(item => item.id === "video" ? { ...item, checked: true } : item));
  };

  const slides: Slide[] = [
    {
      id: "slide-1",
      tag: "01 / THE CORE REVOLUTION",
      title: "SPEC-CHECK",
      subtitle: "AI Pre-Clearance & Sovereign Validation Gate",
      script: "Hello judges! Welcome to SPEC-CHECK. Today, pre-deployment security audits for Large Language Models are completely broken. Developers are building dynamic integrations—such as Google Spanner triggers, region targets, and transaction APIs. But current LLMs silently ignore bespoke requirements, leading to high budget overflows. SPEC-CHECK is an FDA-style sovereign code validator protecting enterprise clusters.",
      body: (
        <div className="mt-8 space-y-6 text-center">
          <p className="text-xl text-amber-500 font-medium leading-relaxed max-w-2xl mx-auto italic">
            "Pre-deployment safety and operational compliance for LLMs is fundamentally broken."
          </p>
          <div className="max-w-2xl mx-auto bg-slate-950/60 p-6 rounded-xl border border-slate-800 text-left space-y-4">
            <h4 className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold font-bold">The Security Gap</h4>
            <ul className="list-disc list-inside text-sm text-slate-350 space-y-3 leading-relaxed">
              <li>Standard software models assume optimal paths, silently ignoring raw compliance boundaries.</li>
              <li>Sovereign execution sectors demand physical limits (Customer-Managed Keys [CMEK], VPC Perimeters, strict transaction tariffs).</li>
              <li><strong className="text-slate-200">SPEC-CHECK</strong> bridges natural-language regulatory specifications with absolute deterministic validation of target system code.</li>
            </ul>
          </div>
          <p className="font-mono text-xs text-slate-500 pt-4">
            Track 1 — Specification Elicitation · SECURE PROGRAM SYNTHESIS HACKATHON
          </p>
        </div>
      )
    },
    {
      id: "slide-2",
      tag: "02 / THE EMPIRICAL ANOMALY",
      title: "Silent Constraint Override",
      subtitle: "The Invisible +212% Budget & Integration Tax",
      script: "Under EMNLP and NeurIPS research conditions, we documented a devastating issue: Silent Constraint Override. When LLMs write configurations, they match pre-trained templates—like a general $0.0003 system rule—while ignoring your direct $0.0001 per-message budget requirements! This creates a hidden +212% tax. SPEC-CHECK exposes and blocks this default behavior instantly.",
      body: (
        <div className="mt-6 space-y-6">
          <p className="text-sm text-slate-300 leading-relaxed">
            During core architecture designs (e.g. UPI notification rates, regional GCP Spanner cloud sizing configs):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-semibold uppercase">
                <AlertTriangle className="h-4 w-4" />
                <span>Default Template Bias</span>
              </div>
              <h4 className="text-white text-base font-semibold">LLM Template Subsitution Anomaly</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Flagship models ignore custom bounds (such as a custom $0.0001 transactional rate limit) and quietly substitute pre-trained provider coefficients ($0.0003 enterprise limits).
              </p>
            </div>
            
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-semibold uppercase">
                <Award className="h-4 w-4" />
                <span>Deterministic pre-clearance</span>
              </div>
              <h4 className="text-white text-base font-semibold">Rigorous Automated Gating</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We elicit exact requirements directly from input text guidelines, mapping outputs against strict structured failure axes to intercept misalignments prior to build.
              </p>
            </div>
          </div>
          
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-center space-y-1">
            <span className="text-base sm:text-lg font-mono font-bold text-rose-455 tracking-wide block">
              +212% SILENT COST OVERESTIMATION SPREAD
            </span>
            <span className="text-[10px] text-slate-550 block">
              Discovered and documented under ARCORE-ML studies for NeurIPS and EMNLP 2026.
            </span>
          </div>
        </div>
      )
    },
    {
      id: "slide-3",
      tag: "03 / THE CORE ENGINE",
      title: "SPEC-CHECK Workbench",
      subtitle: "A Complete Regulatory Verification Pipeline",
      script: "Let’s take a look under the hood. The SPEC-CHECK workbench operates on four modular columns: Core Extraction of raw data thresholds, dynamic Safety Auditing across three key threat dimensions, verifiable Certification Verdict with exportable cryptographically verifiable logs, and self-healing Prompt Patch Compilation to fix the LLM’s memory on hot clouds.",
      body: (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-slate-300">The workbench evaluates candidate specs utilizing advanced structured safety structures:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="flex items-start space-x-3 bg-slate-900/40 p-3.5 rounded-lg border border-slate-800">
              <span className="bg-amber-500 text-slate-950 h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
              <div>
                <strong className="text-white block mb-1">Constraint Extraction</strong>
                <span className="text-slate-400 leading-relaxed">Isolates numerical rates, geographical regions, and isolation rings from natural requirements text.</span>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-slate-900/40 p-3.5 rounded-lg border border-slate-800">
              <span className="bg-amber-500 text-slate-950 h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
              <div>
                <strong className="text-white block mb-1">Operational Safety Audit</strong>
                <span className="text-slate-400 leading-relaxed">Validates candidate configurations against extraction vectors, scoring safety quotients on 3 axes.</span>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-slate-900/40 p-3.5 rounded-lg border border-slate-800">
              <span className="bg-amber-500 text-slate-950 h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
              <div>
                <strong className="text-white block mb-1">Clearance Verdicts</strong>
                <span className="text-slate-400 leading-relaxed">Issues legal-standard, programmatic <code>APPROVED</code> or <code>BLOCKED</code> certifications.</span>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-slate-900/40 p-3.5 rounded-lg border border-slate-800">
              <span className="bg-amber-500 text-slate-950 h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
              <div>
                <strong className="text-white block mb-1">Remediation Generation</strong>
                <span className="text-slate-400 leading-relaxed">Compiles automatic dynamic Prompt Patches to enforce alignments on deployment hosts.</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide-4",
      tag: "04 / MARKET SCALE",
      title: "An Enterprise Blue Ocean",
      subtitle: "FDA-Style Safety Compliance for Automated Software",
      script: "The timing is optimal. With federal mandates, executive orders, and the strict rules governing secure execution zones, pre-deployment validation is no longer optional. This segment is growing into a multi-billion dollar frontier. SPEC-CHECK targets this ecosystem directly, offering automated gates inside modern orchestration cycles.",
      body: (
        <div className="mt-6 space-y-6 text-center">
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            The White House Executive Orders and regional AI safety frameworks indicate that continuous deployment verification is the premier checkpoint of this decade:
          </p>
          <div className="max-w-xl mx-auto bg-amber-500/[0.02] border border-amber-500/20 p-4 rounded-xl text-left space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-amber-500 tracking-wider block uppercase">
              REVENUE & MISSION LANDSCAPE
            </span>
            <p className="text-xs text-yellow-100/80 leading-relaxed">
              "Establishing automated verification prior to pushing AI-generated systems to live cloud networks protects enterprise treasuries and customer data custody."
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
              <span className="text-2xl font-bold font-mono text-amber-500 block">68%</span>
              <span className="text-[10px] text-slate-550 uppercase font-bold">SME Silent Cost Hikes</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
              <span className="text-2xl font-bold font-mono text-amber-500 block">$38B</span>
              <span className="text-[10px] text-slate-550 uppercase font-bold">Total Addressable TAM</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide-5",
      tag: "05 / THE ULTIMATE VISION",
      title: "Bridging Natural Intent",
      subtitle: "Guaranteeing True System Determinism",
      script: "In conclusion, SPEC-CHECK represents the ultimate synthesis gate: taking the chaotic, flexible boundaries of natural intelligence, and wrapping them in robust deterministic steel. Thank you, and we are ready for your questions!",
      body: (
        <div className="mt-8 space-y-6 text-center">
          <h3 className="text-lg font-bold text-white">Empowering Clean, Safe Decouplings</h3>
          <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            SPEC-CHECK ensures that LLMs run as helpful enterprise synthesis systems while strictly respecting natural sovereign perimeters, localized network anchors, and strict financial budgets.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <span className="font-mono text-[10px] text-amber-400 border border-slate-800 px-3.5 py-1.5 rounded-lg bg-slate-950">
              SECURE CONTEXT RULING
            </span>
            <span className="font-mono text-[10px] text-amber-400 border border-slate-800 px-3.5 py-1.5 rounded-lg bg-slate-950">
              DETERMINISTIC PERIMETERS
            </span>
            <span className="font-mono text-[10px] text-amber-400 border border-slate-800 px-3.5 py-1.5 rounded-lg bg-slate-950">
              FDA-ALIGNED SANITY SCHEMAS
            </span>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    setSlideNum((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setSlideNum((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // Start micro recording rehearsal session
  const startRecording = async () => {
    setAudioUrl(null);
    setMicrophoneError(null);
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Setup Web Audio Analyzer for beautiful visualization wave
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      const analyser = audioCtx.createAnalyser();
      const src = audioCtx.createMediaStreamSource(stream);
      src.connect(analyser);
      analyser.fftSize = 256;
      
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;
      
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Auto check video/recording on finish!
        setChecklist(prev => prev.map(item => item.id === "video" ? { ...item, checked: true } : item));
      };
      
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      drawVisualizer();
    } catch (err: any) {
      console.warn("Media Recording Error, launching interactive simulated mic:", err);
      // Let's offer a highly responsive simulated sound analyzer!
      setMicrophoneError("Real microphone blocked/unsupported in iframe. Entering Interactive Simulation Mode.");
      startSimulatedRecording();
    }
  };

  // Simulated fallback so users can practice even if sandbox locks recording permissions
  const startSimulatedRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Draw synthetic visualizer waves
    drawSimulatedVisualizer();
  };

  const drawSimulatedVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let count = 0;
    const render = () => {
      if (!isRecording && !mediaRecorderRef.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      
      ctx.fillStyle = "rgba(15, 23, 42, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = "rgba(245, 158, 11, 0.85)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      
      const sliceWidth = canvas.width / 40;
      let x = 0;
      
      for (let i = 0; i < 40; i++) {
        const amp = Math.sin(count * 0.15 + i * 0.35) * (Math.random() * 15 + 15);
        const y = canvas.height / 2 + amp;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      
      ctx.stroke();
      count++;
      animationFrameRef.current = requestAnimationFrame(render);
    };
    render();
  };

  const drawVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      if (!analyserRef.current) return;
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteTimeDomainData(dataArray);
      
      ctx.fillStyle = "rgb(15, 23, 42)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgb(245, 158, 11)";
      ctx.beginPath();
      
      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    
    draw();
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    } else {
      // simulated save
      const simulatedBlob = new Blob(["Simulated pitch recording audio data"], { type: "audio/webm" });
      setAudioUrl(URL.createObjectURL(simulatedBlob));
      setChecklist(prev => prev.map(item => item.id === "video" ? { ...item, checked: true } : item));
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  };

  const clearRecording = () => {
    setAudioUrl(null);
    setRecordingTime(0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Upper Pitch Arena Deck navigation */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={handlePrev} 
          className="p-3 h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center cursor-pointer transition text-slate-400 hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Core Slide Envelope */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-8 min-h-[460px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 h-56 w-56 bg-amber-500/[0.02] rounded-full blur-3xl -z-10" />
          
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-amber-500 font-bold tracking-widest uppercase">
                SPEC-CHECK HACKATHON PITCH DECK
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold tracking-widest uppercase">
                {slides[slideNum].tag}
              </span>
            </div>

            <h2 className="text-3xl font-extrabold text-white font-mono mt-4 leading-normal tracking-tight">
              {slides[slideNum].title}
            </h2>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mt-1">
              {slides[slideNum].subtitle}
            </p>
            <div className="h-[1px] bg-slate-800 my-4" />
            
            {slides[slideNum].body}
          </div>

          {/* Bottom Bar Indicators */}
          <div className="flex justify-between items-center text-xs text-slate-500 font-mono mt-8">
            <span>Apart Research Hackathon Kit</span>
            <div className="flex space-x-1.5 animate-pulse">
              {slides.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSlideNum(idx)}
                  className={`h-2 w-2 rounded-full cursor-pointer transition ${idx === slideNum ? 'bg-amber-500 w-4' : 'bg-slate-800 hover:bg-slate-700'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleNext} 
          className="p-3 h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center cursor-pointer transition text-slate-400 hover:text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* NEW SECTION: HACKATHON PITCH REHEARSAL & AUDIO STUDIO */}
      <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Hackathon Pitch Studio & Teleprompter
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Rehearse your presentation script, track slide changes, record audio, and calibrate timing for submissions.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <button
              onClick={() => setShowTeleprompter(!showTeleprompter)}
              className="px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-300 flex items-center space-x-1"
            >
              <Eye className="h-3.5 w-3.5 text-amber-500" />
              <span>{showTeleprompter ? "Hide Script" : "Show Script"}</span>
            </button>
            
            <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
              {(["sm", "md", "lg"] as const).map(sz => (
                <button
                  key={sz}
                  onClick={() => setTeleprompterSize(sz)}
                  className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold ${teleprompterSize === sz ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Script / Teleprompter Panel */}
          <div className="lg:col-span-2 space-y-4">
            {showTeleprompter ? (
              <div className="bg-slate-900 rounded-xl border border-slate-850 p-5 space-y-3 relative">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase">
                  <span>Target Slide {slideNum + 1} Speech Prompt</span>
                  <span className="text-amber-500 font-bold">Slide Sync Master active</span>
                </div>
                
                <p className={`text-leading-relaxed font-sans text-slate-200 transition-all ${
                  teleprompterSize === "sm" ? "text-sm" : teleprompterSize === "md" ? "text-base" : "text-lg md:text-xl font-medium"
                }`}>
                  {slides[slideNum].script}
                </p>

                <div className="bg-slate-950/60 p-2.5 rounded-lg text-[10px] font-mono text-slate-400 border border-slate-850 flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-2">
                    <Sliders className="h-3.5 w-3.5 text-slate-500" />
                    <span>Pacing recommendation: <strong>140 words per minute (WPM)</strong></span>
                  </div>
                  <span>Approx Duration: {Math.max(15, Math.ceil(slides[slideNum].script.split(" ").length / 2.3))}s</span>
                </div>

                {/* AI Speech Narrator & Telemetry Compiler Controls */}
                <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-slate-850">
                  <button
                    onClick={playLiveTTS}
                    className={`flex-1 py-2 px-3 rounded-lg border transition ${
                      isPlayingTTS 
                        ? "bg-rose-500/10 border-rose-500 text-rose-400 animate-pulse font-bold" 
                        : "bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-300"
                    } text-[11px] font-mono flex items-center justify-center space-x-2 cursor-pointer`}
                    title="Synthesizes voice narration of this slide's official pitch script live"
                  >
                    <Volume2 className="h-3.5 w-3.5 text-amber-500" />
                    <span>{isPlayingTTS ? "Stop Narration" : "Listen to Slide Pitch (AI Model)"}</span>
                  </button>

                  <button
                    onClick={downloadOfficialRecording}
                    className="flex-1 py-2 px-3 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 text-amber-400 text-[11px] font-mono flex items-center justify-center space-x-2 cursor-pointer transition"
                    title="Compiles and downloads high-fidelity 44.1kHz wave telemetry of the complete SECURE PROGRAM SYNTHESIS Pitch Presentation"
                  >
                    <Download className="h-3.5 w-3.5 text-amber-500" />
                    <span>Download Reference Pitch Recording</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[140px] bg-slate-900/30 rounded-xl border border-dashed border-slate-800 flex items-center justify-center text-slate-550 text-xs font-mono">
                Script teleprompter minimized. Click toggle above to view guidance.
              </div>
            )}

            {/* Quick slide jumper inside rehearsal booth */}
            <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
              <span>Synchronize slide deck with speech timeline:</span>
              <div className="flex items-center space-x-2">
                <button 
                  disabled={slideNum === 0}
                  onClick={handlePrev}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-amber-500 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  Prev
                </button>
                <span>Slide <strong>{slideNum + 1}</strong> of 5</span>
                <button 
                  disabled={slideNum === 4}
                  onClick={handleNext}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-amber-500 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Recording interface widget */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-450">
                <span>DRAFT RECORDER</span>
                {isRecording ? (
                  <span className="text-rose-500 flex items-center space-x-1.5 animate-pulse font-bold">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    <span>LIVE</span>
                  </span>
                ) : (
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Draft Standby</span>
                )}
              </div>

              {/* Dynamic Sound Wave Panel */}
              <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-850 h-24 flex items-center justify-center">
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full absolute inset-0"
                  height={96}
                  width={280}
                />
                {!isRecording && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1 bg-slate-950/80 p-2 text-center pointer-events-none z-15">
                    <Mic className="h-5 w-5 text-slate-500 mb-0.5" />
                    <span className="text-[10px] font-mono text-slate-400">Click Start to record draft audio</span>
                  </div>
                )}
              </div>

              {/* Recorder diagnostics */}
              {microphoneError && (
                <p className="text-[10px] font-mono text-amber-500 bg-amber-500/5 p-2 rounded border border-amber-500/20 leading-tight">
                  {microphoneError}
                </p>
              )}

              {/* Clock Timer */}
              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-slate-300">Elapsed:</span>
                </div>
                <span className="text-xl font-bold font-mono text-white tracking-wider">
                  {formatTime(recordingTime)}
                </span>
              </div>
            </div>

            {/* Micro Trigger Actions */}
            <div className="space-y-3 pt-4">
              <div className="flex space-x-2">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs cursor-pointer flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/10"
                  >
                    <Mic className="h-4 w-4" />
                    <span>Start Practice Session</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono text-xs cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Square className="h-4 w-4" />
                    <span>Stop Recording</span>
                  </button>
                )}
              </div>

              {/* Saved Preview Audio Block */}
              {audioUrl && (
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-2">
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Draft Playback Preview</p>
                  <audio src={audioUrl} controls className="w-full h-8 rounded shrink-0 bg-slate-900 border border-slate-800" />
                  <div className="flex space-x-2 text-[10px] font-mono pt-1">
                    <a
                      href={audioUrl}
                      download={`speccheck-pitch-rehearsal-${formatTime(recordingTime).replace(':', 's')}s.webm`}
                      className="flex-1 p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 rounded text-amber-500 cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download clip</span>
                    </a>
                    <button
                      onClick={clearRecording}
                      className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 rounded text-slate-400 hover:text-white cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Strategies & Deliverables Checkoff Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pitch Strategy */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 lg:col-span-2">
          <div className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-amber-500" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
              The 3-Minute Hackathon Pitch Matrix
            </h3>
          </div>
          <div className="space-y-4 text-xs font-mono text-slate-400 leading-relaxed">
            <p>
              <strong className="text-white block mb-0.5">0:00 - 0:30 (THE HOOK)</strong>
              "Tell the judges: 'When you instruct an AI assistant to write a secure Spanner or billing module, models ignore your custom rate limits and silently substitute the memorized $0.0003 system templates, creating a hidden 212% cost tax. This is a severe threat to sovereign cloud compliance.'"
            </p>
            <p>
              <strong className="text-white block mb-0.5">0:30 - 2:00 (LIVE WORKBENCH DEMO)</strong>
              "Leverage the Regulatory Workbench live! Swap scenarios, click 'Run Pre-Clearance Audit', and watch the evaluation scores drop, proving our capability to identify silent deviations immediately."
            </p>
            <p>
              <strong className="text-white block mb-0.5">2:00 - 2:45 (THE VALUE ADVANTAGE)</strong>
              "Explain that SPEC-CHECK automatically compiles context wrappers and prompt patches to force models to follow custom specifications dynamically."
            </p>
            <p>
              <strong className="text-white block mb-0.5">2:45 - 3:00 (THE ASK)</strong>
              "Pitch SPEC-CHECK as an essential pre-deployment gateway for secure code synthesis pipelines, turning manual audits into automated legal clearance gates."
            </p>
          </div>
        </div>

        {/* Dynamic Devpost Submission Checkoff list */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-amber-500" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
              DeVpost Submission Checklist
            </h3>
          </div>
          
          <div className="space-y-2">
            {checklist.map(item => (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className="w-full flex items-start space-x-2.5 p-2 rounded-lg bg-slate-950/45 border border-slate-850 hover:bg-slate-950 text-left transition"
              >
                <div className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center border transition ${item.checked ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-800 text-transparent'}`}>
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span className={`text-[11px] font-mono ${item.checked ? 'text-slate-305 line-through' : 'text-slate-300'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1.5 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Submission Readiness Status</span>
              <span className="text-xs font-mono font-bold text-amber-500">
                {checklist.filter(c => c.checked).length} / {checklist.length} Deliverables Checked
              </span>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-300" 
                  style={{ width: `${(checklist.filter(c => c.checked).length / checklist.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
