import React, { useState, useRef } from 'react';
import './customselect.css';

const CustomSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleOptionClick = (newValue) => {
    if (options.find(option => option.value === newValue).disabled) return;
    onChange(newValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <div 
      className="custom-select" 
      ref={wrapperRef} 
      onMouseLeave={() => setIsOpen(false)}
    >
      <div 
        className={`select-selected ${isOpen ? 'select-arrow-active' : ''}`} 
        onMouseEnter={() => setIsOpen(true)}
      >
        {selectedOption ? selectedOption.label : 'Select an option..'}
      </div>
      <div className={`select-items ${!isOpen ? 'select-hide' : ''}`}>
        {options.map(option => (
          <div
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            className={`select-item ${value === option.value ? 'same-as-selected' : ''} ${option.disabled ? 'select-hide' : ''}`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;