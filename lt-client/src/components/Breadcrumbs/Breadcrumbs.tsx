import { NavLink } from 'react-router-dom';

import './_index.scss';

type BreadcrumbsProps = {
  items: { name: string; url?: string | null }[];
};

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="lt-Breadcrumbs">
      <ul className="lt-Breadcrumbs-list">
        {items.map((item, index) => (
          <li key={index} className="lt-Breadcrumbs-item">
            {item.url ? (
              <>
                <NavLink to={item.url} className="lt-Breadcrumbs-link">
                  {item.name}
                </NavLink>
                <span className="lt-Breadcrumbs-separator">&gt;</span>
              </>
            ) : (
              <span className="lt-Breadcrumbs-nonlink">{item.name}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
