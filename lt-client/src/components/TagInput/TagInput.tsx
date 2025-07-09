import { useState, ChangeEvent, KeyboardEvent, useRef, useEffect } from 'react';
import { Tag } from '../../types';

import './_index.scss';

interface TagInputProps {
  suggestions: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
}

const TagInput = ({ suggestions, onTagsChange, placeholder = 'Add tags...' }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Tag[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (highlightedIndex !== null && inputRef.current) {
      // Keep focus on input when navigating
      inputRef.current.focus();

      // Scroll highlighted item into view
      if (suggestionsRef.current && suggestionsRef.current.children[highlightedIndex]) {
        suggestionsRef.current.children[highlightedIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [highlightedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    const filtered = suggestions
      .filter((suggestion) => !tags.some((tag) => tag.name === suggestion.name))
      .filter((suggestion) => suggestion.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredSuggestions(filtered);
    setIsDropdownOpen(!!value && !!filtered.length);
    setHighlightedIndex(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission

      if (inputValue.trim() !== '') {
        const newTag =
          highlightedIndex !== null && isDropdownOpen
            ? filteredSuggestions[highlightedIndex]
            : { name: inputValue.trim(), _id: '' };
        setTags([...tags, newTag]);
        setInputValue('');
        setIsDropdownOpen(false);
        onTagsChange([...tags, newTag]);
        setHighlightedIndex(null);
      }
    } else if (event.key === 'Backspace' && inputValue === '') {
      const newTags = [...tags];
      newTags.pop();
      setTags(newTags);
      onTagsChange(newTags);
      setHighlightedIndex(null);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault(); // Prevent cursor movement

      if (isDropdownOpen) {
        setHighlightedIndex((prevIndex) =>
          prevIndex !== null && prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0
        );
      } else if (filteredSuggestions.length > 0) {
        setIsDropdownOpen(true);
        setHighlightedIndex(0);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault(); // Prevent cursor movement

      if (isDropdownOpen) {
        setHighlightedIndex((prevIndex) =>
          prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1
        );
      }
    } else if (event.key === 'Escape') {
      setIsDropdownOpen(false);
      setHighlightedIndex(null);
    } else if (event.key === 'Tab' && isDropdownOpen && highlightedIndex !== null) {
      // Select current highlighted suggestion on Tab
      event.preventDefault();
      const newTag = filteredSuggestions[highlightedIndex];
      setTags([...tags, newTag]);
      setInputValue('');
      setIsDropdownOpen(false);
      onTagsChange([...tags, newTag]);
      setHighlightedIndex(null);
    }
  };

  const handleTagClick = (tag: Tag) => {
    const newTags = tags.filter((t) => t.name !== tag.name);
    setTags(newTags);
    onTagsChange(newTags);
    setHighlightedIndex(null);
  };

  const handleSuggestionClick = (suggestion: Tag) => {
    setTags([...tags, suggestion]);
    setInputValue('');
    setIsDropdownOpen(false);
    onTagsChange([...tags, suggestion]);
    setHighlightedIndex(null);
  };

  return (
    <div className="lt-TagInput" ref={containerRef}>
      <div className="lt-TagInput-container">
        {tags.map((tag) => (
          <div key={tag.name} className={'lt-TagInput-tag'}>
            {tag.name}
            <span
              onClick={() => handleTagClick(tag)}
              className="lt-TagInput-tag-close"
              aria-label={`Remove tag ${tag.name}`}
            >
              &times;
            </span>
          </div>
        ))}
        <input
          className="lt-TagInput-inputBox"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setIsDropdownOpen(true)}
          placeholder={placeholder}
          ref={inputRef}
          role="combobox"
          aria-expanded={isDropdownOpen}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-controls="tag-suggestions"
        />
      </div>

      {isDropdownOpen && filteredSuggestions.length > 0 && (
        <ul className="lt-TagInput-suggestions" ref={suggestionsRef} role="listbox" id="tag-suggestions">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion.name}
              className={`lt-TagInput-suggestions-item 
                  ${index === highlightedIndex ? ' lt-TagInput-suggestions-item-highlighted' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
              role="option"
              aria-selected={index === highlightedIndex}
              tabIndex={-1}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagInput;
