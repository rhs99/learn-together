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
  shift?: number;
};

const Dropdown = ({
  options,
  onSelect,
  anchorElement,
  isShown,
  onClose,
  className = '',
  shift = 80,
}: DropdownProps) => {
  const handleOptionClick = (option: Option) => {
    onSelect(option.value);
    onClose();
  };

  const calculateDropdownPosition = () => {
    if (!anchorElement) return {};

    const rect = anchorElement.getBoundingClientRect();
    return { top: rect.bottom, left: rect.left - shift };
  };

  if (!isShown) {
    return null;
  }

  return (
    <div className={`lt-Dropdown ${className}`} style={calculateDropdownPosition()}>
      <ul className="lt-Dropdown-options-list">
        {options.map((option, index) => (
          <li className="lt-Dropdown-option" key={index} onClick={() => handleOptionClick(option)}>
            {Boolean(option.component) && option.component}
            {Boolean(option.label) && option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
