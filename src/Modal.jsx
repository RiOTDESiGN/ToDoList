import React, { useRef, useEffect } from 'react';

const Modal = ({ isOpen, onClose, onConfirm, children }) => {
  const yesButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      yesButtonRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modalBackdrop">
      <div className="modalContent">
        {children}
        <div className="actionButtons">
          <button ref={yesButtonRef} onClick={onConfirm}>Yes</button>
          <button className='cancel-button' onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;