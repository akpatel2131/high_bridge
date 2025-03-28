import React, { useEffect } from 'react';
import styles from './Modal.module.css';
import { FaTimes } from 'react-icons/fa';
import clsx from 'clsx';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium', // small, medium, large
  showCloseButton = true,
  closeOnOutsideClick = true,
  footer,
  innerClassName
}) => {
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOutsideClick = (event) => {
    if (closeOnOutsideClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={handleOutsideClick}
    >
      <div className={`${styles.modalContent} ${styles[size]}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          {showCloseButton && (
            <button 
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close modal"
            >
              <FaTimes size={20} strokeWidth={1}/>
            </button>
          )}
        </div>
        
        <div className={clsx(styles.modalBody, innerClassName?.modalBody)}>
          {children}
        </div>

        {footer && (
          <div className={styles.modalFooter}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal; 