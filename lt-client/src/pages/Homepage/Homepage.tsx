import { useMemo, useContext } from 'react';
import { useLoaderData, useNavigate, NavLink } from 'react-router-dom';
import { Box, Button, Heading, Text, Link } from '@optiaxiom/react';
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

    const rows = [{ value: ['Class', 'Subjects'] }];
    sortedClasses.forEach((_class) => {
      const data = {
        value: [_class.name, String(_class.subjects.length)],
        options: { _id: _class._id },
      };
      rows.push(data);
    });
    return rows;
  }, [classes]);

  return (
    <Box className="lt-Homepage" w="full">
      {/* Hero Section */}
      <Box className="hero-section" p="24" mb="32" bg="bg.default" rounded="lg" shadow="md">
        <Heading className="hero-title" level="1" fontSize="3xl" fontWeight="700" mb="8">
          Learn Together
        </Heading>
        <Text fontSize="lg" color="fg.secondary" mb="20" mx="auto" maxW="md">
          Collaborative learning platform for students and educators
        </Text>
        <Box display="flex" justifyContent="center" gap="12" flexWrap="wrap">
          {!authCtx.isLoggedIn && (
            <NavLink to="/users/signup" className="navlink-unstyled">
              <Button>Join Now</Button>
            </NavLink>
          )}
          <NavLink to="/about" className="navlink-unstyled">
            <Button>Learn More</Button>
          </NavLink>
        </Box>
      </Box>

      {/* Classes Section */}
      <Box bg="bg.default" p="24" rounded="lg" shadow="md" mb="32">
        <Box mb="20">
          <Heading level="2" fontSize="xl" fontWeight="700" mb="4">
            Available Classes
          </Heading>
          <Text fontSize="sm" color="fg.secondary">
            Select a class to explore subjects and learning materials
          </Text>
        </Box>
        <Table rowData={rowData} onRowSelection={handleClassChange} />
      </Box>

      {/* Footer */}
      <Box className="footer-section" p="32" bg="bg.default" rounded="lg" shadow="md" asChild>
        <footer>
          <Box display="flex" flexDirection="row" flexWrap="wrap" gap="24" mb="24">
            {/* About Column */}
            <Box className="footer-column">
              <Box display="flex" alignItems="center" gap="8" mb="12">
                <FaGraduationCap size={18} />
                <Heading level="3" fontSize="md" fontWeight="700">
                  Learn Together
                </Heading>
              </Box>
              <Text fontSize="sm" color="fg.secondary">
                Empowering students and educators through collaborative learning since 2023.
              </Text>
            </Box>

            {/* Quick Links Column */}
            <Box className="footer-column">
              <Box display="flex" alignItems="center" gap="8" mb="12">
                <FaBook size={18} />
                <Heading level="3" fontSize="md" fontWeight="700">
                  Quick Links
                </Heading>
              </Box>
              <Box display="flex" flexDirection="column" gap="8">
                <NavLink to="/about" className="footer-link">
                  <FaInfoCircle size={14} />
                  <Text fontSize="sm">About Us</Text>
                </NavLink>
                <NavLink to="/users/signup" className="footer-link">
                  <FaUserPlus size={14} />
                  <Text fontSize="sm">Sign Up</Text>
                </NavLink>
                <NavLink to="/users/login" className="footer-link">
                  <FaSignInAlt size={14} />
                  <Text fontSize="sm">Login</Text>
                </NavLink>
              </Box>
            </Box>

            {/* Support Column */}
            <Box className="footer-column">
              <Box display="flex" alignItems="center" gap="8" mb="12">
                <FaEnvelope size={18} />
                <Heading level="3" fontSize="md" fontWeight="700">
                  Support
                </Heading>
              </Box>
              <Box display="flex" flexDirection="column" gap="8">
                <NavLink to="/faq" className="footer-link">
                  <FaQuestion size={14} />
                  <Text fontSize="sm">FAQs</Text>
                </NavLink>
                <a href="mailto:learntogether3009@gmail.com" className="footer-link">
                  <FaEnvelope size={14} />
                  <Text fontSize="sm">Contact Us</Text>
                </a>
              </Box>
            </Box>

            {/* Social Column */}
            <Box className="footer-column">
              <Heading level="3" fontSize="md" fontWeight="700" mb="12">
                Connect With Us
              </Heading>
              <Box display="flex" gap="10">
                <Link href="#" aria-label="Facebook">
                  <Box className="social-icon">
                    <FaFacebookF size={16} />
                  </Box>
                </Link>
                <Link href="#" aria-label="Twitter">
                  <Box className="social-icon">
                    <FaTwitter size={16} />
                  </Box>
                </Link>
                <Link href="#" aria-label="Instagram">
                  <Box className="social-icon">
                    <FaInstagram size={16} />
                  </Box>
                </Link>
                <Link href="#" aria-label="LinkedIn">
                  <Box className="social-icon">
                    <FaLinkedinIn size={16} />
                  </Box>
                </Link>
              </Box>
            </Box>
          </Box>

          {/* Copyright */}
          <Box pt="20" borderT="1" borderColor="border.default" textAlign="center">
            <Text fontSize="sm" color="fg.secondary">
              &copy; {new Date().getFullYear()} Learn Together. All rights reserved.
            </Text>
          </Box>
        </footer>
      </Box>
    </Box>
  );
};

export default HomePage;
