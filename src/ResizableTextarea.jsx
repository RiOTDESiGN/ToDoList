import React, { useEffect, useRef } from 'react';

const ResizableTextarea = ({ value, onChange, resetKey, editing, ...props }) => {
  const textareaRef = useRef(null);

  const resizeTextArea = () => {
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  useEffect(() => {
    const textArea = textareaRef.current;
    if (textArea) {
      resizeTextArea();
      textArea.addEventListener('input', resizeTextArea);

      return () => textArea.removeEventListener('input', resizeTextArea);
    }
  }, [value]);

  useEffect(() => {
    if (editing) {
      resizeTextArea();
    }
  }, [editing]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default ResizableTextarea;