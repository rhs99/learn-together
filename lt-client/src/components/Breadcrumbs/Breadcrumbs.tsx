import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '@optiaxiom/react/unstable';

type BreadcrumbsProps = {
  items: { name: string; url?: string | null }[];
};

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const navigate = useNavigate();

  return (
    <Breadcrumb
      items={items.map((item) => ({
        label: item.name,
        execute: () => {
          if (item.url) {
            navigate(item.url);
          }
        },
      }))}
    />
  );
};

export default Breadcrumbs;
