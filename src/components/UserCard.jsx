// src/components/UserCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../services/api';

const UserCard = ({ user, onFollowChange, showFollowButton = true }) => {
  const [following, setFollowing] = useState(user.following);
  const [loading, setLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(user.followersCount);

  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      const response = await usersAPI.followUser(user.id);
      setFollowing(response.following);
      setFollowersCount(response.followersCount);
      
      if (onFollowChange) {
        onFollowChange(user.id, response.following);
      }
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-hover">
      <Link to={`/profile/${user.id}`} className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">

          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-100)' }}
            >
              <span
                className="text-xl font-semibold"
                style={{ color: 'var(--color-primary-700)' }}
              >
                {user.displayName?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

        
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate" style={{ color: 'var(--color-text)' }}>
              {user.displayName || user.username}
            </h3>
            <p className="text-sm truncate" style={{ color: 'var(--color-text-muted)' }}>
              @{user.username}
            </p>
            {user.bio && (
              <p className="text-sm mt-1 truncate" style={{ color: 'var(--color-text-muted)' }}>
                {user.bio}
              </p>
            )}
            <div className="flex gap-3 mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <span>
                <strong style={{ color: 'var(--color-text)' }}>{followersCount}</strong> followers
              </span>
            </div>
          </div>
        </div>

        {showFollowButton && (
          <button
            onClick={handleFollow}
            disabled={loading}
            className={`btn ${following ? 'btn-outline' : 'btn-primary'} ml-3`}
            style={
              following
                ? {
                    borderColor: 'var(--color-primary-500)',
                    color: 'var(--color-primary-500)',
                  }
                : {}
            }
          >
            {loading ? '...' : following ? 'Following' : 'Follow'}
          </button>
        )}
      </Link>
    </div>
  );
};

export default UserCard;