import { useMemo, useContext } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
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
  FaShieldAlt,
  FaFileContract,
} from 'react-icons/fa';

import './_index.scss';

const HomePage = () => {
  const classes = useLoaderData();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const handleClassChange = (_id: string) => {
    navigate(`/classes/${_id}`);
  };

  const rowData = useMemo(() => {
    const rows: any = [{ value: ['Class', 'Subjects'] }];
    (classes as Class[]).forEach((_class) => {
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
            <button className="lt-button lt-button-primary" onClick={() => navigate('/users/signup')}>
              Join Now
            </button>
          )}
          <button className="lt-button lt-button-light" onClick={() => navigate('/about')}>
            Learn More
          </button>
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
                <a href="/about">
                  <FaInfoCircle /> About Us
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/users/signup')} className="footer-link">
                  <FaUserPlus /> Sign Up
                </a>
              </li>
              <li>
                <a onClick={() => navigate('/users/login')} className="footer-link">
                  <FaSignInAlt /> Login
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>
              <FaEnvelope className="footer-icon" /> Support
            </h3>
            <ul>
              <li>
                <a href="#">
                  <FaQuestion /> FAQs
                </a>
              </li>
              <li>
                <a href="#">
                  <FaEnvelope /> Contact Us
                </a>
              </li>
              <li>
                <a href="#">
                  <FaShieldAlt /> Privacy Policy
                </a>
              </li>
              <li>
                <a href="#">
                  <FaFileContract /> Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Connect With Us</h3>
            <div className="social-links">
              <a href="#" className="social-icon">
                <FaFacebookF />
              </a>
              <a href="#" className="social-icon">
                <FaTwitter />
              </a>
              <a href="#" className="social-icon">
                <FaInstagram />
              </a>
              <a href="#" className="social-icon">
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
