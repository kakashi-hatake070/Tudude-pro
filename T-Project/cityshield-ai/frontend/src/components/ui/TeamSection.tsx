import React, { useState, useEffect } from 'react';
import {
  Award,
  Sparkles,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Code2,
  Palette,
  Megaphone,
  Compass,
  Crown
} from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  badge: string;
  education?: string;
  poster: string;
  quote: string;
  skills: string[];
  accent: string;
  icon: React.ElementType;
}

export const TeamSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const team: TeamMember[] = [
    {
      name: 'Garvit Sharma',
      role: 'Team Leader',
      badge: 'Team Leader',
      education: 'B.Tech (3rd Year)',
      poster: '/assets/team/garvit-sharma-poster.jpg',
      quote: 'Turning ideas into impact with a focused team and a shared purpose.',
      skills: ['Strategic Planning', 'Team Leadership', 'Problem Solving', 'Execution & Delivery'],
      accent: 'from-saffron to-amber-500',
      icon: Crown
    },
    {
      name: 'Kunal Sharma',
      role: 'Development & AI Lead',
      badge: 'Tech & AI Backbone',
      education: 'BCA (3rd Year)',
      poster: '/assets/team/kunal-sharma-poster.jpg',
      quote: 'Bridging creativity and technology to build a smarter, more efficient civic platform.',
      skills: ['Core Web Dev', 'AI Integration', 'Ideation & Tech', 'Scalable Features'],
      accent: 'from-primary to-blue-600',
      icon: Code2
    },
    {
      name: 'Nupur Jain',
      role: 'Social Media & Brand Identity',
      badge: 'Founding Member',
      poster: '/assets/team/nupur-jain-poster.jpg',
      quote: 'Shaping how Nav Bharat looks, feels, and connects with people online.',
      skills: ['Brand Identity', 'Video Editing', 'Design System', 'Social Strategy'],
      accent: 'from-pink-500 to-saffron',
      icon: Palette
    },
    {
      name: 'Deepanjali Ravinath Shukla',
      role: 'Communication & Presentation',
      badge: 'Founding Member',
      poster: '/assets/team/deepanjali-shukla-poster.jpg',
      quote: 'Leading project presentations, representing Nav Bharat, and bringing our vision to the right audience.',
      skills: ['Communication', 'Presentation', 'Team Coordination', 'Content & Ideation'],
      accent: 'from-indigo-500 to-primary',
      icon: Megaphone
    },
    {
      name: 'Ms. Rani',
      role: 'Lead UI/UX & User Research',
      badge: 'Founding Member',
      poster: '/assets/team/ms-rani-poster.jpg',
      quote: 'Designing intuitive, accessible, and impactful experiences that make civic engagement simple for every citizen.',
      skills: ['UI/UX Design', 'User Research', 'Creative Thinking', 'Product Design'],
      accent: 'from-emerald-500 to-teal-600',
      icon: Compass
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') setActiveIndex((prev) => (prev !== null ? (prev + 1) % team.length : null));
      if (e.key === 'ArrowLeft') setActiveIndex((prev) => (prev !== null ? (prev - 1 + team.length) % team.length : null));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, team.length]);

  const activeMember = activeIndex !== null ? team[activeIndex] : null;

  return (
    <section
      id="team"
      className="py-20 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden transition-colors duration-300"
    >
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-saffron/10 dark:bg-saffron/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 dark:bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-saffron-light dark:bg-saffron/20 border border-saffron/30 text-saffron-dark dark:text-saffron text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The People Behind Nav Bharat</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Meet Our{' '}
            <span className="bg-gradient-to-r from-saffron via-primary to-indiaGreen dark:via-blue-400 bg-clip-text text-transparent">
              Founding Team
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Click any team member&apos;s card to view their official Nav Bharat spotlight poster in full size.
          </p>
        </div>

        {/* 5-Member Responsive Grid: 2 top leads + 3 founding members on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {team.map((member, index) => {
            const Icon = member.icon;
            return (
              <div
                key={member.name}
                onClick={() => setActiveIndex(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveIndex(index);
                  }
                }}
                className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {/* Official Square Poster Preview */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
                  <img
                    src={member.poster}
                    alt={`${member.name} — ${member.role}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />

                  {/* Hover Zoom Overlay */}
                  <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/35 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/95 text-slate-900 text-xs font-bold shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-primary" />
                      <span>View Full Poster</span>
                    </span>
                  </div>

                  {/* Role Badge Pill */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${member.accent} text-white text-[11px] font-bold shadow-md`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{member.badge}</span>
                    </span>
                  </div>
                </div>

                {/* Member Info Footer */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                        {member.name}
                      </h3>
                      {member.education && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                          {member.education}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-saffron">{member.role}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 pt-0.5">
                      &ldquo;{member.quote}&rdquo;
                    </p>
                  </div>

                  {/* Focus Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Full-Screen Poster Lightbox Modal with Prev/Next */}
      {activeMember && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative max-w-xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/90 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white">{activeMember.name}</h4>
                <p className="text-[11px] text-saffron font-semibold">{activeMember.role}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-mono">
                  {activeIndex + 1} / {team.length}
                </span>
                <button
                  onClick={() => setActiveIndex(null)}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                  aria-label="Close poster"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Poster Image */}
            <div className="relative bg-slate-950">
              <img
                src={activeMember.poster}
                alt={activeMember.name}
                className="w-full h-auto max-h-[78vh] object-contain mx-auto"
              />

              {/* Prev / Next Controls */}
              <button
                onClick={() => setActiveIndex((activeIndex - 1 + team.length) % team.length)}
                aria-label="Previous team member"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white border border-white/15 shadow-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveIndex((activeIndex + 1) % team.length)}
                aria-label="Next team member"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white border border-white/15 shadow-lg transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
