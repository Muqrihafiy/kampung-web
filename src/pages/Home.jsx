import { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getAllPosts();
      setPosts(data);
      setError('');
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

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
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient-primary mb-2">
              KampunG Feed
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Share your village stories
            </p>
          </div>

          {/* Create Post */}
          <CreatePost onPostCreated={handlePostCreated} />

          {/* Posts Feed */}
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
                No posts yet. Be the first to share something!
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
                  currentUserId={user?.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;