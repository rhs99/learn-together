import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import RootLayout from './pages/RootLayout';
import HoomePage from './pages/Homepage';
import ErrorPage from './pages/Errorpage';
import SignupPage, { loader as ClassLoader, action as SignupAction } from './pages/Signup/Signup';
import LoginPage from './pages/Login/Login';
import ClassDetail from './pages/ClassDetail/ClassDetail';
import SubjectDetail from './pages/SubjectDetail/SubjectDetail';
import ChapterDetail from './pages/ChapterDetail/ChapterDetail';
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
          { index: true, element: <HoomePage />, loader: ClassLoader },
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
          {
            path: '/classes/:classId',
            element: <ClassDetail />,
          },
          {
            path: '/subjects/:subjectId',
            element: <SubjectDetail />,
          },
          {
            path: '/chapters/:chapterId',
            element: <ChapterDetail />,
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
