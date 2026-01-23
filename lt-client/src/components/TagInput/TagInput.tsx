import { useState, KeyboardEvent, useRef, useEffect, useCallback, useMemo } from 'react';
import { Badge, Box, Flex, Input, Text } from '@optiaxiom/react';
import { Tag } from '../../types';

import './_index.scss';

interface TagInputProps {
  suggestions: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
  maxTags?: number;
  initialTags?: Tag[];
}

const TagInput = ({
  suggestions,
  onTagsChange,
  placeholder = 'Add tags...',
  maxTags,
  initialTags = [],
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const filteredSuggestions = useMemo(() => {
    const availableSuggestions = suggestions.filter((suggestion) => !tags.some((tag) => tag.name === suggestion.name));

    if (!inputValue.trim()) return availableSuggestions;

    return availableSuggestions.filter((suggestion) =>
      suggestion.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, suggestions, tags]);

  const hasReachedMaxTags = useMemo(() => {
    return maxTags !== undefined && tags.length >= maxTags;
  }, [maxTags, tags.length]);

  useEffect(() => {
    if (highlightedIndex !== null && suggestionsRef.current?.children[highlightedIndex]) {
      suggestionsRef.current.children[highlightedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [highlightedIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setHighlightedIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = useCallback(
    (tag: Tag) => {
      if (hasReachedMaxTags) return;

      const isDuplicate = tags.some((t) => t.name === tag.name);
      if (isDuplicate) return;

      const newTags = [...tags, tag];
      setTags(newTags);
      onTagsChange(newTags);
      setInputValue('');
      setIsDropdownOpen(false);
      setHighlightedIndex(null);

      inputRef.current?.focus();
    },
    [hasReachedMaxTags, tags, onTagsChange]
  );

  const removeTag = useCallback(
    (tagToRemove: Tag) => {
      const newTags = tags.filter((t) => t.name !== tagToRemove.name);
      setTags(newTags);
      onTagsChange(newTags);
      setHighlightedIndex(null);

      inputRef.current?.focus();
    },
    [tags, onTagsChange]
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      setHighlightedIndex(null);

      const availableSuggestions = suggestions.filter(
        (suggestion) => !tags.some((tag) => tag.name === suggestion.name)
      );

      if (value.trim()) {
        const filtered = availableSuggestions.filter((suggestion) =>
          suggestion.name.toLowerCase().includes(value.toLowerCase())
        );
        setIsDropdownOpen(filtered.length > 0);
      } else {
        setIsDropdownOpen(false);
      }
    },
    [suggestions, tags]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();

        if (hasReachedMaxTags) return;

        const trimmedValue = inputValue.trim();
        if (!trimmedValue) return;

        const newTag =
          highlightedIndex !== null && isDropdownOpen
            ? filteredSuggestions[highlightedIndex]
            : { name: trimmedValue, _id: '' };

        addTag(newTag);
      } else if (event.key === 'Backspace' && inputValue === '' && tags.length > 0) {
        const lastTag = tags[tags.length - 1];
        removeTag(lastTag);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();

        if (!isDropdownOpen && filteredSuggestions.length > 0) {
          setIsDropdownOpen(true);
          setHighlightedIndex(0);
        } else if (isDropdownOpen) {
          setHighlightedIndex((prevIndex) =>
            prevIndex !== null && prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0
          );
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();

        if (isDropdownOpen) {
          setHighlightedIndex((prevIndex) =>
            prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1
          );
        }
      } else if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setHighlightedIndex(null);
      } else if (event.key === 'Tab' && isDropdownOpen && highlightedIndex !== null) {
        event.preventDefault();
        addTag(filteredSuggestions[highlightedIndex]);
      }
    },
    [hasReachedMaxTags, inputValue, highlightedIndex, isDropdownOpen, filteredSuggestions, tags, addTag, removeTag]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: Tag) => {
      addTag(suggestion);
    },
    [addTag]
  );

  const handleInputFocus = useCallback(() => {
    if (inputValue.trim() && filteredSuggestions.length > 0) {
      setIsDropdownOpen(true);
    }
  }, [inputValue, filteredSuggestions.length]);

  return (
    <Box className="lt-TagInput" ref={containerRef}>
      <Flex
        flexDirection="row"
        gap="4"
        flexWrap="wrap"
        alignItems="center"
        p="8"
        className={`lt-TagInput-container ${hasReachedMaxTags ? 'lt-TagInput-container--disabled' : ''}`}
      >
        {tags.map((tag) => (
          <Badge key={tag.name} intent="neutral" variant="subtle" className="lt-TagInput-tag">
            <Flex flexDirection="row" gap="4" alignItems="center">
              <Text fontSize="sm" fontWeight="500">
                {tag.name}
              </Text>
              <button
                onClick={() => removeTag(tag)}
                className="lt-TagInput-tag-close"
                aria-label={`Remove tag ${tag.name}`}
                type="button"
                tabIndex={0}
              >
                ×
              </button>
            </Flex>
          </Badge>
        ))}
        <Input
          value={inputValue}
          onValueChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={hasReachedMaxTags ? `Maximum ${maxTags} tags reached` : placeholder}
          disabled={hasReachedMaxTags}
          ref={inputRef}
          className="lt-TagInput-input"
          size="md"
          role="combobox"
          aria-expanded={isDropdownOpen}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-controls="tag-suggestions"
          aria-activedescendant={highlightedIndex !== null ? `tag-suggestion-${highlightedIndex}` : undefined}
        />
      </Flex>

      {isDropdownOpen && filteredSuggestions.length > 0 && (
        <ul className="lt-TagInput-suggestions" ref={suggestionsRef} role="listbox" id="tag-suggestions">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion.name}
              id={`tag-suggestion-${index}`}
              className={`lt-TagInput-suggestions-item${
                index === highlightedIndex ? ' lt-TagInput-suggestions-item--highlighted' : ''
              }`}
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

      {hasReachedMaxTags && (
        <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          p="8"
          mt="4"
          className="lt-TagInput-maxTags-warning"
          role="alert"
        >
          <Text fontSize="sm" fontWeight="500" color="fg.warning">
            Maximum of {maxTags} tags allowed
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default TagInput;
