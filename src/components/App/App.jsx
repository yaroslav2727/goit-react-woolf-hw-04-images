import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

import SearchBar from "components/SearchBar/SearchBar.jsx";
import ImageGallery from "components/ImageGallery/ImageGallery.jsx";
import ErrorMessage from "components/ErrorMessage/ErrorMessage.jsx";
import LoadButton from "components/LoadButton/LoadButton.jsx";
import Loader from "components/Loader/Loader.jsx";
import ImageModal from "components/ImageModal/ImageModal.jsx";
import { fetchImages, IMAGES_PER_PAGE } from "api/pixabayAPI";

const App = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dataForModal, setDataForModal] = useState(null);
  const [showLoadButton, setShowLoadButton] = useState(false);

  useEffect(() => {
    const onUpdate = async () => {
      if (!query) return;
      try {
        setLoading(true);
        setError(false);
        const data = await fetchImages({ query, page });
        if (data?.hits?.length === 0) {
          toast.error("No images found...");
          return;
        }
        const normalizedArray = array =>
          array.map(({ id, webformatURL, largeImageURL, tags }) => ({
            id,
            webformatURL,
            largeImageURL,
            tags,
          }));
        setImages(prevImages => [...prevImages, ...normalizedArray(data.hits)]);
        setShowLoadButton(page < Math.ceil(data.totalHits / IMAGES_PER_PAGE));
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    onUpdate();
  }, [query, page]);

  const handleSubmit = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
    setShowLoadButton(false);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const openModal = dataForModal => {
    setDataForModal(dataForModal);
    setModalIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setDataForModal(null);
    setModalIsOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <SearchBar onSubmit={handleSubmit} />
      {images.length > 0 && !error && <ImageGallery images={images} onImageClick={openModal} />}
      {error && <ErrorMessage message="An error has occurred, please try reloading the page..." />}
      {showLoadButton && <LoadButton onClick={handleLoadMore} />}
      {modalIsOpen && (
        <ImageModal isOpen={modalIsOpen} onRequestClose={closeModal} dataForModal={dataForModal} />
      )}
      {loading && <Loader />}
    </>
  );
};

export default App;
