import React, { useState, useEffect } from "react";
import { Questionnaire } from "./components/Questionnaire";
import { Report } from "./components/Report";
import { Auth } from "./components/Auth";
import { Privacy } from "./components/Privacy";
import { Terms } from "./components/Terms";
import { Contact } from "./components/Contact";
import { Blog } from "./components/Blog";
import { About } from "./components/About";
import { Team } from "./components/Team";
import { AssessmentSession } from "./types";
import { auth, db, signIn } from "./lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, onSnapshot, orderBy, limit, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, History, ArrowRight, ShieldCheck, Zap, BarChart3, Globe, User, LogIn, CheckCircle2 } from "lucide-react";
import { cn } from "./lib/utils";

export default function App() {
  const [user] = useAuthState(auth);
  const [activeSession, setActiveSession] = useState<AssessmentSession | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [pastSessions, setPastSessions] = useState<AssessmentSession[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [activePage, setActivePage] = useState<"app" | "privacy" | "terms" | "contact" | "blog" | "about" | "team">("app");
  const [onboardingStep, setOnboardingStep] = useState<"none" | "auth" | "website" | "suggestion">("none");
  const [website, setWebsite] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
          setWebsite(userDoc.data().website || "");
        } else {
          const newProfile = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: Date.now()
          };
          await setDoc(doc(db, "users", user.uid), newProfile);
          setUserProfile(newProfile);
        }
      };
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "sessions"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(10)
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AssessmentSession));
        setPastSessions(sessions);
      });

      return () => unsubscribe();
    } else {
      setPastSessions([]);
    }
  }, [user]);

  const handleStartDiagnostic = () => {
    if (!user) {
      setOnboardingStep("auth");
    } else if (!userProfile?.website) {
      setOnboardingStep("website");
    } else {
      setOnboardingStep("suggestion");
    }
  };

  const handleWebsiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && website) {
      await updateDoc(doc(db, "users", user.uid), { website });
      setUserProfile({ ...userProfile, website });
      setOnboardingStep("suggestion");
    }
  };

  const startQuestionnaire = () => {
    setOnboardingStep("none");
    setIsStarted(true);
  };

  const handleComplete = (session: AssessmentSession) => {
    setActiveSession(session);
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActivePage("app"); setIsStarted(false); }}>
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <span className="text-white font-black text-xs">C</span>
          </div>
          <span className="font-black text-xl tracking-tighter uppercase">Culturisk</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <button onClick={() => setActivePage("about")} className={cn("hover:text-black transition-colors", activePage === "about" && "text-black")}>About</button>
            <button onClick={() => setActivePage("team")} className={cn("hover:text-black transition-colors", activePage === "team" && "text-black")}>Team</button>
            <button onClick={() => setActivePage("blog")} className={cn("hover:text-black transition-colors", activePage === "blog" && "text-black")}>Blog</button>
          </div>
          {user && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors flex items-center gap-2"
            >
              <History className="w-4 h-4" /> History
            </button>
          )}
          <Auth />
        </div>
      </nav>

      <main className="relative">
        <AnimatePresence mode="wait">
          {activePage === "privacy" && <Privacy key="privacy" onClose={() => setActivePage("app")} />}
          {activePage === "terms" && <Terms key="terms" onClose={() => setActivePage("app")} />}
          {activePage === "contact" && <Contact key="contact" onClose={() => setActivePage("app")} />}
          {activePage === "blog" && <Blog key="blog" />}
          {activePage === "about" && <About key="about" />}
          {activePage === "team" && <Team key="team" />}
          
          {activePage === "app" && (
            <>
              {!isStarted ? (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-5xl mx-auto px-6 pt-4 pb-20 lg:pt-6 lg:pb-24 text-center space-y-6 lg:space-y-8"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <Sparkles className="w-3 h-3 text-black" /> Strategic Intelligence Engine
                  </div>
                  
                  <div className="space-y-3 lg:space-y-4">
                    <h1 className="text-5xl lg:text-8xl font-black tracking-tighter text-gray-900 leading-[0.85] uppercase">
                      Diagnose Your <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-700 to-gray-400">Business DNA.</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                      A multi-phase diagnostic system that evolves into a full strategic intelligence report. 
                      Uncover hidden risks and cultural disconnects before they break your growth.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={handleStartDiagnostic}
                      className="group px-8 py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-2xl flex items-center gap-3"
                    >
                      Start Diagnostic <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="text-left px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                            <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="user" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Trusted by Strategists</p>
                        <p className="text-[9px] text-gray-400 font-medium">Join 500+ high-intent founders</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                    {[
                      { icon: ShieldCheck, title: "Risk Analysis", desc: "100 weighted data points across 10 strategic phases." },
                      { icon: Zap, title: "Brutal Honesty", desc: "AI-powered strategic diagnosis with no fluff or generic advice." },
                      { icon: BarChart3, title: "Consulting Report", desc: "Premium downloadable PDF with actionable roadmaps." },
                    ].map((feature, i) => (
                      <div key={i} className="p-6 bg-white border border-gray-100 rounded-3xl text-left hover:shadow-xl transition-shadow">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                          <feature.icon className="w-5 h-5 text-black" />
                        </div>
                        <h3 className="text-base font-black uppercase tracking-tighter mb-1">{feature.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="questionnaire"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-7xl mx-auto px-6 py-12"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                      <Questionnaire onComplete={handleComplete} />
                    </div>
                    <div className="lg:col-span-4 hidden lg:block">
                      <div className="sticky top-24 space-y-6">
                        <div className="p-8 bg-black text-white rounded-3xl shadow-2xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-12 h-12" />
                          </div>
                          <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Diagnostic Intelligence</h3>
                          <p className="text-sm text-white/60 leading-relaxed mb-6">
                            Our engine analyzes your business across 100+ dimensions to uncover hidden risks.
                          </p>
                          <div className="space-y-4">
                            {[
                              { icon: ShieldCheck, title: "Risk Analysis", desc: "Deep weighted scoring." },
                              { icon: Zap, title: "Brutal Honesty", desc: "No fluff, just facts." },
                              { icon: BarChart3, title: "Consulting Report", desc: "Actionable roadmap." },
                            ].map((feature, i) => (
                              <div key={i} className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <feature.icon className="w-5 h-5 text-white shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-widest">{feature.title}</p>
                                  <p className="text-[10px] text-white/40 font-medium">{feature.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Current Status</p>
                          <p className="text-sm font-medium text-gray-900">Analysis in progress. Accuracy improves as you unlock more phases.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      {/* Onboarding Modals */}
      <AnimatePresence>
        {onboardingStep !== "none" && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="p-8 lg:p-10 text-center space-y-8">
                {onboardingStep === "auth" && (
                  <>
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto">
                      <LogIn className="w-10 h-10 text-black" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">Identity Check</h3>
                      <p className="text-gray-500 font-medium">Sign in with Google to save your diagnostic progress and unlock strategic history.</p>
                    </div>
                    <button
                      onClick={async () => {
                        await signIn();
                        handleStartDiagnostic();
                      }}
                      className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                      <LogIn className="w-5 h-5" /> Sign In with Google
                    </button>
                  </>
                )}

                {onboardingStep === "website" && (
                  <>
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto">
                      <Globe className="w-10 h-10 text-black" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">Business Context</h3>
                      <p className="text-gray-500 font-medium">What is your company's primary website? This helps our engine contextualize your diagnostic.</p>
                    </div>
                    <form onSubmit={handleWebsiteSubmit} className="space-y-4">
                      <input
                        type="url"
                        required
                        placeholder="https://yourcompany.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-black focus:outline-none transition-all font-medium"
                      />
                      <button
                        type="submit"
                        className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl"
                      >
                        Continue
                      </button>
                    </form>
                  </>
                )}

                {onboardingStep === "suggestion" && (
                  <>
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto">
                      <User className="w-10 h-10 text-black" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">Profile Ready</h3>
                      <p className="text-gray-500 font-medium">Your basic profile is set. You can further customize your business details later for even deeper analysis.</p>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={startQuestionnaire}
                        className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl flex items-center justify-center gap-3"
                      >
                        Start Assessment <ArrowRight className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          // In a real app, this would open a profile editor
                          // For now, we just start the questionnaire
                          startQuestionnaire();
                        }}
                        className="w-full py-4 bg-white text-gray-400 font-bold uppercase tracking-widest hover:text-black transition-colors"
                      >
                        Customize Later
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="bg-gray-50 p-4 text-center">
                <button onClick={() => setOnboardingStep("none")} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
                  Cancel Diagnostic
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[60] shadow-2xl border-l border-gray-100 flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-black uppercase tracking-tighter">Your History</h3>
                <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-black">
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {pastSessions.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-sm font-medium">No past assessments found.</p>
                  </div>
                ) : (
                  pastSessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setActiveSession(s);
                        setShowHistory(false);
                      }}
                      className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 text-left hover:border-black transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          {new Date(s.timestamp).toLocaleDateString()}
                        </span>
                        <div className="flex gap-1">
                          {Object.entries(s.scores || {}).slice(0, 3).map(([key, val]) => (
                            <div key={key} className="w-1 h-4 bg-black/10 rounded-full overflow-hidden">
                              <div className="w-full bg-black" style={{ height: `${val}%` }} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="font-bold text-gray-900 group-hover:underline">Assessment #{s.id.substring(0, 6)}</p>
                      <p className="text-xs text-gray-500 mt-1">Phase {s.currentPhase} reached • {Object.keys(s.answers).length} answers</p>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {activeSession && (
          <Report 
            session={activeSession} 
            userProfile={userProfile}
            onClose={() => setActiveSession(null)} 
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActivePage("app"); setIsStarted(false); }}>
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <span className="text-white font-black text-[10px]">C</span>
            </div>
            <span className="font-black text-sm tracking-tighter uppercase">Culturisk</span>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <button onClick={() => setActivePage("about")} className="hover:text-black transition-colors">About</button>
            <button onClick={() => setActivePage("team")} className="hover:text-black transition-colors">Team</button>
            <button onClick={() => setActivePage("blog")} className="hover:text-black transition-colors">Blog</button>
            <button onClick={() => setActivePage("privacy")} className="hover:text-black transition-colors">Privacy</button>
            <button onClick={() => setActivePage("terms")} className="hover:text-black transition-colors">Terms</button>
            <button onClick={() => setActivePage("contact")} className="hover:text-black transition-colors">Contact</button>
          </div>
          <p className="text-[10px] font-mono text-gray-400 uppercase">© 2026 Culturisk Strategic Intelligence</p>
        </div>
      </footer>
    </div>
  );
}
