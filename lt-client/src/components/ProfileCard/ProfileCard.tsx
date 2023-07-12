import { Stack, Typography } from '@mui/material';
import './_index.scss';

type ProfileCardProps = {
  icon: JSX.Element;
  label: number;
  details: string;
};

const ProfileCard = ({ icon, label, details }: ProfileCardProps) => {
  return (
    <Stack direction="row">
      <div>{icon}</div>
      <Stack direction="column">
        <Typography>{label}</Typography>
        <Typography>{details}</Typography>
      </Stack>
    </Stack>
  );
};

export default ProfileCard;
