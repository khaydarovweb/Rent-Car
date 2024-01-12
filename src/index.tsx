import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { default as Users } from "./pages/reducer";

import './assets/style.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <Users />
  </StrictMode>
);