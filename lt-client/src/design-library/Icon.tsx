import Icons from './icon-svgs/icons.svg';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  onClick?: any;
  className?: string;
  disabled?: boolean;
};

const Icon = ({ name, size = 16, color = 'black', onClick, className, disabled }: IconProps) => {
  const styles = {
    onClick: {
      cursor: 'pointer',
    },
  };
  return (
    <svg
      fill={disabled ? 'grey' : color}
      width={size}
      height={size}
      onClick={disabled ? null : onClick}
      className={className}
      style={onClick && !disabled ? styles.onClick : {}}
    >
      <use xlinkHref={`${Icons}#icon-${name}`} />
    </svg>
  );
};

export default Icon;
