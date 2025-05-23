import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestApi = () => {
  const [apiStatus, setApiStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const testApi = async () => {
      try {
        // Test the simple test endpoint
        const testResponse = await axios.get('http://localhost:5000/api/test');
        setApiStatus(`Test API: ${testResponse.data.message}`);
        
        // Try to fetch posts
        try {
          const postsResponse = await axios.get('http://localhost:5000/api/posts');
          setApiStatus(prev => `${prev}\nPosts API: Success! Found ${postsResponse.data.length} posts.`);
        } catch (postsErr) {
          setApiStatus(prev => `${prev}\nPosts API: Error - ${postsErr.message}`);
        }
        
      } catch (err) {
        setError(`API Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4>API Connection Test</h4>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Testing API connection...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger">
                  {error}
                  <div className="mt-3">
                    <h5>Troubleshooting Steps:</h5>
                    <ol>
                      <li>Make sure the server is running on port 5000</li>
                      <li>Check if there are any CORS issues in the browser console</li>
                      <li>Verify database connection in the server logs</li>
                      <li>Check network tab in developer tools for more details</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="alert alert-success">
                  <pre>{apiStatus}</pre>
                </div>
              )}
              
              <div className="mt-4">
                <h5>API Endpoints:</h5>
                <ul className="list-group">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    GET /api/test
                    <span className="badge bg-primary rounded-pill">Test Endpoint</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    GET /api/posts
                    <span className="badge bg-primary rounded-pill">Get All Posts</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    POST /api/users/register
                    <span className="badge bg-primary rounded-pill">Register User</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    POST /api/users/login
                    <span className="badge bg-primary rounded-pill">Login User</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestApi;
