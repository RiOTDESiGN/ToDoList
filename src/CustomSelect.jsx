import React, { useState, useEffect, useRef } from 'react';
import './customselect.css'

const CustomSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleOptionClick = (newValue) => {
    if (options.find(option => option.value === newValue).disabled) return;
    onChange(newValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-select" ref={wrapperRef}>
      <div className={`select-selected ${isOpen ? 'select-arrow-active' : ''}`} onClick={toggleDropdown}>
        {options.find(option => option.value === value).label}
      </div>
      <div className={`select-items ${!isOpen ? 'select-hide' : ''}`}>
        {options.map(option => (
          <div
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            className={`select-item ${value === option.value ? 'same-as-selected' : ''} ${option.disabled ? 'disabled' : ''}`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
