import React from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import { Dashboard } from './components/Dashboard';
import { QuestBoard } from './components/QuestBoard';
import { AdminSetup } from './components/AdminSetup';

const HomeQuestApp: React.FC = () => {
  const { currentUser, isAdminSetup } = useGame();

  if (!isAdminSetup) {
    return <AdminSetup />;
  }

  return (
    <>
      {!currentUser ? <Dashboard /> : <QuestBoard />}
    </>
  );
};

function App() {
  return (
    <GameProvider>
      <HomeQuestApp />
    </GameProvider>
  );
}

export default App;
