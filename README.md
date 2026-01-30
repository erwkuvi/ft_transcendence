![Minipong banner](https://github.com/erwkuvi/ft_transcendence/blob/main/minipong_banner.png)

# ft-transcendence

### Live Demo
You can visit the live project [here](https://46.225.55.41) 🚀 (Note: Uses self-signed certificates via mkcert; proceed via Advanced if prompted.)

## Overview
A full-stack web application featuring a real-time 3D multiplayer Pong game. This project focuses on high-security standards, real-time data synchronization, and a seamless user experience. Developed as part of the core curriculum at 42 Wolfsburg.

This project was a collaborative effort. Massive thanks to: 
- [Lukas Kavaliauskis](https://github.com/LukasKava): 3D Pong gameplay (Three.JS).
- [Karolina Kwasny](https://github.com/karolinakwasny) Deployment environment with Docker / Docker Compose, the 'Friend' service on backend and most of the Frontend UI.

---

## Technologies Used

| Layer           | Technology                   |
|-----------------|--------------------------------|
| **Backend**     | Django (REST Framework) - Python |
| **Frontend**    | React - JavaScript            |
| **Database**    | PostgreSQL                     |
| **Reverse Proxy** | NGINX                        |
| **Containers** | Docker & Docker Compose |
| **Cloud Hosting** | Hetzner Cloud (Germany) |
| **Architecture** | Dockerized Monolith |


---

## DevOps & Automation (My Core Contribution)

Beyond features, I was responsible for the System Architecture and CI/CD Pipeline.
- **Automated Deployment**: Configured **GitHub Actions** to automate the deployment process. Every push to `main` triggers an SSH-based workflow that builds and updates the project on the server.
- **Infrastructure a Code**: Managed the server environment on Hetzner Cloud (Arm64/Ampere), optimizing for price and performance in the EU region.
- **Secure Secrets Management**: Implemented a secure pipeline where production secrets are stored in GitHub Encrypted Secrets and injected into the server at runtime, ensuring no sensitive data is committed to the repository.
- **Automated SSL**: Created a Makefile orchestration system that handles SSL certificate generation via `mkcert` and configures the NGINX environment automatically.

---

![2FA Authentication](https://github.com/erwkuvi/ft_transcendence/blob/main/assets/otp-feat.gif)

## Security Features (My Core Contribution)

- **Authentication**: Integrated 42API OAuth 2.0 for secure remote login (for users with 42 Schools account).
- **Two-Factor Authentication (2FA)**: Implement TOTP (Time-based One-Time Password) compatible with Google Authenticator.
- **JWT Security**: Used JSON Web Tokens for stateless, secure session management.
- **TLS/SSL**: Configured NGINX to force HTTPS and handle encrypted traffic.

![Remote Authentication](https://github.com/erwkuvi/ft_transcendence/blob/main/assets/remote-auth.gif)

---

## Local Development

To run this project locally, you only need Docker.

1. Clone the repository:
```
# Bash
git clone git@github.com:erwkuvi/ft_transcendence.git
cd ft_transcendence
```
2. Setup environment: Create a `.secrets.dev` file based on the provided templates (secrets_template.txt).
3. Launch:
```
# Bash
make up
```
The Makefile will handle the `.env` creation, volume setup, and container orchestration.
You should be able to see the project as development at: http://localhost:8081. Make sure you have this port unused.

---

## Key Features

### User Management & Social

![Signup](https://github.com/erwkuvi/ft_transcendence/blob/main/assets/signup-login.gif)

- **Profile Customization**: Upload avatars and change display names for tournaments.
- **Social Graph**: Add friends and track their real-time online/offline status.
- **Stats Dashboard**: Comprehensive match history with win/loss ratios.

![Update information](https://github.com/erwkuvi/ft_transcendence/blob/main/assets/update-feat.gif)

---

### Advanced 3D Gameplay

- Built with **Three.js** for an immersive 3D Pong experience.
- Multiple map selections and customizable game settings.

![3D Feature](https://github.com/erwkuvi/ft_transcendence/blob/main/assets/3d-techniques.gif)

---

![Multiple language support](https://github.com/erwkuvi/ft_transcendence/blob/main/assets/language.gif)

### Accessibility & Internatinalization

- **Multi-language**: Support for 4 languages with persistent user preferences.
- **Inclusivity**: Fully accessible via keyboard navigation. ARIA labels, and high-contrast modes for visually impaired users.

![Accessibility](https://github.com/erwkuvi/ft_transcendence/blob/main/assets/accessibility.gif)

---

### Responsive Design

- The website is fully responsive, adapting to different screen sizes and orientations.
- Ensures a consistent user experience on desktops, laptops, tablets, and smartphones.

![Responsiveness](https://github.com/erwkuvi/ft_transcendence/blob/main/assets/responsiveness.gif)

---

### Troubleshooting & FAQ

1. SSL/Privacy Warning in Browser
Since this project uses `mkcert` to generate locally-trusted certificates for development and demonstration, your browser may show a "Your connection is not private" warning.

**Solution**: Click on Advanced -> Proceed to [IP/localhost]. In a production environment with a registered domain, this would be replaced by a CA-signed certificate from Let's Encrypt.

2. Port Conflicts
If you cannot start the containers because a port is already in use (e.g., 8081, 8000, or 5432):

**Solution**: Identify the process using the port with sudo lsof -i :PORT and stop it, or change the port mapping in docker-compose.yml.

3. "Exec format error" (Architecture Mismatch)
If you are trying to run this on an x86 machine but the Makefile is configured for Arm64 (or vice versa):

**Solution**: Ensure your mkcert binary and Docker base images match your host architecture. The project is currently optimized for Arm64 (Apple Silicon / Hetzner Ampere).

4. Database Connection Issues
If the backend fails to connect to PostgreSQL on the first boot:

**Solution**: The database might still be initializing. Run make down and then make up again. The Docker Compose health checks are designed to mitigate this, but external network latency can occasionally interfere.

5. Cleaning the Environment
If you want to completely reset the project, including database volumes and images:

**Command**: `make prune`

**Warning**: This will delete all user data and uploaded avatars.

---

![42Wolfsburg](https://42wolfsburg.de/wp-content/uploads/2023/07/Warstwa_1-1.svg)



