import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, ShieldCheck, QrCode, Building2 } from 'lucide-react';
import { Badge } from './Badge';

interface FaqItem {
  question: string;
  answer: string;
  category: 'About NavBharat' | 'Reporting & Tracking' | 'AI & Smart Features' | 'Privacy & Roadmap';
  highlight?: boolean;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showAll, setShowAll] = useState<boolean>(false);

  const faqs: FaqItem[] = [
    {
      category: 'About NavBharat',
      question: 'What is NavBharat, and why was it developed?',
      answer:
        'NavBharat is an AI-powered smart city platform that helps citizens report public infrastructure problems and enables authorities to resolve them efficiently. It was developed to bridge the communication gap between citizens and municipal teams, improve transparency, and make Indian cities safer and cleaner.'
    },
    {
      category: 'Privacy & Roadmap',
      highlight: true,
      question:
        'What happens if 100+ complaints flood the same area on the Government Map? How will officers summarize them?',
      answer:
        'We have actively identified this real-world scaling challenge. Today, NavBharat already groups duplicate reports within an 80-meter radius and ranks hazards by risk score and citizen upvotes so urgent spots stand out first. When 100+ mixed complaints hit one locality at once, generating a natural-language briefing requires a dedicated LLM summarization API — marked in our Phase 2 Roadmap so that as soon as cloud API resources are provisioned, officers get a 1-click AI summary separating genuine emergencies from noise.'
    },
    {
      category: 'Reporting & Tracking',
      question: 'What types of problems can I report?',
      answer:
        'Any citizen can report potholes and damaged roads, overflowing garbage and waste management issues, waterlogging and blocked drainage, broken streetlights, public property damage, and traffic or road safety blackspots.'
    },
    {
      category: 'Reporting & Tracking',
      question: 'How can I report a problem, and can I upload photos or videos?',
      answer:
        'Use the 3-step Report Issue page to pick a category, confirm your GPS pin, and upload a photo or short video — or simply scan a Smart QR sticker on a dustbin, streetlight pole, or public toilet to submit a 1-tap report in 2 seconds with zero login required.'
    },
    {
      category: 'Reporting & Tracking',
      question: 'What happens after I submit a complaint, and can I track its status?',
      answer:
        'Your complaint is logged, categorized, and routed to the appropriate municipal department. You can track live status updates — Submitted, Verified, In Progress, and Resolved — and verify the after-repair photo proof once the fix is completed.'
    },
    {
      category: 'AI & Smart Features',
      question: 'How does AI Vision Detection work?',
      answer:
        'AI Vision Detection analyzes uploaded photos using computer vision to automatically identify and classify civic hazards (such as potholes, waterlogging, or garbage) and estimate severity so urgent issues get prioritized faster.'
    },
    {
      category: 'AI & Smart Features',
      question: 'How does Smart Worker & Dustbin Route Optimization help?',
      answer:
        'Instead of sending garbage trucks or repair crews down every street blindly, our route optimizer filters high-priority tasks (like dustbins 80%+ full) and generates the shortest dispatch route — saving municipal fuel, time, and effort.'
    },
    {
      category: 'Privacy & Roadmap',
      question: 'Is my personal information safe, and can I report anonymously?',
      answer:
        'Yes. NavBharat collects only the minimum details needed to resolve a complaint, uses anonymous citizen handles instead of real names, automatically removes hidden EXIF camera/GPS metadata from photos, and protects user data with controlled access.'
    },
    {
      category: 'AI & Smart Features',
      question: 'What are Predictive Problem Detection and Explainable AI?',
      answer:
        'Predictive Problem Detection uses historical incident and rainfall patterns to flag recurring flood or pothole hotspots before they become major emergencies. Explainable AI ensures citizens and officers can clearly see why a hazard received its category or risk score.'
    },
    {
      category: 'AI & Smart Features',
      question: 'Can I use NavBharat on my mobile phone or with low connectivity?',
      answer:
        'Yes. NavBharat is built for mobile-first access with a thumb-friendly bottom navigation bar, and its offline-ready PWA architecture is designed to support key features when connectivity drops and sync once you are back online.'
    },
    {
      category: 'Privacy & Roadmap',
      question: 'Does NavBharat support IoT sensors, a 3D Digital Twin, and a Voice AI Assistant?',
      answer:
        'Our platform architecture is designed to integrate with IoT infrastructure sensors (alongside our ₹5–₹10 Smart QR zero-hardware model) and includes planned roadmap modules for a Voice AI Assistant for hands-free accessibility and a 3D City Digital Twin for visual urban monitoring.'
    },
    {
      category: 'About NavBharat',
      question: 'Who can use NavBharat, and how can I get help?',
      answer:
        'Any citizen, daily commuter, neighborhood watch group, or municipal officer can use NavBharat. If you need assistance, you can reach out through the platform support channels or use the built-in National Emergency Helplines strip for urgent civic emergencies.'
    }
  ];

  const categories = [
    'All',
    'About NavBharat',
    'Reporting & Tracking',
    'AI & Smart Features',
    'Privacy & Roadmap'
  ];

  const filteredFaqs =
    activeCategory === 'All' ? faqs : faqs.filter((item) => item.category === activeCategory);

  const visibleFaqs =
    activeCategory === 'All' && !showAll ? filteredFaqs.slice(0, 7) : filteredFaqs;

  return (
    <section
      id="faqs"
      className="py-20 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <Badge variant="default" className="px-3.5 py-1 font-bold inline-flex items-center space-x-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Got Questions? We&apos;ve Got Clear Answers
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything citizens and officials need to know about NavBharat — building smarter cities, together.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(0);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {visibleFaqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.question}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  item.highlight
                    ? 'border-saffron/40 dark:border-saffron/40 bg-saffron-light/30 dark:bg-saffron/5'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-blue-400">
                        {item.category}
                      </span>
                      {item.highlight && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-saffron/15 text-saffron-dark dark:text-saffron text-[10px] font-bold">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Phase 2 AI Roadmap</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {item.question}
                    </h3>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary dark:text-blue-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/80">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Show More / Show Less Toggle when viewing All */}
        {activeCategory === 'All' && filteredFaqs.length > 7 && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
            >
              {showAll ? 'Show Fewer FAQs' : `View All ${filteredFaqs.length} FAQs`}
            </button>
          </div>
        )}

        {/* Bottom Quick Trust Strip */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Anonymous, privacy-first reporting</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-2.5">
            <QrCode className="w-4 h-4 text-saffron shrink-0" />
            <span>₹5–₹10 Smart QR asset stickers</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-2.5">
            <Building2 className="w-4 h-4 text-primary dark:text-blue-400 shrink-0" />
            <span>Phase 2 LLM cluster summarization</span>
          </div>
        </div>

      </div>
    </section>
  );
};
