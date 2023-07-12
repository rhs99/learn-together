import { Outlet } from 'react-router-dom';

// import MainNavigation from '../components/MainNavigation/MainNavigation';
import Navigation from '../components/MainNavigation/Navigation';

const RootLayout = () => {
  return (
    <>
      <Navigation />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
