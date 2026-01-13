import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwnProfile = !userId || userId === currentUser?.id?.toString();
  const displayUserId = userId || currentUser?.id;

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!displayUserId) return;

      try {
        setLoading(true);
        const data = await postsAPI.getUserPosts(displayUserId);
        setPosts(data);
        setError('');
      } catch (err) {
        setError('Failed to load posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [displayUserId]);

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handlePostLiked = (postId, updatedPost) => {
    setPosts(posts.map(post => 
      post.id === postId ? updatedPost : post
    ));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container-custom py-8">
        <div className="max-w-80vh mx-auto space-y-6">
          {/* Profile Header */}
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                   style={{ backgroundColor: 'var(--color-primary-100)' }}>
                <span className="text-3xl font-bold"
                      style={{ color: 'var(--color-primary-700)' }}>
                  {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {isOwnProfile ? currentUser?.username : `User ${userId}`}
                </h1>
                <p style={{ color: 'var(--color-text-muted)' }}>
                  {isOwnProfile ? currentUser?.email : ''}
                </p>
                <div className="flex gap-4 mt-2">
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    <strong style={{ color: 'var(--color-text)' }}>
                      {posts.length}
                    </strong> posts
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
              {isOwnProfile ? 'Your Posts' : 'Posts'}
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2"
                     style={{ borderColor: 'var(--color-primary-500)' }}></div>
                <p className="mt-4" style={{ color: 'var(--color-text-muted)' }}>
                  Loading posts...
                </p>
              </div>
            ) : error ? (
              <div className="alert alert-error">
                <p>{error}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="card text-center py-12">
                <p style={{ color: 'var(--color-text-muted)' }}>
                  {isOwnProfile 
                    ? "You haven't posted anything yet" 
                    : 'No posts found'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={handlePostDeleted}
                    onLike={handlePostLiked}
                    currentUserId={currentUser?.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;