'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Reusable NEXUS COMMAND Dark Custom Select/Dropdown Component
 * 
 * Props:
 * - value: Current selected value
 * - onChange: Function(eventOrValue) called when an option is chosen
 * - options: Array of objects { value, label, badge, color } OR array of strings
 * - placeholder: Placeholder text if no value selected
 * - disabled: Disable interaction
 * - className: Custom wrapper class
 * - style: Inline style for trigger
 * - name: Field name
 */
export default function NexusSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  disabled = false,
  className = '',
  style = {},
  name = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);

  // Normalize options array into [{ value, label }]
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value !== undefined ? opt.value : opt.label,
        label: opt.label !== undefined ? opt.label : opt.value,
        badge: opt.badge,
        color: opt.color
      };
    }
    return { value: opt, label: String(opt) };
  });

  // Find currently selected option object
  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle select option
  const handleSelectOption = (optValue) => {
    if (disabled) return;
    setIsOpen(false);

    if (typeof onChange === 'function') {
      // Pass synthetic event for backwards compatibility with standard e.target.value
      const syntheticEvent = {
        target: { name, value: optValue },
        preventDefault: () => {},
        stopPropagation: () => {}
      };
      onChange(syntheticEvent, optValue);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(0);
      } else {
        setFocusedIndex((prev) => (prev < normalizedOptions.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setFocusedIndex(normalizedOptions.length - 1);
      } else {
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : normalizedOptions.length - 1));
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (focusedIndex >= 0 && focusedIndex < normalizedOptions.length) {
        handleSelectOption(normalizedOptions[focusedIndex].value);
      }
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`nexus-select-container ${className}`}
      style={{ position: 'relative', width: '100%' }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`nexus-select-trigger ${isOpen ? 'active' : ''}`}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 0.95rem',
          background: '#0f172a',
          border: isOpen ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '10px',
          color: selectedOption ? '#ffffff' : '#94a3b8',
          fontSize: '0.88rem',
          fontWeight: 600,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          boxShadow: isOpen ? '0 0 0 3px rgba(56, 189, 248, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease',
          outline: 'none',
          ...style
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={16} 
          color="#38bdf8" 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
            transition: 'transform 0.2s ease',
            flexShrink: 0
          }} 
        />
      </button>

      {/* Dropdown Options Popover */}
      {isOpen && (
        <div 
          className="nexus-select-options"
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#0f172a',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '12px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.9)',
            maxHeight: '250px',
            overflowY: 'auto',
            zIndex: 9999,
            padding: '0.35rem'
          }}
        >
          {normalizedOptions.length === 0 ? (
            <div style={{ padding: '0.75rem', fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center' }}>
              No options available
            </div>
          ) : (
            normalizedOptions.map((opt, idx) => {
              const isSelected = String(opt.value) === String(value);
              const isFocused = idx === focusedIndex;

              return (
                <div
                  key={`${opt.value}-${idx}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectOption(opt.value)}
                  onMouseEnter={() => setFocusedIndex(idx)}
                  className={`nexus-select-option ${isSelected ? 'selected' : ''} ${isFocused ? 'focused' : ''}`}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    color: isSelected ? '#10b981' : (isFocused ? '#38bdf8' : '#f8fafc'),
                    background: isSelected 
                      ? 'rgba(16, 185, 129, 0.18)' 
                      : (isFocused ? 'rgba(56, 189, 248, 0.15)' : 'transparent'),
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                    marginBottom: '2px'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {opt.color && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.color, display: 'inline-block' }} />
                    )}
                    {opt.label}
                  </span>

                  {isSelected && (
                    <Check size={15} color="#10b981" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
