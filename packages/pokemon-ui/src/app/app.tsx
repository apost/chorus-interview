import styled from '@emotion/styled';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProfileSelectionView from './profileSelectionView';
import TeamSelectionView from './teamSelectionView';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProfileSelectionView />} />
        <Route path="/team/:team" element={<TeamSelectionView />} />
      </Routes>
    </Router>
  );
}

export default App;
