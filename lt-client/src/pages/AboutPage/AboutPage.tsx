import './_index.scss';
import { FaGithub, FaLinkedin, FaEnvelope, FaGlobe } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="lt-AboutPage">
      <div className="about-header">
        <h1>About Learn Together</h1>
        <div className="about-subheading">Empowering collaborative learning since 2023</div>
      </div>
      
      <div className="about-section mission-section">
        <h2>Our Mission</h2>
        <p>
          Learn Together is built with a simple yet powerful mission: to create a community where knowledge sharing is accessible, 
          engaging, and effective for everyone. We believe that the best learning happens when we collaborate and teach each other.
        </p>
      </div>
      
      <div className="about-section features-section">
        <h2>What We Offer</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Ask & Answer</h3>
            <p>Post your questions and receive thoughtful answers from the community. Share your expertise by answering others' questions.</p>
          </div>
          <div className="feature-card">
            <h3>Structured Learning</h3>
            <p>Content is organized by subjects, classes, and chapters to help you find exactly what you need.</p>
          </div>
          <div className="feature-card">
            <h3>Community Support</h3>
            <p>Join a supportive network of learners and educators working together to make education more accessible.</p>
          </div>
        </div>
      </div>
      
      <div className="about-section team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-photo" data-initials="RHS"></div>
            <h3>Md. Rakibul Hasan Sarker</h3>
            <p className="member-role">Developer</p>
            <div className="member-links">
              <a href="https://rhs99.github.io/" target="_blank" rel="noopener noreferrer" aria-label="Portfolio"><FaGlobe /></a>
              <a href="https://github.com/rhs99" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
              <a href="https://www.linkedin.com/in/mrhs" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="mailto:rhrana99@gmail.com" aria-label="Email"><FaEnvelope /></a>
            </div>
          </div>
          
          <div className="team-member">
            <div className="member-photo" data-initials="TA"></div>
            <h3>Tahmid Anjum</h3>
            <p className="member-role">Developer</p>
            <div className="member-links">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Portfolio"><FaGlobe /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="#" aria-label="Email"><FaEnvelope /></a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="about-section contact-section">
        <h2>Get Involved</h2>
        <p>
          We're always looking for contributors to help us improve Learn Together. Whether you're a developer, 
          designer, educator, or just passionate about learning, there's a place for you in our community.
        </p>
        <div className="cta-buttons">
          <a href="https://github.com/rhs99/learn-together" target="_blank" rel="noopener noreferrer" className="primary-button">
            <FaGithub /> Visit our GitHub
          </a>
          <a href="mailto:learntogether3009@gmail.com" className="secondary-button">
            <FaEnvelope /> Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
