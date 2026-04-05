import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "The Cultural Disconnect in Modern B2B Marketing",
    excerpt: "Why most SaaS companies fail to resonate with their audience's core values and how to fix it.",
    author: "Strategic Team",
    date: "Oct 12, 2025",
    category: "Strategy",
    image: "https://picsum.photos/seed/strategy/800/400"
  },
  {
    id: 2,
    title: "Diagnosing Business DNA: A New Framework",
    excerpt: "Moving beyond SWOT analysis into deep multi-layer diagnostic intelligence.",
    author: "Consulting Lead",
    date: "Oct 10, 2025",
    category: "Intelligence",
    image: "https://picsum.photos/seed/dna/800/400"
  },
  {
    id: 3,
    title: "The ROI of Brutal Honesty",
    excerpt: "How facing uncomfortable truths about your product-market fit can accelerate growth.",
    author: "Growth Expert",
    date: "Oct 08, 2025",
    category: "Growth",
    image: "https://picsum.photos/seed/honesty/800/400"
  }
];

export const Blog: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
      <div className="mb-16 space-y-4">
        <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase">Strategic Insights</h2>
        <p className="text-xl text-gray-500 max-w-2xl font-medium">
          Deep dives into business risk, marketing intelligence, and cultural alignment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {posts.map((post) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
          >
            <div className="aspect-video rounded-2xl overflow-hidden mb-6 border border-gray-100 shadow-sm">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {post.category}</span>
              </div>
              <h3 className="text-2xl font-black tracking-tighter leading-tight group-hover:underline">
                {post.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                Read Article <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};
