import { NavLink } from 'react-router-dom';

import './_index.scss';

type BreadcrumbsProps = {
  items: { name: string; url?: string | null }[];
};

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="breadcrumbs">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.url ? (
              <>
                <NavLink to={item.url}>{item.name}</NavLink>
                <span className="sep">&gt;</span>
              </>
            ) : (
              <span>{item.name}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
