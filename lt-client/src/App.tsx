import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AxiomProvider } from '@optiaxiom/react';

import RootLayout from './pages/RootLayout';
import HomePage from './pages/Homepage/Homepage';
import ErrorPage from './pages/Errorpage';
import SignupPage, { loader as ClassLoader } from './pages/Signup/Signup';
import LoginPage from './pages/Login/Login';
import ClassDetail from './pages/ClassDetail/ClassDetail';
import SubjectDetail from './pages/SubjectDetail/SubjectDetail';
import ChapterDetail from './pages/ChapterDetail/ChapterDetail';
import AskQuestion from './pages/AskQuestion/AskQuestion';
import QuestionDetail from './pages/QuestionDetail/QuestionDetail';
import AnswerPage from './pages/AnswerPage/AnswerPage';
import QuestionEdit from './pages/QuestionEdit/QuestionEdit';
import AnswerEdit from './pages/AnswerEdit/AnswerEdit';
import AboutPage from './pages/AboutPage/AboutPage';
import FAQPage from './pages/FAQPage/FAQPage';
import DonationPage from './pages/Donation/Donation';
import { AuthContextProvider } from './store/auth';
import Profile from './pages/Profile/Profile';
import Settings from './pages/SettingsPage/Settings';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPassword/ResetPasswordPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    HydrateFallback: () => <p>Loading...</p>,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <HomePage />, loader: ClassLoader },
          { path: '/about', element: <AboutPage /> },
          { path: '/faq', element: <FAQPage /> },
          { path: '/donate', element: <DonationPage /> },
          { path: '/users/:userName', element: <Profile /> },
          { path: '/users/:userName/settings', element: <Settings />, loader: ClassLoader },
          {
            path: '/users/signup',
            element: <SignupPage />,
            loader: ClassLoader,
          },
          {
            path: '/users/login',
            element: <LoginPage />,
          },
          {
            path: '/users/forgot-password',
            element: <ForgotPasswordPage />,
          },
          {
            path: '/users/reset-password/:userId/:token',
            element: <ResetPasswordPage />,
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
          {
            path: '/chapters/:chapterId/ask',
            element: <AskQuestion />,
          },
          {
            path: '/questions/:questionId',
            element: <QuestionDetail />,
          },
          {
            path: '/questions/:questionId/edit',
            element: <QuestionEdit />,
          },
          {
            path: '/answers/:answerId',
            element: <AnswerPage />,
          },
          {
            path: '/answers/:answerId/edit',
            element: <AnswerEdit />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <AxiomProvider>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </AxiomProvider>
  );
};

export default App;
