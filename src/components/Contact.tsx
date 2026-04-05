import React from "react";
import { motion } from "motion/react";
import { Mail, Phone, Globe, ArrowLeft, Send } from "lucide-react";

export const Contact: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Contact Us</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              Have questions about your diagnostic report or want to book a deep-dive strategy call? Get in touch with our team.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email</p>
                  <a href="mailto:culturisk@gmail.com" className="font-bold text-gray-900 hover:underline">
                    culturisk@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Phone className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone</p>
                  <a href="tel:+917620758648" className="font-bold text-gray-900 hover:underline">
                    +91 7620758648
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Globe className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Website</p>
                  <a href="https://culturisk.com" target="_blank" rel="noopener noreferrer" className="font-bold text-gray-900 hover:underline">
                    culturisk.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black text-white p-8 rounded-3xl shadow-2xl space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tighter">Send a Message</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Name</label>
                <input type="text" className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-sm focus:outline-none focus:border-white/50 transition-colors" placeholder="Your Name" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Email</label>
                <input type="email" className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-sm focus:outline-none focus:border-white/50 transition-colors" placeholder="Your Email" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Message</label>
                <textarea className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-sm focus:outline-none focus:border-white/50 transition-colors h-32 resize-none" placeholder="How can we help?"></textarea>
              </div>
              <button className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-gray-100 text-[10px] font-mono text-gray-400 uppercase text-center">
          © 2026 Culturisk Strategic Intelligence
        </div>
      </div>
    </motion.div>
  );
};
