import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search term
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Extract summary from content (first 150 characters)
  const getSummary = (content) => {
    // Remove HTML tags for plain text summary
    const plainText = content.replace(/<[^>]+>/g, '');
    return plainText.length > 150 
      ? plainText.substring(0, 150) + '...' 
      : plainText;
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

  return (
    <div className="home-page mt-4">
      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <h1 className="text-center mb-4">Latest Blog Posts</h1>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="btn btn-outline-secondary" 
              type="button"
              onClick={() => setSearchTerm('')}
              disabled={!searchTerm}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      
      {!error && filteredPosts.length === 0 && (
        <div className="text-center">
          <p>No posts found. {searchTerm && 'Try a different search term.'}</p>
        </div>
      )}

      <div className="row">
        {filteredPosts.map(post => (
          <div className="col-md-6 col-lg-4 mb-4" key={post.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  By {post.username} on {formatDate(post.created_at)}
                </h6>
                <p className="card-text">{getSummary(post.content)}</p>
              </div>
              <div className="card-footer bg-transparent border-top-0">
                <Link to={`/post/${post.id}`} className="btn btn-primary">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
