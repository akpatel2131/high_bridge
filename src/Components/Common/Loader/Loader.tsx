import React from "react";
import styles from "./Loader.module.css";
import SyncLoader from "react-spinners/SyncLoader";

export default function Loader({size}) {
  return (
    <div className={styles.loader}>
      <SyncLoader color="#4caf50" size={size} />
    </div>
  );
}
