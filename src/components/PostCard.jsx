import { useState } from 'react';
import { postsAPI } from '../services/api';

const PostCard = ({ post, onDelete, onLike, currentUserId }) => {
  const [deleting, setDeleting] = useState(false);
  const [liking, setLiking] = useState(false);

  const isOwner = currentUserId === post.userId;
  const isLiked = post.likes?.includes(currentUserId);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setDeleting(true);
      await postsAPI.deletePost(post.id);
      onDelete(post.id);
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const handleLike = async () => {
    try {
      setLiking(true);
      const updatedPost = await postsAPI.likePost(post.id);
      onLike(post.id, updatedPost);
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setLiking(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="card card-hover">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
               style={{ backgroundColor: 'var(--color-primary-100)' }}>
            <span className="text-lg font-semibold"
                  style={{ color: 'var(--color-primary-700)' }}>
              {post.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
              {post.username || 'Anonymous'}
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm px-3 py-1 rounded-lg transition-colors"
            style={{ 
              color: 'var(--color-error)',
              backgroundColor: 'rgba(211, 47, 47, 0.1)'
            }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        {post.title && (
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            {post.title}
          </h2>
        )}
        <p style={{ color: 'var(--color-text)' }}>
          {post.content}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t"
           style={{ borderColor: 'var(--color-text-subtle)' }}>
        <button
          onClick={handleLike}
          disabled={liking}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
          style={{
            color: isLiked ? 'var(--color-error)' : 'var(--color-text-muted)',
            backgroundColor: isLiked ? 'rgba(211, 47, 47, 0.1)' : 'transparent'
          }}
        >
          <svg 
            className="w-5 h-5" 
            fill={isLiked ? 'currentColor' : 'none'}
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
          <span className="font-medium">
            {post.likesCount || post.likes?.length || 0}
          </span>
        </button>

        <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-medium">
            {post.commentsCount || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;