import React from 'react';
import { Outlet } from '@remix-run/react';

const App = () => {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
};

export default App;