import { ProfileDto } from '@dto/profile.dto';
import { css } from '@emotion/react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const containerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const buttonStyle = css`
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  font-size: 18px;
  cursor: pointer;
  text-transform: capitalize;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const fetchProfiles = async (): Promise<ProfileDto[]> => {
  const response = await fetch('/api/profiles');
  return response.json();
}

const ProfileSelectionView: React.FC = () => {
  const navigate = useNavigate();
  const { data: profiles, error, isLoading } = useQuery<ProfileDto[]>({
    queryKey: ['profiles'],
    queryFn: fetchProfiles,
  });

  const handleProfileClick = (profile: string) => {
    console.log(`Selected profile: ${profile}`);
    navigate('/team/' + profile);
    // Navigate to the team view with placeholder team id for that profile
  };

  return (
    <>
      <h1 data-testid="greeting">Profile Selection</h1>
      <div css={containerStyle} data-testid="profile-selection-container">
        {profiles?.map((profile) => (
          <button
            key={profile.profile_id}
            css={buttonStyle}
            onClick={() => handleProfileClick(profile.username)}
            data-testid={`profile-button-${profile.username.toLowerCase()}`}
          >
            {profile.username.toLocaleLowerCase()} Profile
          </button>
        ))}
      </div>
    </>
  );
};

export default ProfileSelectionView;