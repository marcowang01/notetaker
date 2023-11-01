// Assuming 'use strict' was intended
'use strict'

import styles from './infoOverlay.module.css'
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faCopy, faPlay, faPause, faEarListen, faWandMagic, faWandMagicSparkles, faVialCircleCheck, faCircleInfo, faEnvelope, faHandPointRight, faArrowRotateForward, faGear, faRobot } from '@fortawesome/free-solid-svg-icons';

interface TutorialOverlayProps {
  show: boolean;
  onClose?: () => void; // Optional onClose prop to allow parent to handle closing
}

const InfoOverlay: React.FC<TutorialOverlayProps> = ({ show, onClose }) => {
  if (!show) return null;

  const bottomItems: Record<string, IconDefinition> = {
    "Start/Pause speech recognition": faPlay,
    "Generate response for custom instruction": faWandMagic,
    "Generate complete lecture notes": faWandMagicSparkles,
    "Continue generating final notes": faHandPointRight,
    "Generate debug transcipt": faVialCircleCheck,
    "Shows most recent live transcript": faEarListen,
  }

  const topItems: Record<string, IconDefinition> = {
    "Shows current status": faGear,
    "Toggle model for custom instruction/notes": faRobot,
    "Open this menu": faCircleInfo,
    "Link to sign Out page": faEnvelope,
  }

  const otherItems: Record<string, IconDefinition> = {
    "Copy text in text box": faCopy,
    "Use default custom instruction": faArrowRotateForward,
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
        <div className={styles.infoTitle}>
          Bottom Action Bar
        </div>
        {Object.keys(bottomItems).map((key) => <InfoItem key={key} icon={bottomItems[key]} text={key} />)}
        <div className={styles.infoTitle}>
          Top Nav Bar
        </div>
        {Object.keys(topItems).map((key) => <InfoItem key={key} icon={topItems[key]} text={key} />)}
        <div className={styles.infoTitle}>
          Other
        </div>
        {Object.keys(otherItems).map((key) => <InfoItem key={key} icon={otherItems[key]} text={key} />)}
      </div>
    </div>
  );
}

export default InfoOverlay;
