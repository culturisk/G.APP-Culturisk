import React from "react";
import { motion } from "motion/react";
import { Linkedin, Twitter, Globe } from "lucide-react";

const team = [
  {
    name: "Alex Thorne",
    role: "Strategic Intelligence Lead",
    bio: "Former management consultant with a focus on B2B SaaS growth and risk mitigation.",
    image: "https://picsum.photos/seed/alex/400/400"
  },
  {
    name: "Sarah Chen",
    role: "Cultural Anthropologist",
    bio: "Specializes in audience behavior and cultural alignment for global brands.",
    image: "https://picsum.photos/seed/sarah/400/400"
  },
  {
    name: "Marcus Vane",
    role: "AI & Data Architect",
    bio: "The mind behind our multi-phase diagnostic engine and predictive risk models.",
    image: "https://picsum.photos/seed/marcus/400/400"
  },
  {
    name: "Elena Rossi",
    role: "Growth Strategy Director",
    bio: "Helping high-intent founders convert diagnostic insights into scalable revenue.",
    image: "https://picsum.photos/seed/elena/400/400"
  }
];

export const Team: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
      <div className="mb-20 space-y-4">
        <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase">The Intelligence Team</h2>
        <p className="text-xl text-gray-500 max-w-2xl font-medium">
          A hybrid collective of strategists, data scientists, and cultural experts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {team.map((member, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            <div className="aspect-square rounded-3xl overflow-hidden mb-6 border border-gray-100 shadow-sm relative">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Linkedin className="w-4 h-4 text-black" />
                </button>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Twitter className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-tighter uppercase">{member.name}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{member.role}</p>
              <p className="text-sm text-gray-500 leading-relaxed pt-2">
                {member.bio}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
