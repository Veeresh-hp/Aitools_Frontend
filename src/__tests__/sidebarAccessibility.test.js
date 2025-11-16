// Basic keyboard navigation tests for Sidebar category dropdown
// Uses Jest + React Testing Library conventions (ensure testing libs installed).
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

describe('Sidebar accessibility', () => {
  test('opens All Tools dropdown with keyboard and navigates categories', () => {
    const { getByLabelText, queryByRole } = render(
      <Router>
        <Sidebar />
      </Router>
    );

    // Force sidebar open by hovering wrapper (simulate mouseenter)
    const allToolsButton = getByLabelText(/All Tools/i);
    fireEvent.focus(allToolsButton);
    fireEvent.keyDown(allToolsButton, { key: 'ArrowRight' });

    const menu = queryByRole('menu', { name: /tool categories/i });
    expect(menu).toBeTruthy();

    // Arrow down cycles focus
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'Home' });
    fireEvent.keyDown(window, { key: 'End' });

    // Escape closes
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(queryByRole('menu', { name: /tool categories/i })).toBeNull();
  });
});
