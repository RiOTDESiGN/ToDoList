import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modalBackdrop">
      <div className="modalContent">
        {children}
        <div className="actionButtons">
          <button onClick={onConfirm}>Yes</button>
          <button className='cancel-button' onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
