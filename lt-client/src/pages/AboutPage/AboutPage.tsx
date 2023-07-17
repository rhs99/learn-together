import './_index.scss';
import { Typography, Link } from '@mui/material';

const AboutPage = () => {
  return (
    <div className="lt-AboutPage">
      <Typography>
        Greetings!
        <br />
        This platform is developed keeping in mind of helping you to learn and grow together.
      </Typography>
      <br />
      <Typography>Contributors:</Typography>
      <ol>
        <li>
          <Link href="https://rhs99.github.io/portfolio/" underline="none" target="_blank">
            Md. Rakibul Hasan Sarker
          </Link>
        </li>
        <li>
          <Link href="#" underline="none" target="_blank">
            Tahmid Anjum
          </Link>
        </li>
      </ol>
    </div>
  );
};

export default AboutPage;
