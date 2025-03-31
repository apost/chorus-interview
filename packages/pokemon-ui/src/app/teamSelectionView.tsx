import { css } from '@emotion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { PokemonDto } from '@dto/pokemon.dto';
import { PokemonInstanceDto } from '@dto/pokemonInstance.dto';
import { TeamDto } from '@dto/team.dto';
import { useState } from 'react';

const headingStyle = css`
  text-align: center;
  font-size: 24px;
  line-height: 48px;
  font-weight: bold;
  color: #333;
  margin: 0px;
`;

const containerStyle = css`
  display: flex;
  wrap: nowrap;
  height: calc(100vh - 48px);
  align-items: stretch;
  align-content: stretch;
  margin: 0px;
`;

const teamBarStyle = css`
  flex: 0 1 300px;
  background: #ddd;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const pokemonGridContainerStyle = css`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const gridStyle = css`
  max-width: 90%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  overflow-y: auto;
  padding: 15px;
`;

const buttonStyle = css`
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 8px;
  padding: 20px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &:hover {
    background-color: #ddd;
    border-color: #333;
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

const errorStyle = css`
  color: red;
  margin: 10px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

const emptyTeamMessage = css`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

const modalStyle = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 2px solid #000;
  border-radius: 8px;
  z-index: 1000;
`;

const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const fetchSprite = async (id: number): Promise<string> => {
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return response.data.sprites.front_default;
}

const fetchPokemon = async (): Promise<PokemonDto[]> => {
  const response = await axios.get('/api/pokemon');
  return response.data;
};

const fetchTeam = async (profileName: string): Promise<TeamDto> => {
  const response = await axios.get(`/api/teams/${profileName}`);
  return addSpritesToTeam(response.data);
}

const addSpritesToTeam = async (team: TeamDto): Promise<TeamDto> => {
  const updatedTeam = { ...team };
  for (const pokemonInstance of updatedTeam.pokemonInstances) {
    const sprite = await fetchSprite(pokemonInstance.prototype.display_id);
    pokemonInstance.spriteUrl = sprite;
  }
  return updatedTeam;
}



const addPokemonToTeam = async ({ profileName, pokemonDisplayId, nickname }: { profileName: string; pokemonDisplayId: number, nickname: string }): Promise<PokemonDto> => {
  const response = await axios.post(`/api/teams/${profileName}/capture`, { pokemonDisplayId, nickname });
  return response.data;
};

const removePokemonFromTeam = async ({ profileName, pokemonInstanceId }: { profileName: string; pokemonInstanceId: number }): Promise<void> => {
  await axios.delete(`/api/teams/${profileName}/release/${pokemonInstanceId}`);
};

function TeamSelectionView() {
  const navigate = useNavigate();
  let { teamName } = useParams();
  const queryClient = useQueryClient();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDto | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSelectPokemon = (pokemon: PokemonDto) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  }

  const handleModalSubmit = () => {
    if (!team || !selectedPokemon?.display_id || !teamName) {
      setErrorMessage('Error selecting pokemon');
      return;
    }
    if ((team?.pokemonInstances?.length ?? 0) >= 6) {
      setErrorMessage('Team is full');
      return;
    }
    if (selectedPokemon) {
      capturePokemon.mutate({ profileName: teamName, pokemonDisplayId: selectedPokemon.display_id, nickname });
      setIsModalOpen(false);
      setNickname('');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNickname('');
  };

  const { data: pokemonList, error: pokemonError, isLoading: pokemonIsLoading } = useQuery<PokemonDto[]>({
    queryKey: ['pokemon'],
    queryFn: fetchPokemon,
  });

  const { data: team, error: teamError, isLoading: teamIsLoading } = useQuery<TeamDto>({
    queryKey: ['team', teamName],
    queryFn: () => fetchTeam(teamName || ''),
  });

  const capturePokemon = useMutation({
    mutationFn: addPokemonToTeam,
    onError: (error) => {
      console.error('Error adding pokemon to team:', error);
      setErrorMessage('Error adding pokemon to team');
    },
    onSuccess: () => {
      setErrorMessage('');
      queryClient.invalidateQueries({
        queryKey: ['team'],
      });
    }
  });

  const releasePokemon = useMutation({
    mutationFn: removePokemonFromTeam,
    onError: (error) => {
      console.error('Error releasing pokemon from team:', error);
      setErrorMessage('Error releasing pokemon from team');
    },
    onSuccess: () => {
      setErrorMessage('');
      queryClient.invalidateQueries({
        queryKey: ['team'],
      });
    }
  });

  const isLoading = pokemonIsLoading || teamIsLoading;
  const error = pokemonError || teamError;

  const handlePokemonClick = (pokemon: PokemonDto) => {
    console.log(`Selected pokémon: ${pokemon.name}`);
    handleSelectPokemon(pokemon);
  };

  const handleTeamClick = (dto: PokemonInstanceDto) => {
    console.log(`Team removing pokémon: ${dto.nickname || dto.prototype.name}`);

    if (!team || !dto.id || !teamName) {
      setErrorMessage('Error releasing pokemon from team');
      return;
    }

    releasePokemon.mutate({ profileName: teamName, pokemonInstanceId: dto.id });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading Pokémon</div>;

  return (
    <>
      <h1 css={headingStyle} data-testid="greeting">Team Selection - {team?.profile.username}
        <button data-testid='back-button' css={backButtonStyle} onClick={() => navigate('/')}>
          Back
        </button>
      </h1>
      {/* Team List Section */}
      <div css={containerStyle}>
        <div css={teamBarStyle}>
          <h2 data-testid='team-list'>Team List</h2>

          {team?.pokemonInstances?.length === 0 && <div css={emptyTeamMessage}>No Pokémon in team</div>}
          {team?.pokemonInstances?.map((pokemonInstance: { id: number, prototype: PokemonDto, nickname: string, captured_at: Date, teamId: number, spriteUrl?: string }, index: number) => (
            <button
              key={index}
              data-testid={`pokemon-${pokemonInstance.id}`}
              css={buttonStyle}
              onClick={() => handleTeamClick(pokemonInstance)}
            >
              {pokemonInstance.nickname || pokemonInstance.prototype.name}
              <img src={pokemonInstance.spriteUrl} alt={pokemonInstance.prototype.name} />
            </button>
          ))}
        </div>
        {errorMessage && <div css={errorStyle}>{errorMessage}</div>}

        {/* Selectable Pokémon Section */}
        <div css={pokemonGridContainerStyle}>
          <h2 data-testid='team-list'>Capturable Pokémon</h2>
          <div css={gridStyle} data-testid='selectable pokemon'>
            {pokemonList?.map((pokemon: { name: string, display_id: number, prototype_id: number }, index: number) => (
              <button
                key={index}
                data-testid={`pokemon-${pokemon.display_id}`}
                css={buttonStyle}
                onClick={() => handlePokemonClick(pokemon)}
              >
                {pokemon.name}
              </button>
            ))}
            {isModalOpen && (
              <>
                <div css={overlayStyle} onClick={handleModalClose}></div>
                <div css={modalStyle}>
                  <h2>Enter a Nickname</h2>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter nickname"
                  />
                  <button css={buttonStyle} onClick={handleModalSubmit}>
                    Submit
                  </button>
                  <button css={buttonStyle} onClick={handleModalClose}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamSelectionView;