![Minipong banner](https://github.com/erwkuvi/ft_transcendence/blob/main/minipong_banner.png)

# ft-transcendence

### Live Demo
You can visit the live project [here](https://46.225.55.41) (Note: Uses self-signed certificates via mkcert; proceed via Advanced if prompted.)

## Overview
A full-stack web applicationfeaturing a real-time 3D multiplayer Pong game. This project focuses on high-security standards, real-time data synchronization, and a seamless user experience. Developed as part of the core curriculum at 42 Wolfsburg.

This project was a collaborative effort. MAssive thanks to: 
- [Lukas Kavaliauskis](https://github.com/LukasKava): 3D Pong gameplay (Three.js).
- [Karolina Kwasny](https://github.com/karolinakwasny) Deployment environment with Docker / Docker Compose, the 'Friend' service on backend and most of the Frontend UI.

---

## Technologies Used

| Layer           | Technology                   |
|-----------------|--------------------------------|
| **Backend**     | Django (REST Framework) - Python |
| **Frontend**    | React - JavaScript            |
| **Database**    | PostgreSQL                     |
| **Reverse Proxy** | Nginx                        |
| **Containers** | Docker & Docker Compose |
| **Cloud Hosting** | Hetzner Cloud (Germany) |
| **Architecture** | Dockerized Monolith |


---

## DevOps & Automation (My Core Contribution)

Beyond features, I was responsible for the System Architecture and CI/CD Pipeline.
- **Automated Deployment**: Configured **GitHub Actions** to automate the deployment process. Every push to `main` triggers an SSH-based workflow that builds and updates the project on the server.
- **Infrastructure a Code**: Managed the server environment on Hetzner Cloud (Arm64/Ampere), optimizing for price and performance in the EU region.
- **Secure Secrets Management**: Implemented a secure pipeline where production secrets are stored in GitHub Encrypted Secrets and injected into the server at runtime, ensuring no sensitive data is committed to the repository.
- **Automated SSL**: Created a Makefile orchestration system that handles SSL certificate generation via `mkcert` and configures the Nginx environment automatically.

---

![2FA Authentication](https://github.com/erwkuvi/ft_transcendence/blob/main/assets/otp-feat.gif)

## Security Features (My Core Contribution)

- **Authentication**: Integrated 42API OAuth 2.0 for secure remote login (for users with 42 Schools account).
- **Two-Factor Authentication (2FA)**: Implement TOTP (Time-based One-Time Password) compatible with Google Authenticator.
- **JWT Security**: Used JSON Web Tokens for stateless, secure session management.
- **TLS/SSL**: Configured Nginx to force HTTPS and handle encrypted traffic.

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
2. Setup environment: Create a `.secrets.dev` file based on the provided templates.
3. Launch:
```
# Bash
make up
```
The Makefile will handle the `.env` creation, volume setup, and container orchestration.

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

![42Wolfsburg](https://42wolfsburg.de/wp-content/uploads/2023/07/Warstwa_1-1.svg)



