import './_index.scss';
import { FaGithub, FaLinkedin, FaEnvelope, FaGlobe } from 'react-icons/fa';
import { Box, Text, Heading, Button, Flex } from '@optiaxiom/react';

const AboutPage = () => {
  return (
    <Box className="lt-AboutPage" w="full" pb="80">
      <Box className="about-header" textAlign="center" mb="64">
        <Heading level="1" fontSize="4xl" mb="8">
          About Learn Together
        </Heading>
        <Text fontSize="lg" color="fg.secondary" mb="32">
          Empowering collaborative learning since 2023
        </Text>
      </Box>

      <Box className="about-section mission-section">
        <Heading level="2" fontSize="2xl" mb="24">
          Our Mission
        </Heading>
        <Text fontSize="md" color="fg.secondary" style={{ lineHeight: '1.625' }}>
          Learn Together is built with a simple yet powerful mission: to create a community where knowledge sharing is
          accessible, engaging, and effective for everyone. We believe that the best learning happens when we
          collaborate and teach each other.
        </Text>
      </Box>

      <Box className="about-section features-section">
        <Heading level="2" fontSize="2xl" mb="24">
          What We Offer
        </Heading>
        <Flex className="features-grid">
          <Box className="feature-card">
            <Heading level="3" fontSize="lg" mb="12" color="fg.accent">
              Ask & Answer
            </Heading>
            <Text fontSize="md" color="fg.secondary" style={{ lineHeight: '1.625' }}>
              Post your questions and receive thoughtful answers from the community. Share your expertise by answering
              others' questions.
            </Text>
          </Box>
          <Box className="feature-card">
            <Heading level="3" fontSize="lg" mb="12" color="fg.accent">
              Structured Learning
            </Heading>
            <Text fontSize="md" color="fg.secondary" style={{ lineHeight: '1.625' }}>
              Content is organized by subjects, classes, and chapters to help you find exactly what you need.
            </Text>
          </Box>
          <Box className="feature-card">
            <Heading level="3" fontSize="lg" mb="12" color="fg.accent">
              Community Support
            </Heading>
            <Text fontSize="md" color="fg.secondary" style={{ lineHeight: '1.625' }}>
              Join a supportive network of learners and educators working together to make education more accessible.
            </Text>
          </Box>
        </Flex>
      </Box>

      <Box className="about-section team-section">
        <Heading level="2" fontSize="2xl" mb="24">
          Meet Our Team
        </Heading>
        <Flex className="team-grid">
          <Box className="team-member" textAlign="center">
            <Box className="member-photo" data-initials="RHS"></Box>
            <Heading level="3" fontSize="lg" mb="4">
              Md. Rakibul Hasan Sarker
            </Heading>
            <Text className="member-role" fontSize="sm" color="fg.accent" mb="16">
              Developer
            </Text>
            <Flex className="member-links" flexDirection="row" justifyContent="center" gap="16">
              <a href="https://rhs99.github.io/" target="_blank" rel="noopener noreferrer" aria-label="Portfolio">
                <FaGlobe />
              </a>
              <a href="https://github.com/rhs99" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/mrhs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a href="mailto:rhrana99@gmail.com" aria-label="Email">
                <FaEnvelope />
              </a>
            </Flex>
          </Box>

          <Box className="team-member" textAlign="center">
            <Box className="member-photo" data-initials="TA"></Box>
            <Heading level="3" fontSize="lg" mb="4">
              Tahmid Anjum
            </Heading>
            <Text className="member-role" fontSize="sm" color="fg.accent" mb="16">
              Developer
            </Text>
            <Flex className="member-links" flexDirection="row" justifyContent="center" gap="16">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Portfolio">
                <FaGlobe />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="#" aria-label="Email">
                <FaEnvelope />
              </a>
            </Flex>
          </Box>
        </Flex>
      </Box>

      <Box className="about-section contact-section" textAlign="center">
        <Heading level="2" fontSize="2xl" mb="24">
          Get Involved
        </Heading>
        <Text fontSize="md" color="fg.secondary" mb="32" style={{ lineHeight: '1.625' }}>
          We're always looking for contributors to help us improve Learn Together. Whether you're a developer, designer,
          educator, or just passionate about learning, there's a place for you in our community.
        </Text>
        <Flex className="cta-buttons" flexDirection="row" justifyContent="center" gap="24">
          <Button asChild size="lg" className="primary-button">
            <a href="https://github.com/rhs99/learn-together" target="_blank" rel="noopener noreferrer">
              <FaGithub /> Visit our GitHub
            </a>
          </Button>
          <Button asChild appearance="subtle" size="lg" className="secondary-button">
            <a href="mailto:learntogether3009@gmail.com">
              <FaEnvelope /> Contact Us
            </a>
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default AboutPage;
