import React from "react";
import { motion } from "motion/react";
import { Shield, ArrowLeft } from "lucide-react";

export const Privacy: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Privacy Policy</h1>
        </div>

        <div className="prose prose-sm max-w-none prose-headings:uppercase prose-headings:tracking-widest prose-headings:font-black space-y-8 text-gray-600">
          <section>
            <h2 className="text-black">1. Data Collection</h2>
            <p>
              Culturisk collects information you provide directly to us when you use our diagnostic tool. This includes your business profile, responses to assessment questions, and contact information if you choose to sign in with Google.
            </p>
          </section>

          <section>
            <h2 className="text-black">2. Use of Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect Culturisk and our users. Specifically, we use your data to generate strategic intelligence reports and provide personalized business advice.
            </p>
          </section>

          <section>
            <h2 className="text-black">3. Data Security</h2>
            <p>
              We use industry-standard security measures to protect your data. Your assessment sessions are stored securely in Firebase and are only accessible by you when authenticated.
            </p>
          </section>

          <section>
            <h2 className="text-black">4. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
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
