// src/pages/Search.jsx
import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import UserCard from '../components/UserCard';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setUsers([]);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await usersAPI.searchUsers(searchQuery);
        setUsers(data);
      } catch (err) {
        setError('Failed to search users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleFollowChange = (userId, isFollowing) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, following: isFollowing } : user
      )
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container-custom py-8">
        <div className="max-w-80vh mx-auto space-y-6">
          
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              Search KampunG
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Find people in your village
            </p>
          </div>

   
          <div className="card">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: 'var(--color-text-muted)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username or display name..."
                className="input pl-10"
              />
            </div>
          </div>

  
          {loading ? (
            <div className="text-center py-12">
              <div
                className="inline-block animate-spin rounded-full h-12 w-12 border-b-2"
                style={{ borderColor: 'var(--color-primary-500)' }}
              ></div>
              <p className="mt-4" style={{ color: 'var(--color-text-muted)' }}>
                Searching...
              </p>
            </div>
          ) : error ? (
            <div className="alert alert-error">
              <p>{error}</p>
            </div>
          ) : searchQuery && users.length === 0 ? (
            <div className="card text-center py-12">
              <p style={{ color: 'var(--color-text-muted)' }}>
                No users found for "{searchQuery}"
              </p>
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-3">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onFollowChange={handleFollowChange}
                />
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: 'var(--color-text-muted)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Start typing to search for users
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;