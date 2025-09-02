import React from 'react';
import styles from './Sample.module.css';

export default function Sample() {
  return (
    <div>
      <h1 className={styles.sampleText}>CSS Modules Test</h1>
      <button className={styles.sampleButton}>Click me!</button>
    </div>
  );
}
