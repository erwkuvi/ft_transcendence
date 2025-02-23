import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './components/Scrollbar.css';
import './i18n';
import { AuthProvider } from './context/AuthContext';
import { ErrorHandlerProvider } from './context/ErrorHandlerContext';

const root = createRoot(document.getElementById('root'));

root.render(
	<BrowserRouter>
		<ErrorHandlerProvider>
			<AuthProvider>
				<App />
			</AuthProvider>
		</ErrorHandlerProvider>
	</BrowserRouter>
)
