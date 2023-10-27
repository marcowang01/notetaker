'use client'

import styles from './infoOverlay.module.css'
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faPlay, faPause, faEarListen, faWandMagic, faWandMagicSparkles, faVialCircleCheck, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

interface TutorialOverlayProps {
  show: boolean;
  onClose?: () => void; // Optional onClose prop to allow parent to handle closing
}

const InfoOverlay: React.FC<TutorialOverlayProps> = ({ show, onClose }) => {
  if (!show) return null;

  const handleClose = () => {
    if (onClose) onClose(); // If an onClose prop is provided, call it
    // Add any other logic here if needed to handle closing within the component
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.tutorialContent} onClick={e => e.stopPropagation()}> 
        <div>
          <FontAwesomeIcon icon={faCircleInfo}/> Open This Menu
        </div>
        <div>
          <FontAwesomeIcon icon={faCopy}/> Copy Text
        </div>
        <div>
          <FontAwesomeIcon icon={faPlay}/>/<FontAwesomeIcon icon={faPause}/> Start/Pause Speech Recognition
        </div>
        <div>
          <FontAwesomeIcon icon={faEarListen}/> Shows most recent live transcript
        </div>
        <div>
          <FontAwesomeIcon icon={faWandMagic}/> Generate Takeaways using GPT-3.5
        </div>
        <div>
          <FontAwesomeIcon icon={faWandMagicSparkles}/> Generate Final Notes using GPT-4
        </div>
        <div>
          <FontAwesomeIcon icon={faVialCircleCheck}/> Generate Test Content
        </div>
      </div>
    </div>
  );
}

export default InfoOverlay;
