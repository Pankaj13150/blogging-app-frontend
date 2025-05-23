import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const EditPost = ({ user }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Check if the post belongs to the current user
        if (response.data.user_id !== user.id) {
          setError('You are not authorized to edit this post');
          return;
        }
        
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch post. Please try again.');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(
        `http://localhost:5000/api/posts/${id}`, 
        { title, content },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-post mt-4">
      <div className="row">
        <div className="col-md-10 mx-auto">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Edit Blog Post</h4>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">Content</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={content}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setContent(data);
                    }}
                    config={{
                      toolbar: [
                        'heading', '|', 
                        'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                        'outdent', 'indent', '|',
                        'blockQuote', 'insertTable', 'undo', 'redo'
                      ]
                    }}
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : 'Update Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
