import * as React from "react";
import styles from "./modal.module.scss";

export interface ModalProps {
  isVisible: boolean;
  title: string;
  content: JSX.Element[] | JSX.Element;
  footer?: string;
  onClose: () => void;
  size?: string;
  theme?: string;
}
const Modal = ({
  isVisible = false,
  title,
  content,
  footer,
  onClose,
  size = "md",
  theme = "white",
}: ModalProps) => {
  const keydownHandler = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        onClose();
        break;
      default:
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", keydownHandler);
    return () => document.removeEventListener("keydown", keydownHandler);
  });

  return !isVisible ? null : (
    <div className={styles.modal} onClick={onClose}>
      <div className={`${styles.closeCon} ${styles[size]}`}>
        <span
          className={`${styles.modalClose} ${styles[theme]}`}
          onClick={onClose}
        >
          &times;
        </span>
      </div>

      <div
        className={`${styles.modalDialog} ${styles[size]} ${styles[theme]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalContent}>{content}</div>
        </div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
