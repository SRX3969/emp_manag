import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConvexProvider } from 'convex/react';
import { convex } from '@/lib/convex';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { AppRoutes } from '@/routes/AppRoutes';

export function App() {
  return (
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>
              <AppRoutes />
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ConvexProvider>
  );
}

export default App;
