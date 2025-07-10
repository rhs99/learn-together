import { useMemo, useContext } from 'react';
import { useLoaderData, useNavigate, NavLink } from 'react-router-dom';
import Table from '../../design-library/Table/Table';
import { Class } from '../../types';
import AuthContext from '../../store/auth';
import {
  FaGraduationCap,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaInfoCircle,
  FaBook,
  FaUserPlus,
  FaSignInAlt,
  FaQuestion,
  FaEnvelope,
} from 'react-icons/fa';

import './_index.scss';

const CLASS_ORDER = [
  { range: [6], order: 0 },
  { range: [7], order: 1 },
  { range: [8], order: 2 },
  { range: [9, 10], order: 3 },
  { range: [11, 12], order: 4 },
];

const getClassOrder = (className: string): number => {
  const classNumber = className.match(/\d+/g);
  if (!classNumber) return 999;
  const num = parseInt(classNumber[0]);
  const match = CLASS_ORDER.find((item) => item.range.includes(num));
  return match ? match.order : 999;
};

const HomePage = () => {
  const classes = useLoaderData();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const handleClassChange = (_id: string) => {
    navigate(`/classes/${_id}`);
  };

  const rowData = useMemo(() => {
    const sortedClasses = [...(classes as Class[])].sort((a, b) => {
      return getClassOrder(a.name) - getClassOrder(b.name);
    });

    const rows: any = [{ value: ['Class', 'Subjects'] }];
    sortedClasses.forEach((_class) => {
      const data = {
        value: [_class.name, _class.subjects.length],
        options: { _id: _class._id },
      };
      rows.push(data);
    });
    return rows;
  }, [classes]);

  return (
    <div className="lt-Homepage">
      <div className="welcome-banner">
        <h1>Learn Together</h1>
        <p className="platform-description">Collaborative learning platform for students and educators</p>
        <div className="registration-buttons">
          {!authCtx.isLoggedIn && (
            <NavLink to="/users/signup" className="lt-button lt-button-primary">
              Join Now
            </NavLink>
          )}
          <NavLink to="/about" className="lt-button lt-button-light">
            Learn More
          </NavLink>
        </div>
      </div>

      <div className="classes-container">
        <div className="classes-introduction">
          <h2>Available Classes</h2>
          <p>Select a class to explore subjects and learning materials</p>
        </div>
        <Table rowData={rowData} onRowSelection={handleClassChange} />
      </div>

      <footer className="homepage-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>
              <FaGraduationCap className="footer-icon" /> Learn Together
            </h3>
            <p>Empowering students and educators through collaborative learning since 2023.</p>
          </div>
          <div className="footer-section">
            <h3>
              <FaBook className="footer-icon" /> Quick Links
            </h3>
            <ul>
              <li>
                <NavLink to="/about" className={({ isActive }) => (isActive ? 'footer-link active' : 'footer-link')}>
                  <FaInfoCircle /> About Us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/users/signup"
                  className={({ isActive }) => (isActive ? 'footer-link active' : 'footer-link')}
                >
                  <FaUserPlus /> Sign Up
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/users/login"
                  className={({ isActive }) => (isActive ? 'footer-link active' : 'footer-link')}
                >
                  <FaSignInAlt /> Login
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>
              <FaEnvelope className="footer-icon" /> Support
            </h3>
            <ul>
              <li>
                <NavLink to="/faq" className={({ isActive }) => (isActive ? 'footer-link active' : 'footer-link')}>
                  <FaQuestion /> FAQs
                </NavLink>
              </li>
              <li>
                <a href="mailto:learntogether3009@gmail.com" className="footer-link">
                  <FaEnvelope /> Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Connect With Us</h3>
            <div className="social-links">
              <a href="#" className="social-icon" title="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="social-icon" title="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-icon" title="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-icon" title="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Learn Together. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
