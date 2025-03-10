import { useState } from 'react';
import { ProfileDto } from '@dto/profile.dto';
import { css } from '@emotion/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';


const headingStyle = css`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
`;

const sectionStyle = css`
  margin-bottom: 30px;
  padding: 15px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const containerStyle = css`
  display: flex;
  padding: 10px;
  margin: 10px;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
`;

const inputStyle = css`
  padding: 10px;
  margin: 10px;
  font-size: 18px;
  border: 2px solid #000;
  border-radius: 8px;
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

const createProfile = async (username: string): Promise<ProfileDto> => {
  const response = await fetch('/api/profiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });
  return response.json();
}

const ProfileSelectionView: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profiles, error, isLoading } = useQuery<ProfileDto[]>({
    queryKey: ['profiles'],
    queryFn: fetchProfiles,
  });

  const mutation = useMutation({
    mutationFn: createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profiles'],
      });
    },
  });

  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleProfileClick = (profile: string) => {
    console.log(`Selected profile: ${profile}`);
    navigate('/team/' + profile);
    // Navigate to the team view with placeholder team id for that profile
  };

  const handleCreateProfileClick = () => {
    setIsCreatingProfile(!isCreatingProfile);
    setNewProfileName('');
    setErrorMessage('');
  };

  const handleCreateProfileSubmit = () => {
    if (profiles?.some(profile => profile.username.toLocaleLowerCase() === newProfileName.toLocaleLowerCase())) {
      setErrorMessage('Profile name already exists.');
      return;
    }

    console.log(`Creating profile: ${newProfileName}`);

    mutation.mutate(newProfileName, {
      onSuccess: (data) => {
        console.log(`Created profile: ${data.username}`);
        navigate('/team/' + data.username);
        // Navigate to the team view with placeholder team id for that profile
      },
      onError: (error) => {
        console.error('Error creating profile:', error);
        setErrorMessage('Error creating profile.');
      },
    });
  }

  return (
    <>
      <h1 css={headingStyle} data-testid="greeting">Profile Selection</h1>
      <section css={sectionStyle}>
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
      </section>
      <section css={sectionStyle}>
        <div css={containerStyle} data-testid="create-profile-container">
          <button css={buttonStyle} onClick={handleCreateProfileClick}>
            <span>Create Profile</span>
          </button>
          {isCreatingProfile && (
            <div>
              <input
                css={inputStyle}
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Enter profile name"
              />
              <button css={buttonStyle} onClick={handleCreateProfileSubmit}>
                Submit
              </button>
              {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProfileSelectionView;