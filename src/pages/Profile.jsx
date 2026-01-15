// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwnProfile = !userId || userId === currentUser?.id;
  const displayUserId = userId || currentUser?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!displayUserId) return;

      try {
        setLoading(true);
        setError('');

        // Fetch user profile
        const userProfile = isOwnProfile 
          ? await usersAPI.getMe()
          : await usersAPI.getUserById(displayUserId);
        setProfileUser(userProfile);

        // Fetch user posts
        const postsData = await postsAPI.getUserPosts(displayUserId);
        setPosts(postsData);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [displayUserId, isOwnProfile]);

  useEffect(() => {
    const fetchFollowData = async () => {
      if (!displayUserId) return;

      try {
        if (activeTab === 'followers') {
          const data = await usersAPI.getFollowers(displayUserId);
          setFollowers(data);
        } else if (activeTab === 'following') {
          const data = await usersAPI.getFollowing(displayUserId);
          setFollowing(data);
        }
      } catch (err) {
        console.error('Failed to fetch follow data:', err);
      }
    };

    if (activeTab === 'followers' || activeTab === 'following') {
      fetchFollowData();
    }
  }, [activeTab, displayUserId]);

  const handleFollow = async () => {
    try {
      const response = await usersAPI.followUser(displayUserId);
      setProfileUser({
        ...profileUser,
        following: response.following,
        followersCount: response.followersCount,
      });
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
    }
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handlePostLiked = (postId, updatedPost) => {
    setPosts(posts.map((post) => (post.id === postId ? updatedPost : post)));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2"
               style={{ borderColor: 'var(--color-primary-500)' }}></div>
          <p className="mt-4" style={{ color: 'var(--color-text-muted)' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container-custom py-8">
          <div className="alert alert-error max-w-2xl mx-auto">
            <p>{error || 'Profile not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container-custom py-8">
        <div className="max-w-80vh mx-auto space-y-6">
          <div className="card">
            <div className="flex items-start gap-4">
              {profileUser.profileImageUrl ? (
                <img
                  src={profileUser.profileImageUrl}
                  alt={profileUser.displayName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: 'var(--color-primary-100)' }}>
                  <span className="text-4xl font-bold" style={{ color: 'var(--color-primary-700)' }}>
                    {profileUser.displayName?.charAt(0).toUpperCase() || profileUser.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                      {profileUser.displayName || profileUser.username}
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>@{profileUser.username}</p>
                  </div>
                  {!isOwnProfile && (
                    <button onClick={handleFollow} className={`btn ${profileUser.following ? 'btn-outline' : 'btn-primary'}`}>
                      {profileUser.following ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>

                {profileUser.bio && (
                  <p className="mt-3" style={{ color: 'var(--color-text)' }}>{profileUser.bio}</p>
                )}

                <div className="flex gap-4 mt-3">
                  <button onClick={() => setActiveTab('followers')} className="hover:underline"
                          style={{ color: activeTab === 'followers' ? 'var(--color-primary-500)' : 'var(--color-text-muted)' }}>
                    <strong style={{ color: 'var(--color-text)' }}>{profileUser.followersCount}</strong> followers
                  </button>
                  <button onClick={() => setActiveTab('following')} className="hover:underline"
                          style={{ color: activeTab === 'following' ? 'var(--color-primary-500)' : 'var(--color-text-muted)' }}>
                    <strong style={{ color: 'var(--color-text)' }}>{profileUser.followingCount}</strong> following
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div className="card">
            <div className="flex gap-4 border-b" style={{ borderColor: 'var(--color-text-subtle)' }}>
              <button onClick={() => setActiveTab('posts')}
                      className={`px-4 py-2 font-medium transition-colors ${activeTab === 'posts' ? 'border-b-2' : ''}`}
                      style={{ 
                        color: activeTab === 'posts' ? 'var(--color-primary-500)' : 'var(--color-text-muted)',
                        borderColor: activeTab === 'posts' ? 'var(--color-primary-500)' : 'transparent'
                      }}>
                Posts
              </button>
              <button onClick={() => setActiveTab('followers')}
                      className={`px-4 py-2 font-medium transition-colors ${activeTab === 'followers' ? 'border-b-2' : ''}`}
                      style={{ 
                        color: activeTab === 'followers' ? 'var(--color-primary-500)' : 'var(--color-text-muted)',
                        borderColor: activeTab === 'followers' ? 'var(--color-primary-500)' : 'transparent'
                      }}>
                Followers
              </button>
              <button onClick={() => setActiveTab('following')}
                      className={`px-4 py-2 font-medium transition-colors ${activeTab === 'following' ? 'border-b-2' : ''}`}
                      style={{ 
                        color: activeTab === 'following' ? 'var(--color-primary-500)' : 'var(--color-text-muted)',
                        borderColor: activeTab === 'following' ? 'var(--color-primary-500)' : 'transparent'
                      }}>
                Following
              </button>
            </div>
          </div>


          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="card text-center py-12">
                  <p style={{ color: 'var(--color-text-muted)' }}>
                    {isOwnProfile ? "You haven't posted anything yet" : 'No posts yet'}
                  </p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} onDelete={handlePostDeleted}
                            onLike={handlePostLiked} currentUserId={currentUser?.id} />
                ))
              )}
            </div>
          )}

          {activeTab === 'followers' && (
            <div className="space-y-3">
              {followers.length === 0 ? (
                <div className="card text-center py-12">
                  <p style={{ color: 'var(--color-text-muted)' }}>No followers yet</p>
                </div>
              ) : (
                followers.map((user) => <UserCard key={user.id} user={user} />)
              )}
            </div>
          )}

          {activeTab === 'following' && (
            <div className="space-y-3">
              {following.length === 0 ? (
                <div className="card text-center py-12">
                  <p style={{ color: 'var(--color-text-muted)' }}>Not following anyone yet</p>
                </div>
              ) : (
                following.map((user) => <UserCard key={user.id} user={user} />)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;