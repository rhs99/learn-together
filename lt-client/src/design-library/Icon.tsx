import Icons from './icon-svgs/icons.svg';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
};

const Icon = ({ name, size = 12, color = 'black' }: IconProps) => {
  return (
    <svg fill={color} width={size} height={size}>
      <use xlinkHref={`${Icons}#icon-${name}`} />
    </svg>
  );
};

export default Icon;
