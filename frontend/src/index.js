import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './components/Scrollbar.css';
import './i18n';
import { AuthProvider } from './context/AuthContext';

const root = createRoot(document.getElementById('root'));

root.render(
	<AuthProvider>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</AuthProvider>
)
