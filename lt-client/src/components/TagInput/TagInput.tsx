import { useState, ChangeEvent, KeyboardEvent, useRef, useEffect } from 'react';
import { Tag } from '../../types';

import './_index.scss';

interface TagInputProps {
  suggestions: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

const TagInput = ({ suggestions, onTagsChange }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Tag[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (highlightedIndex !== null && inputRef.current) {
      inputRef.current.setSelectionRange(0, 0);
      const suggestionsContainer = document.querySelector('.suggestions');
      if (suggestionsContainer && suggestionsContainer.children[highlightedIndex]) {
        suggestionsContainer.children[highlightedIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [highlightedIndex]);

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
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      const newTag =
        highlightedIndex !== null ? filteredSuggestions[highlightedIndex] : { name: inputValue.trim(), _id: '' };
      setTags([...tags, newTag]);
      setInputValue('');
      setIsDropdownOpen(false);
      onTagsChange([...tags, newTag]);
      setHighlightedIndex(null);
    } else if (event.key === 'Backspace' && inputValue === '') {
      const newTags = [...tags];
      newTags.pop();
      setTags(newTags);
      onTagsChange(newTags);
      setHighlightedIndex(null);
    } else if (event.key === 'ArrowDown' && isDropdownOpen) {
      setHighlightedIndex((prevIndex) =>
        prevIndex !== null && prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (event.key === 'ArrowUp' && isDropdownOpen) {
      setHighlightedIndex((prevIndex) =>
        prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1
      );
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
    <div className="tag-input">
      <div className="tags-container">
        {tags.map((tag, index) => (
          <div
            key={tag.name}
            className={`tag ${index === highlightedIndex ? 'highlighted' : ''}`}
            onClick={() => handleTagClick(tag)}
          >
            {tag.name}
            <span className="tag-close-btn">&times;</span>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Add tags..."
          ref={inputRef}
        />
      </div>

      {isDropdownOpen && (
        <ul className="suggestions">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion.name}
              className={index === highlightedIndex ? 'highlighted' : ''}
              onClick={() => handleSuggestionClick(suggestion)}
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
