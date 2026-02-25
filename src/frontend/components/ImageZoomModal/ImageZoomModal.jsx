import { createPortal } from 'react-dom';
import styles from './ImageZoomModal.module.css';
import { MdClose, MdZoomIn, MdZoomOut, MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import { useState, useEffect, useRef } from 'react';

const ImageZoomModal = ({ isOpen, onClose, imageSrc, imageAlt }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
    } else {
      document.body.style.overflow = 'unset';
      // Reset states when closing
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
      setIsFullscreen(false);
      setIsLoading(true);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.25, 0.5);
      if (newZoom === 1) {
        setImagePosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleReset = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel(prev => {
      const newZoom = Math.max(0.5, Math.min(4, prev + delta));
      if (newZoom === 1) {
        setImagePosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        handleClose();
        break;
      case '+':
      case '=':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
      case '0':
        handleReset();
        break;
      case 'f':
      case 'F':
        handleFullscreen();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isOpen, isDragging, dragStart, imagePosition]);

  return createPortal(
    <div 
      className={`${styles.modalOverlay} ${isFullscreen ? styles.fullscreen : ''}`} 
      onClick={handleBackdropClick}
    >
      <div className={`${styles.modalContent} ${isFullscreen ? styles.fullscreenContent : ''}`}>
        {/* Loading Spinner */}
        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando imagen...</p>
          </div>
        )}

        {/* Header Controls */}
        <div className={`${styles.modalHeader} ${isLoading ? styles.hidden : ''}`}>
          <div className={styles.leftControls}>
            <div className={styles.zoomControls}>
              <button 
                className={styles.controlButton} 
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                title="Alejar (Tecla: -)"
              >
                <MdZoomOut />
              </button>
              
              <div className={styles.zoomDisplay}>
                <span className={styles.zoomLevel}>{Math.round(zoomLevel * 100)}%</span>
                <div className={styles.zoomBar}>
                  <div 
                    className={styles.zoomProgress}
                    style={{ width: `${((zoomLevel - 0.5) / 3.5) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <button 
                className={styles.controlButton} 
                onClick={handleZoomIn}
                disabled={zoomLevel >= 4}
                title="Acercar (Tecla: +)"
              >
                <MdZoomIn />
              </button>
            </div>

            <button 
              className={styles.controlButton} 
              onClick={handleReset}
              title="Restablecer (Tecla: 0)"
            >
              Restablecer
            </button>
          </div>

          <div className={styles.rightControls}>
            <button 
              className={styles.controlButton} 
              onClick={handleFullscreen}
              title={isFullscreen ? "Salir de pantalla completa (Tecla: F)" : "Pantalla completa (Tecla: F)"}
            >
              {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
            </button>
            
            <button 
              className={styles.closeButton} 
              onClick={handleClose}
              title="Cerrar (Tecla: Esc)"
            >
              <MdClose />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div 
          ref={containerRef}
          className={`${styles.imageContainer} ${isLoading ? styles.hidden : ''}`}
          onWheel={handleWheel}
        >
          <img 
            ref={imageRef}
            src={imageSrc} 
            alt={imageAlt}
            className={`${styles.zoomedImage} ${isDragging ? styles.dragging : ''}`}
            style={{ 
              transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
              cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            onMouseDown={handleMouseDown}
            onLoad={handleImageLoad}
            draggable={false}
          />
        </div>

        {/* Keyboard Shortcuts Info */}
        {!isLoading && (
          <div className={styles.shortcutsInfo}>
            <div className={styles.shortcut}>
              <kbd>+</kbd> <span>Acercar</span>
            </div>
            <div className={styles.shortcut}>
              <kbd>-</kbd> <span>Alejar</span>
            </div>
            <div className={styles.shortcut}>
              <kbd>0</kbd> <span>Restablecer</span>
            </div>
            <div className={styles.shortcut}>
              <kbd>F</kbd> <span>Pantalla completa</span>
            </div>
            <div className={styles.shortcut}>
              <kbd>Esc</kbd> <span>Cerrar</span>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default ImageZoomModal;