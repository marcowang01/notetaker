// Assuming 'use strict' was intended
'use strict'

import styles from './infoOverlay.module.css'
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faCopy, faPlay, faPause, faEarListen, faWandMagic, faWandMagicSparkles, faVialCircleCheck, faCircleInfo, faEnvelope, faHandPointRight, faArrowRotateForward } from '@fortawesome/free-solid-svg-icons';

interface TutorialOverlayProps {
  show: boolean;
  onClose?: () => void; // Optional onClose prop to allow parent to handle closing
}

const InfoOverlay: React.FC<TutorialOverlayProps> = ({ show, onClose }) => {
  if (!show) return null;

  const infoItems: Record<string, IconDefinition> = {
    "Open This Menu": faCircleInfo,
    "Link to sign out page": faEnvelope,
    "Copy Text in text box": faCopy,
    "Start/Pause Speech Recognition": faPlay,
    "Shows most recent live transcript": faEarListen,
    "Generate custom answer using GPT-3.5": faWandMagic,
    "Generate final notes using GPT-4": faWandMagicSparkles,
    "Continue generating final notes": faHandPointRight,
    "Use default question": faArrowRotateForward,
    "Generate Debug Transcipt": faVialCircleCheck,
  }

  const handleClose = () => {
    if (onClose) onClose(); // If an onClose prop is provided, call it
    // Add any other logic here if needed to handle closing within the component
  }

  const InfoItem: React.FC<{ icon: IconDefinition, text: string }> = ({ icon, text }) => {
    return (
      <div className={styles.infoitem}>
        <FontAwesomeIcon icon={icon}/>: {text}
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.tutorialContent}> 
        <div style={{opacity: "0.7", fontStyle: "italic"}}>
          Click anywhere to close
        </div>
        {Object.keys(infoItems).map((key) => <InfoItem key={key} icon={infoItems[key]} text={key} />)}
      </div>
    </div>
  );
}

export default InfoOverlay;
