import CommunityPost from '../models/CommunityPost.js';
import User from '../models/User.js';

// Generate unique post ID
function generatePostId() {
  return `POST-${Math.floor(1000 + Math.random() * 9000)}`;
}

// Seed initial community posts if database has none
export const seedInitialCommunityPosts = async () => {
  const count = await CommunityPost.countDocuments();
  if (count > 0) return;

  await CommunityPost.create([
    {
      postId: 'POST-1001',
      authorAnonymousId: 'CityGuardian_4821',
      title: 'Monsoon Alert: Which underpasses to strictly avoid during evening peak rain?',
      content: 'Every monsoon, the Silk Board ramp and Domlur flyover underpass get submerged within 30 minutes of heavy downpour. Has the municipal drainage division stationed suction diesel pumps yet? Let’s map out safer elevated routes here.',
      category: 'waterlogging',
      flair: 'Monsoon Watch',
      locationTag: 'Silk Board & Domlur Corridor',
      upvotes: 38,
      upvotedBy: ['UrbanWatcher_2048', 'RoadObserver_9021'],
      commentsCount: 3,
      comments: [
        {
          commentId: 'COMM-1',
          authorAnonymousId: 'UrbanWatcher_2048',
          content: 'Confirmed, avoid the left slip lane under the flyover. Water reached car tyre rims yesterday at 6 PM. Take the outer ring road flyover instead.',
          upvotes: 14,
          createdAt: new Date(Date.now() - 3 * 3600 * 1000)
        },
        {
          commentId: 'COMM-2',
          authorAnonymousId: 'MetroShield_3310',
          content: 'Also sent a direct email to Stormwater Drainage department (drainage@cityshield.gov.in) with the geotagged photos. Hope they deploy pumps before 5 PM today.',
          upvotes: 9,
          createdAt: new Date(Date.now() - 2 * 3600 * 1000)
        },
        {
          commentId: 'COMM-3',
          authorAnonymousId: 'CivicSentinel_7092',
          content: 'Drainage team is actually on site right now! Check the Live Map, status was updated to In Progress 20 mins ago.',
          upvotes: 18,
          createdAt: new Date(Date.now() - 30 * 60 * 1000)
        }
      ]
    },
    {
      postId: 'POST-1002',
      authorAnonymousId: 'RoadObserver_9021',
      title: 'Organizing Sunday Community Footpath Cleanup & Waste Segregation Drive',
      content: 'Hey everyone, a 15-meter secondary garbage dump has accumulated along 4th Block sidewalk. Let’s assemble this Sunday at 8 AM with protective gloves to clear and bag the waste, then hand over directly to the BBMP compacting truck.',
      category: 'sanitation',
      flair: 'Cleanup Drive',
      locationTag: '4th Block Main Road',
      upvotes: 52,
      upvotedBy: ['CityGuardian_4821'],
      commentsCount: 2,
      comments: [
        {
          commentId: 'COMM-4',
          authorAnonymousId: 'GreenCivic_9912',
          content: 'Count me in! I will bring 30 heavy-duty compostable waste bags.',
          upvotes: 11,
          createdAt: new Date(Date.now() - 5 * 3600 * 1000)
        },
        {
          commentId: 'COMM-5',
          authorAnonymousId: 'UrbanWatcher_2048',
          content: 'I will coordinate with the Solid Waste Management team (waste@cityshield.gov.in) to ensure a municipal compactor truck arrives by 10 AM.',
          upvotes: 15,
          createdAt: new Date(Date.now() - 4 * 3600 * 1000)
        }
      ]
    },
    {
      postId: 'POST-1003',
      authorAnonymousId: 'NightCommuter_5521',
      title: 'Dark Stretch Alert: 6 Streetlights broken between Rest House Road & Metro exit',
      content: 'It becomes pitch dark after 7:30 PM. Pedestrians, especially women commuting from the station, feel very unsafe. Let’s upvote this so the Electrical Division gets an immediate notification alert.',
      category: 'safety',
      flair: 'Official Complaint',
      locationTag: 'Rest House Road',
      upvotes: 44,
      upvotedBy: [],
      commentsCount: 1,
      comments: [
        {
          commentId: 'COMM-6',
          authorAnonymousId: 'CityGuardian_4821',
          content: 'Upvoted! Also filed report CS-2026-1004. You can click the "Direct Email to Official" button to send an escalation directly to lighting@cityshield.gov.in.',
          upvotes: 12,
          createdAt: new Date(Date.now() - 1 * 3600 * 1000)
        }
      ]
    }
  ]);
};

// Get all community discussion posts
export const getCommunityPosts = async (req, res) => {
  try {
    const { category, flair, sort = 'hot', search } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    if (flair && flair !== 'all') {
      query.flair = flair;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { locationTag: { $regex: search, $options: 'i' } }
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'hot') {
      // Hot: combination of upvotes and comments
      sortObj = { upvotes: -1, createdAt: -1 };
    } else if (sort === 'top') {
      sortObj = { upvotes: -1 };
    } else if (sort === 'new') {
      sortObj = { createdAt: -1 };
    }

    const posts = await CommunityPost.find(query).sort(sortObj).limit(50);
    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new discussion post
export const createCommunityPost = async (req, res) => {
  try {
    const { title, content, category, flair, locationTag } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const authorAnonymousId = req.user?.anonymousId || req.body.anonymousId || `CityWatcher_${Math.floor(1000 + Math.random() * 9000)}`;

    const newPost = await CommunityPost.create({
      postId: generatePostId(),
      authorAnonymousId,
      title: title.trim(),
      content: content.trim(),
      category: category || 'general',
      flair: flair || 'Discussion',
      locationTag: locationTag || 'My Neighborhood',
      upvotes: 1,
      upvotedBy: [authorAnonymousId],
      commentsCount: 0,
      comments: []
    });

    // Award citizen points if logged in
    if (req.user) {
      req.user.citizenPoints += 10;
      await req.user.save();
    }

    // Emit live real-time event to all connected citizens
    if (req.app.get('io')) {
      const io = req.app.get('io');
      io.emit('new_community_post', newPost);
    }

    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upvote or Downvote post (Reddit-style karma)
export const voteCommunityPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { direction } = req.body; // 'up' or 'down'
    const voterId = req.user?.anonymousId || req.body.anonymousId || 'AnonymousVoter';

    const post = await CommunityPost.findOne({ postId });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Discussion post not found.' });
    }

    if (direction === 'up') {
      if (post.upvotedBy.includes(voterId)) {
        // Toggle remove upvote
        post.upvotes -= 1;
        post.upvotedBy = post.upvotedBy.filter(id => id !== voterId);
      } else {
        post.upvotes += 1;
        post.upvotedBy.push(voterId);
        // Remove downvote if previously downvoted
        if (post.downvotedBy.includes(voterId)) {
          post.downvotes = Math.max(0, post.downvotes - 1);
          post.downvotedBy = post.downvotedBy.filter(id => id !== voterId);
        }
      }
    } else if (direction === 'down') {
      if (post.downvotedBy.includes(voterId)) {
        // Toggle remove downvote
        post.downvotes = Math.max(0, post.downvotes - 1);
        post.downvotedBy = post.downvotedBy.filter(id => id !== voterId);
      } else {
        post.downvotes += 1;
        post.downvotedBy.push(voterId);
        if (post.upvotedBy.includes(voterId)) {
          post.upvotes = Math.max(0, post.upvotes - 1);
          post.upvotedBy = post.upvotedBy.filter(id => id !== voterId);
        }
      }
    }

    await post.save();

    // Broadcast vote update
    if (req.app.get('io')) {
      req.app.get('io').emit('community_post_voted', {
        postId: post.postId,
        upvotes: post.upvotes,
        downvotes: post.downvotes
      });
    }

    res.json({
      success: true,
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      score: post.upvotes - post.downvotes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a comment to a discussion thread
export const addCommentToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content cannot be empty.' });
    }

    const post = await CommunityPost.findOne({ postId });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Discussion post not found.' });
    }

    const authorAnonymousId = req.user?.anonymousId || req.body.anonymousId || `Citizen_${Math.floor(1000 + Math.random() * 9000)}`;

    const newComment = {
      commentId: `COMM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      authorAnonymousId,
      content: content.trim(),
      upvotes: 1,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    post.commentsCount = post.comments.length;
    await post.save();

    // Award commenter points
    if (req.user) {
      req.user.citizenPoints += 5;
      await req.user.save();
    }

    // Broadcast new comment via Socket.IO
    if (req.app.get('io')) {
      req.app.get('io').emit('new_community_comment', {
        postId: post.postId,
        comment: newComment,
        commentsCount: post.commentsCount
      });
    }

    res.status(201).json({ success: true, comment: newComment, commentsCount: post.commentsCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
