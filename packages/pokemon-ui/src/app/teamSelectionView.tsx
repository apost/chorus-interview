import { css } from '@emotion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { PokemonDto } from '@dto/pokemon.dto';

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

const fetchPokemon = async (): Promise<PokemonDto[]> => {
  const response = await axios.get('/api/pokemon');
  return response.data;
};

function TeamSelectionView(){
  const navigate = useNavigate();
  let { team } = useParams();
  //  let data = useFakeDataLibrary(`/api/v2/teams/${team}`);

  const { data: pokemonList, error, isLoading } = useQuery<PokemonDto[]>({
    queryKey: ['pokemon'],
    queryFn: fetchPokemon,
  });

  const handlePokemonClick = (profile: string) => {
    console.log(`Selected pokemon: ${profile}`);
    // To-Do - Add the selected pokemon to the team
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading Pokémon</div>;

  console.log('pokemonList - ' + pokemonList);

  return (
    <>
        <h1 data-testid="greeting">Team Selection
        <button data-testid='back-button' css={backButtonStyle} onClick={() => navigate('/')}>
            Back
        </button>
        </h1>
        <div css={containerStyle} data-testid='selectable pokemon'>
          {pokemonList?.map((pokemon: { name: string, display_id: number }, index: number) => (
            <button
              key={index}
              data-testid={`pokemon-${pokemon.display_id}`}
              css={buttonStyle}
              onClick={() => handlePokemonClick(pokemon.name)}
            >
              {pokemon.name}
            </button>
          ))}
        </div>
    </>
  );
};

export default TeamSelectionView;