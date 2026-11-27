import React from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquare, MapPin, ThumbsUp } from 'lucide-react';
import { Marquee } from './Marquee';
import { Badge } from './Badge';

interface ReviewItem {
  name: string;
  avatar: string;
  handle: string;
  location: string;
  rating: number;
  badge: string;
  timeAgo: string;
  story: string;
  category: 'Waterlogging' | 'Pothole' | 'Streetlight' | 'Safe Routing';
  upvotes: number;
}

export const CitizenReviews: React.FC = () => {
  const reviewsRow1: ReviewItem[] = [
    {
      name: 'Rohan Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
      handle: 'UrbanWatcher_2048',
      location: 'Silk Board, Bengaluru',
      rating: 5,
      badge: 'Flood Watcher',
      timeAgo: '2 hours ago',
      story: 'Silk Board underpass was 30cm underwater during sudden evening rain. Nav Bharat safe route diverted me via BTM Layout and saved my scooter from hydrolocking!',
      category: 'Safe Routing',
      upvotes: 48
    },
    {
      name: 'Priyanka Sen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      handle: 'RoadObserver_9021',
      location: 'Koramangala 80ft Rd, Bengaluru',
      rating: 5,
      badge: 'Civic Explorer',
      timeAgo: '5 hours ago',
      story: 'Flagged a severe asphalt crater that caused two accidents yesterday. AI vision scanned severity at 84/100, and BBMP road division patched it with photo proof in 19 hours!',
      category: 'Pothole',
      upvotes: 62
    },
    {
      name: 'Amitabh Verma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      handle: 'CityGuardian_4821',
      location: 'Connaught Place, Delhi NCR',
      rating: 5,
      badge: 'Top Verifier',
      timeAgo: 'Yesterday',
      story: 'Love the EXIF privacy guarantee. I can snap hazardous construction debris on my office commute without worrying about anyone scraping my private phone or home coordinates.',
      category: 'Waterlogging',
      upvotes: 35
    },
    {
      name: 'Sneha Kulkarni',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
      handle: 'MetroCommuter_412',
      location: 'Western Express Highway, Mumbai',
      rating: 5,
      badge: 'Community Hero',
      timeAgo: 'Yesterday',
      story: 'Milan subway flooding was accurately mapped on the Doppler radar 40 minutes before traffic police barricaded it. This is exactly what Mumbaikars need every monsoon.',
      category: 'Waterlogging',
      upvotes: 91
    },
    {
      name: 'Mohd. Farhan',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      handle: 'Sentinel_Meerut',
      location: 'Delhi Road, Meerut (U.P.)',
      rating: 5,
      badge: 'Ward Corporator Link',
      timeAgo: '2 days ago',
      story: 'Reported blocked culvert near industrial bypass. Municipal sanitation squad unblocked the silt within 24 hours. The automated SLA countdown actually works!',
      category: 'Pothole',
      upvotes: 27
    }
  ];

  const reviewsRow2: ReviewItem[] = [
    {
      name: 'Dr. Ananya Roy',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
      handle: 'NightShift_Doc',
      location: 'Begumpet, Hyderabad',
      rating: 5,
      badge: 'Women Safety Watch',
      timeAgo: '3 hours ago',
      story: 'A stretch of 6 non-functional streetlights on my hospital night route was repaired by GHMC after our locality upvoted the ticket. Finally an app that municipal engineers actually take seriously.',
      category: 'Streetlight',
      upvotes: 84
    },
    {
      name: 'Vikramaditya Rao',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
      handle: 'CivicWatcher_99',
      location: 'Indiranagar 100ft Rd, Bengaluru',
      rating: 5,
      badge: 'Top Verifier',
      timeAgo: '6 hours ago',
      story: 'The duplicate detection with ImageHash is genius. Three of us photographed the same cave-in from different angles, and it grouped them into one ticket with 3x upvotes!',
      category: 'Pothole',
      upvotes: 53
    },
    {
      name: 'Kavita Nair',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      handle: 'EcoSentinel_Bengaluru',
      location: 'Bellandur Lake Road, Bengaluru',
      rating: 5,
      badge: 'Drainage Sentinel',
      timeAgo: '1 day ago',
      story: 'Real-time GeoJSON flood polygon overlaid directly onto the MapLibre GIS map made it crystal clear where the storm runoff was overflowing. Essential civic tech!',
      category: 'Waterlogging',
      upvotes: 41
    },
    {
      name: 'Suresh Patil',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
      handle: 'PuneCommuter_77',
      location: 'Hinjawadi IT Park, Pune',
      rating: 5,
      badge: 'Road Sentinel',
      timeAgo: '2 days ago',
      story: 'Avoided a 2-hour jam on Hinjawadi flyover because Nav Bharat flagged an unmapped trench 15 minutes before Google Maps showed congestion.',
      category: 'Safe Routing',
      upvotes: 76
    },
    {
      name: 'Tanya Banerjee',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80',
      handle: 'KolkataCivic_01',
      location: 'Park Street, Kolkata',
      rating: 5,
      badge: 'Active Verifier',
      timeAgo: '3 days ago',
      story: 'The photo proof requirement for government officers is what sets this apart. No more fake closed tickets—you can verify the before and after repair snapshots yourself.',
      category: 'Pothole',
      upvotes: 69
    }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-saffron/5 dark:bg-saffron/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10 text-center space-y-3">
        <Badge variant="saffron" className="px-3.5 py-1 font-bold">
          Everyday Commuter Stories
        </Badge>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          How Citizens Use <span className="bg-gradient-to-r from-saffron to-amber-500 bg-clip-text text-transparent">Nav Bharat</span> Every Day
        </h2>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Sample civic scenarios showing how daily commuters, neighborhood watch groups, and ward teams stay safe during monsoons and road repairs.
        </p>
      </div>

      {/* Row 1: Forward Marquee */}
      <div className="relative mb-6">
        <Marquee duration="40s" pauseOnHover={true} className="py-2">
          {reviewsRow1.map((rev, i) => (
            <div
              key={i}
              className="w-[380px] p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-soft-lg transition-all duration-300 tilt-card flex flex-col justify-between shrink-0"
            >
              <div>
                {/* User Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center space-x-1">
                        <span>{rev.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="text-[11px] font-mono text-saffron font-semibold">{rev.handle}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{rev.timeAgo}</span>
                </div>

                {/* Rating Stars & Location */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, rIdx) => (
                      <Star key={rIdx} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <div className="flex items-center space-x-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span>{rev.location}</span>
                  </div>
                </div>

                {/* Story */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{rev.story}"
                </p>
              </div>

              {/* Bottom Card Badges */}
              <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                  {rev.badge}
                </span>
                <div className="flex items-center space-x-1 text-slate-500 font-medium">
                  <ThumbsUp className="w-3 h-3 text-primary" />
                  <span>{rev.upvotes} verified</span>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>

      {/* Row 2: Reverse Marquee */}
      <div className="relative">
        <Marquee duration="45s" reverse={true} pauseOnHover={true} className="py-2">
          {reviewsRow2.map((rev, i) => (
            <div
              key={i}
              className="w-[380px] p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-soft-lg transition-all duration-300 tilt-card flex flex-col justify-between shrink-0"
            >
              <div>
                {/* User Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center space-x-1">
                        <span>{rev.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="text-[11px] font-mono text-saffron font-semibold">{rev.handle}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{rev.timeAgo}</span>
                </div>

                {/* Rating Stars & Location */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, rIdx) => (
                      <Star key={rIdx} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <div className="flex items-center space-x-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span>{rev.location}</span>
                  </div>
                </div>

                {/* Story */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{rev.story}"
                </p>
              </div>

              {/* Bottom Card Badges */}
              <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                  {rev.badge}
                </span>
                <div className="flex items-center space-x-1 text-slate-500 font-medium">
                  <ThumbsUp className="w-3 h-3 text-primary" />
                  <span>{rev.upvotes} verified</span>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>

    </section>
  );
};
