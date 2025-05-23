import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostDetail = ({ user, isAuthenticated }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch post. Please try again later.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    setDeleteLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post. Please try again.');
      setDeleteLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  if (!post) {
    return <div className="alert alert-warning mt-4">Post not found</div>;
  }

  const isAuthor = isAuthenticated && user && post.user_id === user.id;

  return (
    <div className="post-detail mt-4">
      <div className="row">
        <div className="col-md-10 mx-auto">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">{post.title}</h1>
              <div className="d-flex justify-content-between mb-3">
                <h6 className="card-subtitle text-muted">
                  By {post.username} on {formatDate(post.created_at)}
                </h6>
                {isAuthor && (
                  <div className="btn-group">
                    <Link to={`/edit-post/${post.id}`} className="btn btn-sm btn-outline-primary">
                      Edit
                    </Link>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleDelete}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
              <hr />
              <div 
                className="card-text post-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              <div className="mt-4">
                <Link to="/" className="btn btn-secondary">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
