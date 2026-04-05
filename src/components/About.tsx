import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Zap, BarChart3, Globe, Users, Target } from "lucide-react";

export const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <Globe className="w-3 h-3 text-black" /> Global Strategic Intelligence
          </div>
          <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
            We Diagnose <br />
            <span className="text-gray-400">What Others Ignore.</span>
          </h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            Culturisk is a hybrid strategic intelligence platform. We combine the precision of AI-driven diagnostics with the depth of high-level business consulting.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-3xl font-black tracking-tighter uppercase">500+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Founders Diagnosed</p>
            </div>
            <div>
              <p className="text-3xl font-black tracking-tighter uppercase">100+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Risk Dimensions</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-2xl rotate-3">
            <img
              src="https://picsum.photos/seed/about/1000/1000"
              alt="About Culturisk"
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -left-10 p-8 bg-black text-white rounded-3xl shadow-2xl -rotate-3 max-w-xs">
            <p className="text-sm font-bold uppercase tracking-widest mb-2 italic">"Brutal honesty is the only way to achieve sustainable growth."</p>
            <p className="text-[10px] font-mono uppercase tracking-widest opacity-50">— Culturisk Philosophy</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { icon: ShieldCheck, title: "Risk Mitigation", desc: "Identifying hidden business and marketing risks before they become critical failures." },
          { icon: Zap, title: "Strategic Speed", desc: "Rapid diagnostics that provide actionable intelligence in minutes, not months." },
          { icon: Target, title: "Cultural Precision", desc: "Ensuring your brand resonates with the core values and behaviors of your target audience." },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-10 bg-white border border-gray-100 rounded-3xl hover:shadow-xl transition-all"
          >
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-8">
              <item.icon className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4">{item.title}</h3>
            <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
