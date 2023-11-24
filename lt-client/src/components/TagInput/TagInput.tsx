import { WithContext as ReactTags } from 'react-tag-input';

import './_index.scss';

type TagInputProps = {
  tags: any;
  suggestions: any;
  handleDelete: any;
  handleAddition: any;
  placeholder?: string;
};

const TagInput = ({ tags, suggestions, handleDelete, handleAddition, placeholder }: TagInputProps) => {
  return (
    <ReactTags
      tags={tags}
      suggestions={suggestions}
      handleDelete={handleDelete}
      handleAddition={handleAddition}
      inputFieldPosition="bottom"
      autocomplete
      placeholder={placeholder}
    />
  );
};

export default TagInput;
