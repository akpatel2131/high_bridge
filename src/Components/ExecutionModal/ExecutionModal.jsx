import React from 'react';
import styles from './ExecutionModal.module.css';
import Modal from '../Common/Modal/Modal';
import { FaTimes } from 'react-icons/fa';

const ExecutionModal = ({ 
  isOpen, 
  onClose, 
  processName,
  onConfirm 
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="large"
      showCloseButton={true}
      closeOnOutsideClick={false}
      innerClassName={{
        modalBody: styles.modalBody
      }}
    >
      <div className={styles.executionContent}>
        <div className={styles.executionHeader}>
        <h2 className={styles.title}>
          Are You Sure You Want To Execute The Process ?
        </h2>
        <p className={styles.warning}>
          You Cannot Undo This Step
        </p>
        </div>
        <div className={styles.actions}>
          <button 
            className={styles.confirmButton}
            onClick={onConfirm}
          >
            Yes
          </button>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExecutionModal; 