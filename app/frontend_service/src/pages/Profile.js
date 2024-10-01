import React from 'react';
import './Profile.css';

const Profile = () => {
	return (
		<div className="page-content">
			<h1>PROFILE</h1>
			<div className='container-fluid cards mt-4'>
				<div className='card basic'>
					<h2>Basic Information</h2>
					<img src={require('../assets/blank.png')} className='profilepic m-2' width='200' height='200' alt='profile'/>
					<p>Username: <span>johnsmith11</span></p>
					<p>Email: <span>johnsmith11@mail.com</span></p>
				</div>
				<div className='card basic'>
					<h2>Stats</h2>
					<p>Games played: <span>0</span></p>
					<p>Wins: <span>0</span></p>
				</div>
				<div className='card basic'>
					<h2>Friends list</h2>
					<h4>Online</h4>
					<p>John</p>
					<h4>Offline</h4>
					<p>John</p>
				</div>
			</div>
		</div>
	);
};

export default Profile;
