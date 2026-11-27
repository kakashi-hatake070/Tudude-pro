import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ArrowBigUp,
  ArrowBigDown,
  Sparkles,
  Flame,
  Clock,
  Award,
  Send,
  PlusCircle,
  Mail,
  MapPin,
  Tag,
  Share2,
  AlertTriangle,
  Users,
  Search,
  CheckCircle,
  X,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { socket } from '../services/socket';
import { CommunityPost, CommunityComment } from '../types';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState<'hot' | 'new' | 'top'>('hot');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Expanded comments for posts: { [postId]: boolean }
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({});

  // New Post Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<any>('general');
  const [newFlair, setNewFlair] = useState<any>('Discussion');
  const [newLocationTag, setNewLocationTag] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);

  // Direct Mail Modal
  const [mailPost, setMailPost] = useState<CommunityPost | null>(null);

  // User session
  const rawUser = localStorage.getItem('cs_user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const currentAnonymousId = user ? user.anonymousId : 'CivicObserver';

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.getCommunityPosts({
        sort: selectedSort,
        category: selectedCategory,
        search: searchQuery
      });
      setPosts(res.posts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedSort, selectedCategory]);

  // Real-time socket events
  useEffect(() => {
    socket.on('new_community_post', (post: CommunityPost) => {
      setPosts(prev => [post, ...prev]);
    });

    socket.on('community_post_voted', (data: { postId: string; upvotes: number; downvotes: number }) => {
      setPosts(prev => prev.map(p => {
        if (p.postId === data.postId) {
          return { ...p, upvotes: data.upvotes, downvotes: data.downvotes };
        }
        return p;
      }));
    });

    socket.on('new_community_comment', (data: { postId: string; comment: CommunityComment; commentsCount: number }) => {
      setPosts(prev => prev.map(p => {
        if (p.postId === data.postId) {
          return {
            ...p,
            commentsCount: data.commentsCount,
            comments: [...p.comments, data.comment]
          };
        }
        return p;
      }));
    });

    return () => {
      socket.off('new_community_post');
      socket.off('community_post_voted');
      socket.off('new_community_comment');
    };
  }, []);

  const handleVote = async (postId: string, direction: 'up' | 'down') => {
    try {
      const res = await api.voteCommunityPost(postId, direction, currentAnonymousId);
      setPosts(prev => prev.map(p => {
        if (p.postId === postId) {
          return { ...p, upvotes: res.upvotes, downvotes: res.downvotes };
        }
        return p;
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    setSubmittingComment(prev => ({ ...prev, [postId]: true }));
    try {
      const res = await api.addCommentToPost(postId, text, currentAnonymousId);
      setPosts(prev => prev.map(p => {
        if (p.postId === postId) {
          return {
            ...p,
            commentsCount: res.commentsCount,
            comments: [...p.comments, res.comment]
          };
        }
        return p;
      }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (e: any) {
      alert(e.message || 'Could not post reply');
    } finally {
      setSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setCreatingPost(true);
    try {
      const res = await api.createCommunityPost({
        title: newTitle,
        content: newContent,
        category: newCategory,
        flair: newFlair,
        locationTag: newLocationTag || 'My Area',
        anonymousId: currentAnonymousId
      });
      setPosts(prev => [res.post, ...prev]);
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
      setNewLocationTag('');
    } catch (e: any) {
      alert(e.message || 'Failed to submit post');
    } finally {
      setCreatingPost(false);
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const flairs = [
    { label: 'All Topics', key: 'all' },
    { label: '🌊 Monsoon Watch', key: 'waterlogging' },
    { label: '🚧 Roads & Potholes', key: 'roads' },
    { label: '🛡️ Safety & Lights', key: 'safety' },
    { label: '🧹 Waste & Cleanup', key: 'sanitation' },
    { label: '💡 Smart City Ideas', key: 'civic_ideas' },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <DisclaimerBanner variant="independent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Forum Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-primary-dark to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-soft-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-secondary text-white text-xs font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>Reddit-Style Civic Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Community Discussion & Direct Escalation
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Anonymous community forum where citizens discuss civic hazards, organize cleanup drives, share monsoon traffic warnings, and escalate issues directly to municipal departments.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-3 bg-secondary hover:bg-secondary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start Discussion</span>
            </button>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-soft flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Reddit Sort: Hot, New, Top */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedSort('hot')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedSort === 'hot' ? 'bg-white text-secondary shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Hot</span>
            </button>
            <button
              onClick={() => setSelectedSort('new')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedSort === 'new' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
            <button
              onClick={() => setSelectedSort('top')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedSort === 'top' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>

          {/* Topic Flairs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            {flairs.map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedCategory(f.key)}
                className={`px-3 py-1.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
                  selectedCategory === f.key
                    ? 'bg-primary text-white font-bold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPosts()}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

        </div>

        {/* Discussion Posts Feed */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
              <span>Loading civic discussion threads...</span>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => {
              const score = (post.upvotes || 0) - (post.downvotes || 0);
              const isExpanded = !!expandedComments[post.postId];

              return (
                <div
                  key={post.postId}
                  className="bg-white rounded-3xl border border-slate-200 shadow-soft hover:shadow-soft-md transition-shadow overflow-hidden"
                >
                  <div className="flex items-start">
                    
                    {/* Reddit Style Left Upvote/Downvote Rail */}
                    <div className="p-4 sm:p-5 flex flex-col items-center bg-slate-50/70 border-r border-slate-100 text-slate-600 select-none">
                      <button
                        onClick={() => handleVote(post.postId, 'up')}
                        title="Upvote"
                        className="p-1 hover:text-secondary rounded hover:bg-amber-100/50 transition-colors"
                      >
                        <ArrowBigUp className="w-6 h-6 fill-current hover:scale-110 transition-transform" />
                      </button>
                      
                      <span className="font-extrabold text-sm my-1 font-mono text-slate-900">
                        {score}
                      </span>
                      
                      <button
                        onClick={() => handleVote(post.postId, 'down')}
                        title="Downvote"
                        className="p-1 hover:text-blue-600 rounded hover:bg-blue-100/50 transition-colors"
                      >
                        <ArrowBigDown className="w-6 h-6 fill-current hover:scale-110 transition-transform" />
                      </button>
                    </div>

                    {/* Main Post Content */}
                    <div className="p-5 flex-1 space-y-3">
                      
                      {/* Meta header */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-primary-light text-primary font-bold text-[10px] uppercase">
                          {post.flair}
                        </span>
                        
                        <span className="font-mono text-text-muted">
                          Posted by <strong className="text-slate-800 font-semibold">{post.authorAnonymousId}</strong>
                        </span>

                        <span className="text-slate-300">•</span>
                        
                        <span className="text-text-muted flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-secondary" />
                          <span>{post.locationTag}</span>
                        </span>

                        <span className="text-slate-300">•</span>

                        <span className="text-text-muted">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Title & Body */}
                      <div>
                        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                          {post.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-wrap">
                          {post.content}
                        </p>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-slate-100 text-xs">
                        
                        <button
                          onClick={() => toggleComments(post.postId)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-primary" />
                          <span>{post.commentsCount || 0} Replies</span>
                        </button>

                        {/* Direct Email to Government Button */}
                        <button
                          onClick={() => setMailPost(post)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-secondary" />
                          <span>Direct Email to Officer</span>
                        </button>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Link copied to clipboard!');
                          }}
                          className="flex items-center space-x-1 text-text-muted hover:text-slate-800 font-medium px-2 py-1"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </button>

                      </div>

                      {/* Expandable Comments Section */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 bg-slate-50/50 p-4 rounded-2xl">
                          <div className="font-bold text-xs text-slate-800">
                            Community Discussion ({post.comments?.length || 0})
                          </div>

                          {/* Comments List */}
                          <div className="space-y-2.5">
                            {post.comments && post.comments.length > 0 ? (
                              post.comments.map((comment) => (
                                <div key={comment.commentId} className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-mono font-bold text-primary">{comment.authorAnonymousId}</span>
                                    <span className="text-text-muted">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <p className="text-slate-700 leading-relaxed">{comment.content}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-text-muted italic">No comments yet. Start the conversation!</p>
                            )}
                          </div>

                          {/* Add Comment Input */}
                          <div className="flex items-center space-x-2 pt-2">
                            <input
                              type="text"
                              placeholder={`Reply anonymously as ${currentAnonymousId}...`}
                              value={commentInputs[post.postId] || ''}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [post.postId]: e.target.value })}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.postId)}
                              className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                            />
                            <button
                              onClick={() => handleAddComment(post.postId)}
                              disabled={submittingComment[post.postId]}
                              className="p-2 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-xs transition-all flex items-center justify-center"
                            >
                              {submittingComment[post.postId] ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                        </div>
                      )}

                    </div>

                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No community posts found matching this filter.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover"
              >
                Create the First Post
              </button>
            </div>
          )}
        </div>

      </div>

      {/* CREATE POST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                Create Community Discussion Thread
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Thread Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Warning: Open trench dug up without barricades on Sector 14 road"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Category Flair
                  </label>
                  <select
                    value={newFlair}
                    onChange={(e) => setNewFlair(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                  >
                    <option value="Discussion">Discussion</option>
                    <option value="Monsoon Watch">Monsoon Watch</option>
                    <option value="Hazard Alert">Hazard Alert</option>
                    <option value="Cleanup Drive">Cleanup Drive</option>
                    <option value="Official Complaint">Official Complaint</option>
                    <option value="Solution Idea">Solution Idea</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Location Tag / Ward
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Noida Sec 62, Indiranagar, etc."
                    value={newLocationTag}
                    onChange={(e) => setNewLocationTag(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Discussion Content & Context
                </label>
                <textarea
                  rows={4}
                  placeholder="Share details, commuter risk, advice, or suggestions..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-text-muted">
                Posting as anonymous citizen: <strong className="text-primary font-mono">{currentAnonymousId}</strong>. You will earn +10 Civic Points.
              </div>

              <button
                type="submit"
                disabled={creatingPost}
                className="w-full py-3 bg-secondary hover:bg-secondary-hover text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {creatingPost ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                <span>Post to Community Hub</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DIRECT EMAIL TO GOVERNMENT MODAL */}
      {mailPost && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-secondary" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Direct Official Escalation Email
                </h3>
              </div>
              <button
                onClick={() => setMailPost(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Send a pre-formatted formal complaint letter directly to municipal authorities. Select which department handles this issue:
            </p>

            {/* Department Email Options */}
            <div className="space-y-2">
              {[
                { name: 'Roads & Major Infrastructure Engineering', email: 'roads@cityshield.gov.in', dept: 'Potholes, craters, broken asphalt' },
                { name: 'Stormwater Drainage & Flood Mitigation Division', email: 'drainage@cityshield.gov.in', dept: 'Waterlogging, desilting, submerged roads' },
                { name: 'Solid Waste Management Division', email: 'waste@cityshield.gov.in', dept: 'Garbage dumps, footpath blockages' },
                { name: 'Street Lighting & Electrical Maintenance', email: 'lighting@cityshield.gov.in', dept: 'Broken streetlights, dark stretches' },
                { name: 'Municipal Commissioner Executive Office', email: 'commissioner@cityshield.gov.in', dept: 'General urgent escalation' }
              ].map((d, i) => {
                const subject = encodeURIComponent(`[OFFICIAL CIVIC COMPLAINT] ${mailPost.title} (${mailPost.locationTag})`);
                const body = encodeURIComponent(
                  `Respected Municipal Officer / Department Head,\n\nI am escalating an urgent civic infrastructure issue reported through CityShield AI civic intelligence platform.\n\n` +
                  `ISSUE REF: ${mailPost.postId}\n` +
                  `LOCATION: ${mailPost.locationTag}\n` +
                  `SUBJECT: ${mailPost.title}\n\n` +
                  `DESCRIPTION:\n${mailPost.content}\n\n` +
                  `COMMUNITY SUPPORT: ${mailPost.upvotes} citizens have upvoted and verified this hazard.\n\n` +
                  `We request immediate site inspection and rectification under Municipal Citizen Charter SLAs.\n\n` +
                  `Regards,\nCitizen Reporter (${mailPost.authorAnonymousId})\nDispatched via CityShield AI Civic Platform`
                );

                return (
                  <a
                    key={i}
                    href={`mailto:${d.email}?subject=${subject}&body=${body}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-slate-50 hover:bg-primary-light border border-slate-200 hover:border-primary/40 rounded-2xl block transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 group-hover:text-primary">{d.name}</span>
                      <span className="font-mono text-primary font-bold text-[11px]">{d.email}</span>
                    </div>
                    <div className="text-[11px] text-text-muted mt-0.5">{d.dept}</div>
                  </a>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-text-muted text-center">
              Clicking any department opens your default email app with the formal letter pre-filled.
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
