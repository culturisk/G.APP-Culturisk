import React from "react";
import { motion } from "motion/react";
import { FileText, ArrowLeft } from "lucide-react";

export const Terms: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-white z-[100] overflow-y-auto p-6 md:p-12"
    >
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onClose}
          className="mb-12 flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to App
        </button>

        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Terms of Service</h1>
        </div>

        <div className="prose prose-sm max-w-none prose-headings:uppercase prose-headings:tracking-widest prose-headings:font-black space-y-8 text-gray-600">
          <section>
            <h2 className="text-black">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Culturisk AI Business & Marketing Risk Calculator, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-black">2. Use of Service</h2>
            <p>
              The Culturisk diagnostic tool is provided for informational and strategic analysis purposes. While we strive for accuracy, the intelligence reports generated are based on AI analysis and user-provided data. They should not be considered legal or financial advice.
            </p>
          </section>

          <section>
            <h2 className="text-black">3. User Accounts</h2>
            <p>
              To access premium phases and save reports, you must sign in with a Google account. You are responsible for maintaining the security of your account and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-black">4. Intellectual Property</h2>
            <p>
              The Culturisk name, logo, and diagnostic framework are the intellectual property of Culturisk. Strategic reports generated for you are for your personal or business use.
            </p>
          </section>

          <section>
            <h2 className="text-black">5. Limitation of Liability</h2>
            <p>
              Culturisk shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
            </p>
          </section>

          <section>
            <h2 className="text-black">6. Contact Us</h2>
            <p>
              For any questions regarding these terms, please contact:
              <br />
              Email: culturisk@gmail.com
              <br />
              Phone: +91 7620758648
            </p>
          </section>
        </div>

        <div className="mt-24 pt-8 border-t border-gray-100 text-[10px] font-mono text-gray-400 uppercase">
          Last Updated: April 4, 2026
        </div>
      </div>
    </motion.div>
  );
};
