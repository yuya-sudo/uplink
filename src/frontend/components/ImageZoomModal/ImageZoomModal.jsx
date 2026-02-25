import { createPortal } from 'react-dom';
import styles from './ImageZoomModal.module.css';
import { MdClose, MdZoomIn, MdZoomOut } from 'react-icons/md';
import { useState } from 'react';

const ImageZoomModal = ({ isOpen, onClose, imageSrc, imageAlt }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    setZoomLevel(1);
    onClose();
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.zoomControls}>
            <button 
              className={styles.zoomButton} 
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
            >
              <MdZoomOut />
            </button>
            <span className={styles.zoomLevel}>{Math.round(zoomLevel * 100)}%</span>
            <button 
              className={styles.zoomButton} 
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
            >
              <MdZoomIn />
            </button>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            <MdClose />
          </button>
        </div>
        
        <div className={styles.imageContainer}>
          <img 
            src={imageSrc} 
            alt={imageAlt}
            className={styles.zoomedImage}
            style={{ transform: `scale(${zoomLevel})` }}
          />
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default ImageZoomModal;