import { useState } from 'react';
import { postsAPI } from '../services/api';

const CreatePost = ({ onPostCreated }) => {
  const [formData, setFormData] = useState({
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      setError('Post content is required');
      return;
    }

    try {
      setLoading(true);
      const newPost = await postsAPI.createPost(formData);
      onPostCreated(newPost);
      setFormData({ title: '', content: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
        What's happening in your kampung?
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="alert alert-error">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Share your thoughts..."
            rows={4}
            required
            className="input resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !formData.content.trim()}
            className="btn btn-primary"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;