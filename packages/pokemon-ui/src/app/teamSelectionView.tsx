import { css } from '@emotion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { PokemonDto } from '@dto/pokemon.dto';
import { PokemonInstanceDto } from '@dto/pokemonInstance.dto';
import { TeamDto } from '@dto/team.dto';

const containerStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  padding: 20px;
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

const fetchTeam = async (profileName: string): Promise<TeamDto> => {
  const response = await axios.get(`/api/teams/${profileName}`);
  return response.data;
}

function TeamSelectionView(){
  const navigate = useNavigate();
  let { team } = useParams();

  const { data: pokemonList, error: pokemonError, isLoading: pokemonIsLoading } = useQuery<PokemonDto[]>({
    queryKey: ['pokemon'],
    queryFn: fetchPokemon,
  });

  const { data: teamList, error: teamError, isLoading: teamIsLoading } = useQuery<TeamDto>({
    queryKey: ['team', team],
    queryFn: () => fetchTeam(team || ''),
  });

  const isLoading = pokemonIsLoading || teamIsLoading;
  const error = pokemonError || teamError;

  const handlePokemonClick = (name: string) => {
    console.log(`Selected pokemon: ${name}`);
    // To-Do - Add the selected pokemon to the team
  };

  const handleTeamClick = (id: number) => {
    console.log(`Team removing pokemon: ${id}`);
    // To-Do - Remove the selected pokemon from the team
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading Pokémon</div>;

  return (
    <>
        <h1 data-testid="greeting">Team Selection - {teamList?.profile.username}
        <button data-testid='back-button' css={backButtonStyle} onClick={() => navigate('/')}>
            Back
        </button>
        </h1>
        <h2 data-testid='team-list'>Team List</h2>
        <div css={containerStyle} data-testid='team pokemon'>
          {teamList?.pokemonInstances?.map((pokemonInstance: { id: number, prototype: PokemonDto, nickname: string, captured_at: Date, teamId: number }, index: number) => (
            <button
              key={index}
              data-testid={`pokemon-${pokemonInstance.id}`}
              css={buttonStyle}
              onClick={() => handleTeamClick(pokemonInstance.id)}
            >
              {pokemonInstance.nickname || pokemonInstance.prototype.name}
            </button>
          ))}
        </div>
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