import { Outlet } from 'react-router-dom';
import Navigation from '../components/MainNavigation/Navigation';
import './_root-layout.scss';

const RootLayout = () => {
  return (
    <div className="lt-RootLayout">
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
