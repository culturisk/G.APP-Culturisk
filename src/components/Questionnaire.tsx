import React, { useState, useEffect } from "react";
import { Phase, Question, AssessmentSession } from "../types";
import { phases } from "../data/questions";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, Lock, CheckCircle2, AlertCircle, TrendingUp, Target, Users, Globe, ShieldAlert, Loader2, Sparkles, BarChart3, ArrowRight, ShieldCheck, Zap, Brain, Activity, Check, Minus, X, AlertTriangle } from "lucide-react";
import { auth, db, signIn } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

interface QuestionnaireProps {
  onComplete: (session: AssessmentSession) => void;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const [user] = useAuthState(auth);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [lastAnsweredValue, setLastAnsweredValue] = useState<number | null>(null);
  const [showSignal, setShowSignal] = useState(false);

  const currentPhase = phases[currentPhaseIndex];
  const currentQuestion = currentPhase.questions[currentQuestionIndex];
  const totalQuestions = phases.reduce((acc, phase) => acc + phase.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  useEffect(() => {
    const initSession = async () => {
      const sessionId = Math.random().toString(36).substring(7);
      const newSession: AssessmentSession = {
        id: sessionId,
        userId: user?.uid,
        answers: {},
        currentPhase: 1,
        completedPhases: [],
        timestamp: Date.now(),
      };
      setSession(newSession);
      if (user) {
        await setDoc(doc(db, "sessions", sessionId), newSession);
      }
    };
    initSession();
  }, [user]);

  const handleAnswer = async (value: number) => {
    setLastAnsweredValue(value);
    setShowSignal(true);
    setTimeout(() => setShowSignal(false), 1000);

    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    const answeredCount = Object.keys(newAnswers).length;
    
    // Check for milestone (every 10 questions, but not at the very end)
    const isMilestone = answeredCount % 10 === 0 && answeredCount < totalQuestions;

    if (isMilestone) {
      setShowMilestoneModal(true);
    }

    if (currentQuestionIndex < currentPhase.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentPhaseIndex < phases.length - 1) {
      // Check if next phase is premium
      if (currentPhaseIndex === 0 && !user) {
        // Phase 1 complete, need auth for Phase 2
        return;
      }
      setCurrentPhaseIndex(currentPhaseIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      // All phases complete
      await finishAssessment(newAnswers);
    }
  };

  const calculateScores = (finalAnswers: Record<string, number>) => {
    const scores = { business: 0, marketing: 0, audience: 0, positioning: 0, cultural: 0 };
    const counts = { business: 0, marketing: 0, audience: 0, positioning: 0, cultural: 0 };
    const answeredCount = Object.keys(finalAnswers).length;

    phases.forEach((phase) => {
      phase.questions.forEach((q) => {
        const answer = finalAnswers[q.id];
        if (answer !== undefined) {
          q.options[0].impacts.business !== undefined && (scores.business += (answer / 4) * 100, counts.business++);
          q.options[0].impacts.marketing !== undefined && (scores.marketing += (answer / 4) * 100, counts.marketing++);
          q.options[0].impacts.audience !== undefined && (scores.audience += (answer / 4) * 100, counts.audience++);
          q.options[0].impacts.positioning !== undefined && (scores.positioning += (answer / 4) * 100, counts.positioning++);
          q.options[0].impacts.cultural !== undefined && (scores.cultural += (answer / 4) * 100, counts.cultural++);
        }
      });
    });

    const results = {
      business: Math.round(scores.business / (counts.business || 1)),
      marketing: Math.round(scores.marketing / (counts.marketing || 1)),
      audience: Math.round(scores.audience / (counts.audience || 1)),
      positioning: Math.round(scores.positioning / (counts.positioning || 1)),
      cultural: Math.round(scores.cultural / (counts.cultural || 1)),
    };

    // Cap at 50% if only 10 questions answered
    if (answeredCount <= 10) {
      Object.keys(results).forEach(key => {
        results[key as keyof typeof results] = Math.min(results[key as keyof typeof results], 50);
      });
    } else if (answeredCount <= 20) {
      Object.keys(results).forEach(key => {
        results[key as keyof typeof results] = Math.min(results[key as keyof typeof results], 70);
      });
    }

    return results;
  };

  const finishAssessment = async (finalAnswers: Record<string, number>) => {
    if (!session) return;
    setIsSaving(true);
    const finalScores = calculateScores(finalAnswers);
    
    // Determine current phase and completed phases based on answers
    const answeredCount = Object.keys(finalAnswers).length;
    const currentPhaseId = Math.min(Math.floor(answeredCount / 10) + 1, phases.length);
    const completedPhases = phases
      .filter(p => p.id < currentPhaseId || (p.id === currentPhaseId && answeredCount % 10 === 0 && answeredCount > 0))
      .map(p => p.id);

    const updatedSession: AssessmentSession = {
      ...session,
      answers: finalAnswers,
      completedPhases,
      currentPhase: currentPhaseId,
      scores: finalScores,
    };
    
    if (user) {
      await updateDoc(doc(db, "sessions", session.id), updatedSession as any);
    }
    
    onComplete(updatedSession);
    setIsSaving(false);
  };

  const isPhaseLocked = (phaseIndex: number) => {
    return phaseIndex > 0 && !user;
  };

  const getOptionStyles = (value: number, isSelected: boolean) => {
    if (isSelected) {
      switch (value) {
        case 4: return "border-green-500 bg-green-500 text-white shadow-green-200";
        case 3: return "border-emerald-500 bg-emerald-500 text-white shadow-emerald-200";
        case 2: return "border-amber-500 bg-amber-500 text-white shadow-amber-200";
        case 1: return "border-orange-500 bg-orange-500 text-white shadow-orange-200";
        case 0: return "border-red-500 bg-red-500 text-white shadow-red-200";
        default: return "border-black bg-black text-white shadow-lg";
      }
    }
    switch (value) {
      case 4: return "border-gray-100 hover:border-green-200 hover:bg-green-50/30";
      case 3: return "border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30";
      case 2: return "border-gray-100 hover:border-amber-200 hover:bg-amber-50/30";
      case 1: return "border-gray-100 hover:border-orange-200 hover:bg-orange-50/30";
      case 0: return "border-gray-100 hover:border-red-200 hover:bg-red-50/30";
      default: return "border-gray-100 hover:border-gray-300 hover:bg-gray-50";
    }
  };

  const getOptionIcon = (value: number) => {
    switch (value) {
      case 4: return <CheckCircle2 className="w-5 h-5" />;
      case 3: return <Check className="w-5 h-5" />;
      case 2: return <Minus className="w-5 h-5" />;
      case 1: return <X className="w-5 h-5" />;
      case 0: return <AlertTriangle className="w-5 h-5" />;
      default: return <ChevronRight className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 relative">
      {/* Visual Signal Toast */}
      <AnimatePresence>
        {showSignal && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[120] px-6 py-3 bg-black text-white rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-2xl border border-white/10"
          >
            <Activity className="w-3 h-3 text-green-400 animate-pulse" />
            Strategic Data Logged
            <div className="w-1 h-1 rounded-full bg-white/20" />
            Depth +{(lastAnsweredValue || 0) * 2.5}%
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 bg-black rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer"
              onClick={() => window.location.reload()}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-white font-black text-lg relative z-10">C</span>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter text-gray-900 uppercase">Culturisk Diagnostic</h2>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Phase {currentPhase.id} / 10</p>
                <div className="w-1 h-1 rounded-full bg-gray-200" />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {currentPhaseIndex < 3 ? "Foundation" : currentPhaseIndex < 6 ? "Execution" : "Strategy"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Strategic Depth</span>
              </div>
              <div className="flex gap-0.5">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-3 h-1 rounded-full transition-all duration-500",
                      i < (progress / 10) ? "bg-black" : "bg-gray-100"
                    )} 
                  />
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-gray-900">{Math.round(progress)}%</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Completion</p>
            </div>
          </div>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-black relative z-10"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="wait">
          {isPhaseLocked(currentPhaseIndex) ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-12 rounded-2xl border border-gray-100 shadow-xl text-center space-y-6"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-10 h-10 text-gray-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Premium Analysis Locked</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  Phase 2–10 unlock deeper strategic insights, persona-based analysis, and your full consulting-grade report.
                </p>
              </div>
              <button
                onClick={() => signIn()}
                className="px-10 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-2xl flex items-center gap-4 mx-auto group"
              >
                <Sparkles className="w-5 h-5 group-hover:scale-125 transition-transform" />
                Unlock Strategic Intelligence
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 lg:p-12 rounded-2xl border border-gray-100 shadow-xl space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">{currentPhase.title}</span>
                  </div>
                  <div className="flex gap-1">
                    {phases.map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "w-2 h-1 rounded-full transition-all",
                          i === currentPhaseIndex ? "w-4 bg-black" : i < currentPhaseIndex ? "bg-green-500" : "bg-gray-100"
                        )} 
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight tracking-tighter">
                  {currentQuestion.text}
                </h3>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.value;
                  return (
                    <motion.button
                      key={option.label}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.value)}
                      className={cn(
                        "w-full p-5 text-left rounded-xl border-2 transition-all group flex items-center justify-between",
                        getOptionStyles(option.value, isSelected)
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                          isSelected ? "bg-white/20" : "bg-gray-50 group-hover:bg-gray-100"
                        )}>
                          <span className="text-[10px] font-black">{option.value}</span>
                        </div>
                        <span className="font-bold text-lg">{option.label}</span>
                      </div>
                      <div className={cn(
                        "transition-all duration-300",
                        isSelected ? "scale-110" : "opacity-30 group-hover:opacity-100"
                      )}>
                        {getOptionIcon(option.value)}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                <button
                  onClick={() => {
                    if (currentQuestionIndex > 0) {
                      setCurrentQuestionIndex(currentQuestionIndex - 1);
                    } else if (currentPhaseIndex > 0) {
                      setCurrentPhaseIndex(currentPhaseIndex - 1);
                      setCurrentQuestionIndex(phases[currentPhaseIndex - 1].questions.length - 1);
                    }
                  }}
                  disabled={currentPhaseIndex === 0 && currentQuestionIndex === 0}
                  className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Previous</span>
                </button>
                <div className="text-xs font-mono text-gray-400 uppercase flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Question {currentQuestionIndex + 1} / {currentPhase.questions.length}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {showMilestoneModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="p-8 lg:p-10 text-center space-y-8">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto rotate-3 group-hover:rotate-0 transition-transform">
                  <Sparkles className="w-10 h-10 text-black" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                    Milestone Reached
                  </h3>
                  <p className="text-gray-500 font-medium">
                    You've answered {answeredQuestions} questions. You can generate a partial report now or continue for deeper strategic intelligence.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => {
                      setShowMilestoneModal(false);
                      finishAssessment(answers);
                    }}
                    className="w-full p-6 bg-white border-2 border-gray-100 rounded-2xl flex items-center gap-4 hover:border-black hover:bg-gray-50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-black uppercase tracking-tighter text-gray-900">Analyze & Generate Report</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">See current insights</p>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => setShowMilestoneModal(false)}
                    className="w-full p-6 bg-black text-white rounded-2xl flex items-center gap-4 hover:bg-gray-800 transition-all group shadow-xl"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Target className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-black uppercase tracking-tighter">Continue Diagnostic</p>
                      <p className="text-xs text-white/50 font-bold uppercase tracking-widest">Target more questions</p>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto text-white/30 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Strategic intelligence increases with every answer
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {isSaving && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-black animate-spin mx-auto" />
            <p className="text-lg font-black uppercase tracking-tighter">Finalizing Assessment...</p>
          </div>
        </div>
      )}
    </div>
  );
};
