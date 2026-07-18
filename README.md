<div align="center">
  <h1>🚗 LuxeWay</h1>
  <p><strong>Trusted E-commerce Platform for Vehicle Rental</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot" alt="Spring Boot" />
    <img src="https://img.shields.io/badge/SQL_Server-CC292B?style=for-the-badge&logo=microsoft-sql-server&logoColor=white" alt="SQL Server" />
  </p>
</div>

---

## 👨‍💻 Author

| Name | GitHub Username | Role |
| :--- | :--- | :--- |
| **Nguyễn Văn Dạng** | [@Nguyendang2005](https://github.com/Nguyendang2005) | **Sole Developer & Creator** |

> **Note:** This project was developed entirely by Nguyễn Văn Dạng as a comprehensive e-commerce platform.

---

## 🚀 About LuxeWay

LuxeWay is a modern, secure, and highly efficient e-commerce platform dedicated to vehicle rental. It provides a seamless experience for customers looking to rent vehicles, owners managing their fleets, and administrators overseeing the platform.

### ✨ Key Features
- Comprehensive vehicle listing and search
- Secure booking and payment workflows
- Role-based access control (Admin, Owner, Customer)
- Real-time status updates

---

## 🛠 Tech Stack

- **Frontend:** React.js, TypeScript, Vite, Tailwind CSS
- **Backend:** Java 17, Spring Boot, Maven
- **Database:** Microsoft SQL Server
- **Security:** JWT Authentication, BCrypt Password Hashing

---

## 🔐 Security Configuration

**⚠️ Environment Variables Required**

This project uses strict environment variables for security. Before starting:

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```
2. **Generate a JWT secret** (e.g., using `openssl rand -base64 32`).
3. **Configure your `.env`** with your specific database and JWT credentials.

*For detailed security workflows, see:*
- `QUICK-SECURITY-FIX-REFERENCE.md`
- `SECURITY-SETUP-GUIDE.md`
- `BUG-FIXES-SUMMARY.md`

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+ & npm
- Java 17+
- Microsoft SQL Server

### 1️⃣ Frontend Setup

```bash
cd src/Front_end
npm install
npm run dev
```
**Frontend URL**: [http://localhost:5173/](http://localhost:5173/)

### 2️⃣ Backend Setup

**Using IDE (Recommended):**
1. Open IntelliJ IDEA or Eclipse.
2. Import Maven project from `src/Back_end`.
3. Run `LuxewayBackendApplication.java`.

**Using Maven:**
```bash
cd src/Back_end
mvn spring-boot:run
```
**Backend API**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)

### 3️⃣ Database Initialization
Execute the `src/Back_end/import-data.sql` script in SQL Server Management Studio to populate the initial schema and sample data.

### 🧪 Test Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@luxeway.vn | `password` |
| **Customer** | nguyen.van.a@gmail.com | `password` |
| **Owner** | pham.minh.d@gmail.com | `password` |

---

## 📖 Documentation & Important Links

- 📚 **Full Setup Guide:** [START-PROJECT.md](START-PROJECT.md)
- 🌐 **Frontend App:** http://localhost:5173/
- 🧪 **Backend Test Page:** http://localhost:5173/test-backend
- 🩺 **API Health Check:** http://localhost:8080/api/v1/test/health
- 📑 **Swagger API Docs:** http://localhost:8080/api/v1/swagger-ui.html

---

<div align="center">
  <i>Developed with ❤️ by Nguyễn Văn Dạng</i>
</div>
