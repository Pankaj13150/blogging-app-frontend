import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/users/${user.id}/posts`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch your posts. Please try again later.');
        setLoading(false);
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    setDeleteLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update posts list after deletion
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Blog Posts</h1>
        <Link to="/create-post" className="btn btn-primary">
          Create New Post
        </Link>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {!error && posts.length === 0 && (
        <div className="alert alert-info">
          You haven't created any posts yet. <Link to="/create-post">Create your first post</Link>
        </div>
      )}
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td>
                  <Link to={`/post/${post.id}`} className="text-decoration-none">
                    {post.title}
                  </Link>
                </td>
                <td>{formatDate(post.created_at)}</td>
                <td>{formatDate(post.updated_at)}</td>
                <td>
                  <div className="btn-group">
                    <Link 
                      to={`/edit-post/${post.id}`} 
                      className="btn btn-sm btn-outline-primary"
                    >
                      Edit
                    </Link>
                    <Link 
                      to={`/post/${post.id}`} 
                      className="btn btn-sm btn-outline-secondary"
                    >
                      View
                    </Link>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(post.id)}
                      disabled={deleteLoading}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
