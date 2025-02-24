import React from 'react';
import ReactDOM from 'react-dom/client'; 
import { BrowserRouter } from 'react-router-dom';
import { ErrorHandlerProvider } from './context/ErrorHandlerContext';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';
import './components/Scrollbar.css';
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<BrowserRouter>
		<ErrorHandlerProvider>
			<AuthProvider>
				<App />
			</AuthProvider>
		</ErrorHandlerProvider>
	</BrowserRouter>
)
