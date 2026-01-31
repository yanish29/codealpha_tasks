import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  followers: string[];
  following: string[];
}

interface Post {
  _id: string;
  content: string;
  likes: string[];
  createdAt: string;
}

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser, token } = useContext(AuthContext);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
  
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`);
        setProfile(res.data.user);
        setPosts(res.data.posts);
      } catch (err) {
        console.error(err);
      }
    };
  
    useEffect(() => {
      fetchProfile();
    }, [id]);
  
    const handleFollow = async () => {
      if (!token) return alert('Please login to follow');
      try {
        await axios.put(`http://localhost:5000/api/users/${id}/follow`, {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchProfile();
      } catch (err) {
        console.error(err);
      }
    };
  
    if (!profile) return <div>Loading...</div>;
  
    const isFollowing = profile.followers.includes(currentUser?.id || '');
    const isMe = currentUser?.id === profile._id;
  
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <h2>{profile.username}</h2>
          <p>Followers: {profile.followers.length} | Following: {profile.following.length}</p>
          {!isMe && currentUser && (
            <button onClick={handleFollow} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
        
        <h3>Posts</h3>
        {posts.map(post => (
          <div key={post._id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '0.5rem' }}>
            <p>{post.content}</p>
            <small>{new Date(post.createdAt).toLocaleDateString()}</small>
            <div>Likes: {post.likes.length}</div>
          </div>
        ))}
      </div>
    );
  };
  
  export default Profile;
