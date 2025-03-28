import React from 'react';
import { SyncLoader } from 'react-spinners';
import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <SyncLoader color={"#4caf50"} size={20} />
    </div>
  );
};

export default Loader; 