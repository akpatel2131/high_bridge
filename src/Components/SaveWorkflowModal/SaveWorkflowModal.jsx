import React, { useState } from 'react';
import Modal from '../Common/Modal/Modal';
import styles from './SaveWorkflowModal.module.css';

const SaveWorkflowModal = ({ isOpen, onClose, onSave, initialName = '', initialDescription = '' }) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'नाम आवश्यक है';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({ name, description });
      onClose();
    }
  };

  const footer = (
    <button 
      className={styles.saveButton}
      onClick={handleSave}
    >
      Save
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Save your workflow"
      size="large"
      footer={footer}
    >
      <div className={styles.formGroup}>
        <label htmlFor="workflow-name">Name</label>
        <input
          id="workflow-name"
          type="text"
          className={styles.input}
          placeholder="Name here"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="workflow-description">Description</label>
        <textarea
          id="workflow-description"
          className={styles.textarea}
          placeholder="Write here.."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
        />
      </div>
    </Modal>
  );
};

export default SaveWorkflowModal;