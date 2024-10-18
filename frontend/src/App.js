import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'
import Main from './components/Main';
import Home from './pages/Home';
import Play from './pages/Play';
import Profile from './pages/Profile';
import About from './pages/About';
import LogIn from './pages/LogIn';
import './App.css';
import ScrollReset from './components/ScrollReset';

function App() {
	return (
		<div className="App">
			<Header />
			<Main>
				<ScrollReset>
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/play" exact component={Play} />
						<Route path="/profile" exact component={Profile} />
						<Route path="/about" exact component={About} />
						<Route path="/login" exact component={LogIn} />
					</Switch>
				</ScrollReset>
			</Main>
			<Footer />
		</div>
	);
}

export default App;
