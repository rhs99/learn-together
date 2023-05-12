import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import RootLayout from './pages/RootLayout';
import HoomePage from './pages/Homepage';
import ErrorPage from './pages/Errorpage';
import SignupPage, { loader as ClassLoader, action as SignupAction } from './pages/Signup/Signup';
import LoginPage from './pages/Login/Login';
import { AuthContextProvider } from './store/auth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <HoomePage /> },
          { path: '/about', element: <ErrorPage /> },
          {
            path: '/users/signup',
            element: <SignupPage />,
            loader: ClassLoader,
            action: SignupAction,
          },
          {
            path: '/users/login',
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
};

export default App;
