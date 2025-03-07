import { css } from '@emotion/react';
import { useParams, useNavigate } from 'react-router-dom';

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

const backButtonStyle = css`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

function TeamSelectionView(){
  const navigate = useNavigate();
  let { team } = useParams();
  //  let data = useFakeDataLibrary(`/api/v2/teams/${team}`);


  const handlePokemonClick = (profile: string) => {
    console.log(`Selected pokemon: ${profile}`);
    // To-Do - Add the selected pokemon to the team
  };

  return (
    <>
        <h1 data-testid="greeting">Team Selection
        <button data-testid='back-button' css={backButtonStyle} onClick={() => navigate('/')}>
            Back
        </button>
        </h1>
        <div css={containerStyle} data-testid='selectable pokemon'>
        <button data-testid='pokemon-1' css={buttonStyle} onClick={() => handlePokemonClick('Bulbasaur')}>
            Bulbasaur
        </button>
        <button data-testid='pokemon-2' css={buttonStyle} onClick={() => handlePokemonClick('Ivysaur')}>
            Ivysaur
        </button>
        <button data-testid='pokemon-3' css={buttonStyle} onClick={() => handlePokemonClick('Venasaur')}>
            Venasaur
        </button>
        </div>
    </>
  );
};

export default TeamSelectionView;