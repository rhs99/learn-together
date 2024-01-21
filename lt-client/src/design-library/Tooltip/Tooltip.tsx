import React, { ReactNode, useState, useRef, useEffect } from 'react';
import './_index.scss'; // Import the CSS file

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    const tooltipElement = tooltipRef.current;
    if (!tooltipElement) {
      return;
    }

    const handleMouseEnter = () => showTooltip();
    const handleMouseLeave = () => hideTooltip();

    tooltipElement.addEventListener('mouseenter', handleMouseEnter);
    tooltipElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      tooltipElement.removeEventListener('mouseenter', handleMouseEnter);
      tooltipElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const tooltipClassName = `lt-TooltipContainer-tooltip ${position} ${isVisible ? 'visible' : ''}`;

  return (
    <div className="lt-TooltipContainer" ref={tooltipRef}>
      <div className={tooltipClassName}>{content}</div>
      {children}
    </div>
  );
};

export default Tooltip;
