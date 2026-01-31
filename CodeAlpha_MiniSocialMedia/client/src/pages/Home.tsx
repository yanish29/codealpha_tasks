import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Post {
  _id: string;
  user: { _id: string; username: string };
  content: string;
  likes: string[];
  createdAt: string;
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user, token } = useContext(AuthContext);
  const [newPost, setNewPost] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert('Please login to post');
    try {
      await axios.post('http://localhost:5000/api/posts', 
        { content: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewPost('');
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId: string) => {
    if (!token) return alert('Please login to like');
    try {
      await axios.put(`http://localhost:5000/api/posts/${postId}/like`, {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      {user && (
        <form onSubmit={handleCreatePost} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd' }}>
          <textarea 
            value={newPost} 
            onChange={(e) => setNewPost(e.target.value)} 
            placeholder="What's on your mind?" 
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} 
            required
          />
          <button type="submit" style={{ padding: '0.5rem 1rem', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>Post</button>
        </form>
      )}

      <div>
        {posts.map(post => (
          <div key={post._id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              <Link to={`/profile/${post.user?._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                {post.user?.username || 'Unknown User'}
              </Link>
              <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem' }}>
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p>{post.content}</p>
            <div style={{ marginTop: '0.5rem' }}>
              <button 
                onClick={() => handleLike(post._id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: post.likes.includes(user?.id || '') ? 'blue' : 'gray' }}
              >
                {post.likes.includes(user?.id || '') ? 'Unlike' : 'Like'} ({post.likes.length})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
