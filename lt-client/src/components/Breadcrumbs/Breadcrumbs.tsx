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
                <a href={item.url}>{item.name}</a>
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
