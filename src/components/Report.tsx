import React, { useEffect, useState, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { AssessmentSession, RiskLevel } from "../types";
import { Loader2, Download, FileText, AlertTriangle, CheckCircle2, TrendingUp, Users, Target, DollarSign, Globe, ShieldAlert } from "lucide-react";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { cn } from "../lib/utils";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface ReportProps {
  session: AssessmentSession;
  userProfile?: any;
  onClose: () => void;
}

export const Report: React.FC<ReportProps> = ({ session, userProfile, onClose }) => {
  const [report, setReport] = useState<string | null>(session.report || null);
  const [loading, setLoading] = useState(!session.report);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      const isPartial = Object.keys(session.answers).length < 100;
      const prompt = `
        You are a world-class business and marketing strategist at Culturisk. 
        Analyze the following assessment data for a business and provide a brutally honest, consulting-grade strategic intelligence report.
        
        Business Context:
        - Website: ${userProfile?.website || "Not provided"}
        - User: ${userProfile?.displayName || "Anonymous"}
        
        ${isPartial ? "NOTE: This is a PARTIAL analysis based on early diagnostic data. Acknowledge this and focus on immediate signals while highlighting the need for deeper analysis." : "This is a COMPLETE diagnostic analysis."}
        
        Assessment Data:
        - Total Questions Answered: ${Object.keys(session.answers).length}
        - Phase Level Reached: ${session.currentPhase}
        - Scores (0-100):
          - Business Risk: ${session.scores?.business}
          - Marketing Risk: ${session.scores?.marketing}
          - Audience Understanding: ${session.scores?.audience}
          - Positioning Strength: ${session.scores?.positioning}
          - Cultural Alignment: ${session.scores?.cultural}
        
        The report MUST include these sections and use MARKDOWN TABLES where appropriate:
        1. Executive Summary (3-5 lines, sharp insight)
        2. Profile Breakdown (Business/Revenue model, target audience maturity)
        3. Multi-Layer Analysis (Use tables for comparison if possible):
           - Technical Analysis (Funnel, channels, execution)
           - Theoretical Analysis (Strategy vs fundamentals)
           - Socio-Cultural Analysis (Cultural disconnect, persona gaps)
           - Financial Analysis (Inefficiencies, ROI, scalability)
           - Emotional Analysis (Brand perception, resonance)
        4. Risk Breakdown (Top 5 risks, severity, impact - USE A TABLE)
        5. Opportunity Mapping (Undervalued moves, hidden advantages)
        6. Persona-Based Insight Layer (MANDATORY: Highlight if they think in personas or categories)
        7. Strategic Diagnosis (Blunt, what's fundamentally broken)
        8. Action Plan (Immediate, short-term, long-term - USE A TABLE)
        9. Culturisk Solution Layer (How culture-centric research helps)
        
        Tone: Brutally honest, no fluff, no generic advice. 
        Format: Professional Markdown with clear headings and tables.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setReport(response.text || "Failed to generate report.");
    } catch (error) {
      console.error("Error generating report:", error);
      setReport("An error occurred while generating the report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session.report) {
      generateReport();
    }
  }, [session]);

  const exportToPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      // Use a more reliable approach for PDF generation
      const pdf = new jsPDF("p", "mm", "a4");
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        windowWidth: reportRef.current.scrollWidth,
        windowHeight: reportRef.current.scrollHeight
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`CULTURISK_STRATEGIC_REPORT_${session.id.toUpperCase()}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to download report. Please try again or use a different browser.");
    } finally {
      setExporting(false);
    }
  };

  const chartData = [
    { subject: "Business", A: session.scores?.business || 0, fullMark: 100 },
    { subject: "Marketing", A: session.scores?.marketing || 0, fullMark: 100 },
    { subject: "Audience", A: session.scores?.audience || 0, fullMark: 100 },
    { subject: "Positioning", A: session.scores?.positioning || 0, fullMark: 100 },
    { subject: "Cultural", A: session.scores?.cultural || 0, fullMark: 100 },
  ];

  const getRiskLevel = (score: number): RiskLevel => {
    if (score < 40) return "High";
    if (score < 70) return "Moderate";
    return "Low";
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "High": return "text-red-600 bg-red-50 border-red-100";
      case "Moderate": return "text-orange-600 bg-orange-50 border-orange-100";
      case "Low": return "text-green-600 bg-green-50 border-green-100";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-black" />
            <h2 className="text-xl font-bold text-gray-900">Strategic Intelligence Report</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToPDF}
              disabled={loading || exporting}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all text-sm font-medium disabled:opacity-50"
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-12 h-12 text-black animate-spin" />
              <div className="text-center">
                <p className="text-lg font-medium text-gray-900">Analyzing your business DNA...</p>
                <p className="text-sm text-gray-500">Our AI strategist is crafting a brutally honest report.</p>
              </div>
            </div>
          ) : (
            <div ref={reportRef} className="bg-white p-12 shadow-sm rounded-xl border border-gray-100 relative overflow-hidden">
              {/* Watermark */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.05] rotate-[-45deg] select-none">
                <span className="text-[120px] font-black tracking-tighter">CULTURISK</span>
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12 border-b-2 border-black pb-8">
                  <div>
                    <h1 className="text-4xl font-black tracking-tighter text-black mb-2 uppercase">Culturisk Analysis</h1>
                    <p className="text-gray-500 font-mono text-sm">STRATEGIC INTELLIGENCE REPORT // {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="text-right font-mono text-xs text-gray-400">
                    <p>SESSION ID: {session.id}</p>
                    <p>PHASE REACHED: {session.currentPhase}</p>
                    <p>QUESTIONS: {Object.keys(session.answers).length}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold uppercase tracking-widest border-b border-gray-200 pb-2">Risk Matrix</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Business", score: session.scores?.business, icon: TrendingUp },
                        { label: "Marketing", score: session.scores?.marketing, icon: Target },
                        { label: "Audience", score: session.scores?.audience, icon: Users },
                        { label: "Positioning", score: session.scores?.positioning, icon: Globe },
                        { label: "Cultural", score: session.scores?.cultural, icon: ShieldAlert },
                      ].map((item) => {
                        const level = getRiskLevel(item.score || 0);
                        return (
                          <div key={item.label} className={cn("p-4 rounded-lg border transition-all", getRiskColor(level))}>
                            <div className="flex items-center justify-between mb-2">
                              <item.icon className="w-4 h-4" />
                              <span className="text-[10px] font-bold uppercase tracking-tighter">{level} Risk</span>
                            </div>
                            <p className="text-xs font-medium opacity-70 mb-1">{item.label}</p>
                            <p className="text-2xl font-black">{item.score}%</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="h-[300px] bg-gray-50 rounded-xl p-4 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 10, fontWeight: "bold" }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                          name="Business Health"
                          dataKey="A"
                          stroke="#000000"
                          fill="#000000"
                          fillOpacity={0.15}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mb-12">
                  <h3 className="text-lg font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-6">Comparative Analysis</h3>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="subject" type="category" tick={{ fill: "#6b7280", fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          cursor={{ fill: '#f9fafb' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="A" radius={[0, 4, 4, 0]} barSize={20}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.A < 40 ? '#ef4444' : entry.A < 70 ? '#f97316' : '#22c55e'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none prose-headings:uppercase prose-headings:tracking-widest prose-headings:font-black prose-p:text-gray-700 prose-li:text-gray-700 prose-table:border prose-table:border-gray-200 prose-th:bg-gray-50 prose-th:p-3 prose-td:p-3 prose-td:border-t prose-td:border-gray-100">
                  <ReactMarkdown>{report || ""}</ReactMarkdown>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                      <span className="text-white font-black text-xs">C</span>
                    </div>
                    <span className="font-bold text-sm tracking-tighter uppercase">Culturisk</span>
                  </div>
                  <a
                    href="https://culturisk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold uppercase tracking-widest hover:underline"
                  >
                    Book a Strategy Call
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
