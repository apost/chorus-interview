import { css } from '@emotion/react';
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
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ProfileSelectionView: React.FC = () => {
  const navigate = useNavigate();

  const handleProfileClick = (profile: string) => {
    console.log(`Selected profile: ${profile}`);
    navigate('/team/'+profile); 
    // Navigate to the team view with placeholder team id for that profile
  };

  return (
    <>
        <h1 data-testid="greeting">Profile Selection</h1>
        <div css={containerStyle} data-testid="profile-selection-container">
          <button css={buttonStyle} onClick={() => handleProfileClick('red')} data-testid="profile-button-red">
              Red Profile
          </button>
          <button css={buttonStyle} onClick={() => handleProfileClick('blue')} data-testid="profile-button-blue">
              Blue Profile
          </button>
        </div>
    </>
  );
};

export default ProfileSelectionView;