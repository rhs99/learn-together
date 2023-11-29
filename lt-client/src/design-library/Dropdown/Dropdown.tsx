import './_index.scss';

export type Option = {
  label?: string;
  value: string;
  component?: React.ReactNode;
};

type DropdownProps = {
  options: Option[];
  onSelect: (value: string) => void;
  anchorElement?: HTMLElement | null;
  isShown: boolean;
  onClose: () => void;
  className?: string;
};

const Dropdown = ({ options, onSelect, anchorElement, isShown, onClose, className = '' }: DropdownProps) => {
  const handleOptionClick = (option: Option) => {
    onSelect(option.value);
    onClose();
  };

  const calculateDropdownPosition = () => {
    if (!anchorElement) return {};

    const rect = anchorElement.getBoundingClientRect();
    return { top: rect.bottom, left: rect.left - 100 };
  };

  if (!isShown) {
    return null;
  }

  return (
    <div className={`lt-Dropdown ${className}`} style={calculateDropdownPosition()}>
      <ul className="options-list">
        {options.map((option, index) => (
          <li key={index} onClick={() => handleOptionClick(option)}>
            {Boolean(option.component) && option.component}
            {Boolean(option.label) && option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;