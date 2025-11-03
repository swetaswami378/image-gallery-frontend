import React, { useState, useEffect, use } from 'react';
import { format } from 'date-fns';
import '../styles/gallery.css';
import API from '../api/api';
import { is } from 'date-fns/locale';
import Loader from '../components/loader';
import { useDebounce } from '../constants/useDebounce';

export default function Gallery({
    updateImages=false,
    updateGallery=null
}) {
  const [images, setImages] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [total_image_count, setTotalImageCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredImages, setFilteredImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(3); // Number of images per page
  const debouncedQuery = useDebounce(searchQuery, 2000); // 2000ms debounce delay

  useEffect(() => {
    if (debouncedQuery.trim() === "") return;

    const fetchImages = async (limit=20, offset=0) => {
        setLoading(true);
        try {
        const response = await API.get('/api/images', {
            params: { limit, offset, search:searchQuery }
        });
        setImages(response.data.images || []);
        setTotalImageCount(response.data.count || 0);
      } catch (error) {
        console.error('Error fetching images:', error);
        setImages([])
        } finally {
          setLoading(false);
        }
    }
    fetchImages();
  }, [debouncedQuery]);

  useEffect(() => {
    const fetchImages = async (limit=20, offset=0) => {
        setLoading(true);
        try {
        const response = await API.get('/api/images', {
            params: { limit, offset, search:searchQuery }
        });
        setImages(response.data.images || []);
        setTotalImageCount(response.data.count || 0);
      } catch (error) {
        console.error('Error fetching images:', error);
        setImages([])
        } finally {
          setLoading(false);
        }
    }
    fetchImages();
  }, []);

  useEffect(() => {
    if (updateImages) {
        const fetchImages = async (limit=20, offset=0) => {
        setLoading(true);
        try {
        const response = await API.get('/api/images', {
            params: { limit, offset, search:searchQuery }
        });
        setImages(response.data.images || []);
        setTotalImageCount(response.data.count || 0);
        updateGallery(false);
      } catch (error) {
        console.error('Error fetching images:', error);
        setImages([])
        } finally {
          setLoading(false);
        }
    }
    fetchImages();
    }
  }, [updateImages]);

  

  useEffect(() => {
    const filtered = images.filter(
      (image) =>
        image.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        format(new Date(image.uploaded_at), 'MMM d, yyyy h:mm a')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
    setFilteredImages(filtered);
  }, [images]);

  // Get current images for pagination
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
    if(total_image_count != images.length && currentPage === totalPages) {
      const fetchMoreImages = async () => {
        try {
          const response = await API.get('/api/images', {
              params: { limit: 20, offset: images.length , search:searchQuery }
          });
          setImages(prevImages => [...prevImages, ...(response.data.images || [])]);
        } catch (error) {
          console.error('Error fetching more images:', error);
        }
      }
      fetchMoreImages();
    }
  };

  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="gallery-container">
    {isLoading && <Loader />}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by image caption or upload date"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="search-button">
          <i className="search-icon">🔍</i>
        </button>
      </div>

      <div className="image-grid">
        {currentImages.map((image) => (
          <div key={image.id} className="image-card">
            <img src={image.image_url} alt={image.caption} className="gallery-image" />
            <div className="image-info">
              <h3>{image.caption}</h3>
              <p>Uploaded: {format(new Date(image.uploaded_at), 'MMM d, yyyy h:mm a')}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length > 0 && (
        <div className="pagination">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`pagination-number ${
                  currentPage === number ? 'active' : ''
                }`}
              >
                {number}
              </button>
            ))}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
