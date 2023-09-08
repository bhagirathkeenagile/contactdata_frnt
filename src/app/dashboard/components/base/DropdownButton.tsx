import React, { useState } from 'react';
import styles from './DropdownButton.module.css';

interface DropdownProps {
  items: string[];
}

const DropdownButton: React.FC<DropdownProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.dropdown}>
      <button className={styles.dropdownButton} onClick={toggleDropdown}>
        Dropdown
      </button>
      {isOpen && (
        <div className={styles.dropdownContent}>
          {items.map((item, index) => (
            <a href="#" key={index} className={styles.dropdownItem}>
              {item}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
