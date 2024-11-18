import React from 'react';

const About = () => {
	return (
		<div className="page-content">
			<h1>about</h1>
			<div>
				<p>
					This website is the final task of the common core of 42 school, ft_transcendence.
					It is built using HTML/CSS, Bootstrap, React, Django, and PostgreSQL.
				</p>
				<p>The source code for this website is available on&nbsp;
					<a href="https://github.com/LukasKava/ft_transcendence" className="footer-link"
					target="_blank" rel="noopener noreferrer">Github</a>.
				</p>
			</div>
		</div>
	);
};

export default About;
