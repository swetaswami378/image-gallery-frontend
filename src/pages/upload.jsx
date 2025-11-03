import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { showSuccess, showError } from '../components/toast';
import API from '../api/api';
import Loader from '../components/loader';
import '../styles/upload.css';

export default function Upload({updateGallery}) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const selected = acceptedFiles[0];

    if (!selected.type.startsWith('image/')) {
      showError('Please upload an image file');
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      showError('Image is too large. Maximum allowed size is 10 MB.');
      return;
    }

    // Revoke previous preview (if any) before creating a new one
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }, [preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showError('Please select an image to upload');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError('Image is too large. Maximum allowed size is 10 MB.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('caption', caption || '');

      const result = await uploadImage(formData);
      if(updateGallery) {
        updateGallery(true);
      }
      showSuccess(result?.message || 'Image uploaded successfully!');
      // Clean up preview URL
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
      setFile(null);
      setCaption('');
    } catch (error) {
      // If uploadImage threw an Error with message, show it. Otherwise show generic.
      const message = error?.message || 'Failed to upload image. Please try again.';
      showError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadImage = async (formData) => {
    try {
      const res = await API.post('/api/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (err) {
      // try to extract a useful message from the server response
      const serverMessage = err?.response?.data?.message || err?.response?.data?.detail;
      const message = serverMessage || err?.message || 'Upload failed';
      console.error('Upload error:', err);
      throw new Error(message);
    }
  };

  // Revoke object URL when preview changes or component unmounts
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="upload-container">
      {isUploading && <Loader />}
      <div className="upload-card">
        <h2>Upload Image</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'active' : ''} ${preview ? 'has-preview' : ''}`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="preview-container">
                <img src={preview} alt="Preview" className="image-preview" />
                <button
                  type="button"
                  className="remove-preview"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (preview) URL.revokeObjectURL(preview);
                    setPreview(null);
                    setFile(null);
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="upload-message">
                <i className="upload-icon">📁</i>
                <p>
                  {isDragActive
                    ? 'Drop the image here'
                    : 'Drag & drop an image here, or click to select'}
                </p>
                <p>File size limit: 10 MB</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="upload-button"
            disabled={isUploading || !file || file?.size > MAX_FILE_SIZE}
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>
    </div>
  );
}
