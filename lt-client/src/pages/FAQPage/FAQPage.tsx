import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './_index.scss';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQPage = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.includes(index) ? prevOpenItems.filter((item) => item !== index) : [...prevOpenItems, index]
    );
  };

  const faqItems: FAQItem[] = [
    {
      question: 'What is Learn Together?',
      answer:
        'Learn Together is a collaborative learning platform designed to connect students and educators. Our platform allows users to ask questions, share knowledge, and engage with structured educational content organized by subjects, classes, and chapters.',
    },
    {
      question: 'How do I create an account?',
      answer:
        "To create an account, click on the 'Join Now' button on the homepage or the 'Sign Up' link in the navigation menu. Fill out the registration form with your information, verify your email address, and you're all set to start learning together!",
    },
    {
      question: 'Is the platform free to use?',
      answer:
        "Yes, Learn Together is completely free for basic usage. We offer premium features through donations that help support our platform's development and maintenance.",
    },
    {
      question: 'How can I ask a question?',
      answer:
        "Once logged in, navigate to the relevant chapter where your question belongs. Click on the 'Ask Question' button and fill in the required fields. Be sure to provide a clear title, detailed description, and relevant tags to get the best answers.",
    },
    {
      question: 'How are subjects and classes organized?',
      answer:
        'Our content is structured hierarchically. Classes contain multiple subjects, and subjects contain chapters. This organization helps users navigate to specific topics efficiently and find relevant questions and answers.',
    },
    {
      question: 'Can I contribute to the platform?',
      answer:
        "Absolutely! You can contribute by answering questions, providing feedback, and helping improve the platform. If you're a developer, you can also contribute to our open-source codebase on GitHub.",
    },
    {
      question: 'How can I contact support?',
      answer:
        'If you need assistance or have any questions, you can reach our support team by emailing learntogether3009@gmail.com. We aim to respond to all inquiries within 24-48 hours.',
    },
  ];

  return (
    <div className="lt-FAQPage">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about Learn Together</p>
      </div>

      <div className="faq-content" role="list">
        {faqItems.map((item, index) => (
          <div key={index} className={`faq-item ${openItems.includes(index) ? 'active' : ''}`} role="listitem">
            <div
              className="faq-question"
              onClick={() => toggleItem(index)}
              role="button"
              aria-expanded={openItems.includes(index)}
              aria-controls={`faq-answer-${index}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleItem(index);
                }
              }}
            >
              <h3>{item.question}</h3>
              <span className="icon-container" aria-hidden="true">
                {openItems.includes(index) ? <FaChevronUp className="icon" /> : <FaChevronDown className="icon" />}
              </span>
            </div>
            {openItems.includes(index) && (
              <div
                className="faq-answer"
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
              >
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
