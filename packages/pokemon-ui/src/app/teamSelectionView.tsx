import { useParams } from 'react-router-dom';

function TeamSelectionView(){

  let { team } = useParams();
  //  let data = useFakeDataLibrary(`/api/v2/teams/${team}`);


  const handlePokemonClick = (profile: string) => {
    console.log(`Selected pokemon: ${profile}`);
    // Future implementation: navigate to the selected profile's view
  };

  return (
    <>
        <title>Team Selection</title>
    </>
  );
};

export default TeamSelectionView;