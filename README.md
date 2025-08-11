# Amatech Learning Hub - AmaLearn

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge)](https://amatech.nurenijamiu.tech)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

**A comprehensive learning management system developed for the Association of Management Technology Students (AMATECH) at Lagos State University. This platform was created by the department's student president to address the challenge of scattered learning resources and enhance the educational experience for Project Management Technology students.**

*Empowering Future Project Managers*

</div>

## 🖼️ Project Preview

![Amalearn Homepage](./public/images/homepage.png)

## 🎯 Mission

Built to centralize academic resources and provide Project Management Technology students with seamless access to course materials, past questions, expert tutoring, and AI-powered learning assistance - all in one unified platform.

## 🚀 Features

### Core Features
- **User Authentication**: Secure JWT-based authentication system
- **Course Management**: Comprehensive course catalog with materials and resources
- **PDF Viewer**: In-app PDF viewing for course materials and past questions
- **Timetable Management**: Personal and course-specific scheduling
- **File Uploads**: Cloudinary integration for media management
- **Admin Panel**: Complete administrative interface for content management

### AI & Advanced Features
- **RAG (Retrieval Augmented Generation)**: AI-powered document search and Q&A
- **Vector Database**: Pinecone integration for semantic search
- **Smart Caching**: Optimized performance with React Query
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.3.1 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.1.5
- **Components**: Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (Custom implementation)
- **File Storage**: Cloudinary
- **Vector Database**: Pinecone
- **AI**: OpenAI & LangChain

### Development Tools
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Database Migrations**: Prisma

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database
- Git

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NureniJamiu/amatech-learning-hub.git
   cd amatech-learning-hub
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/amatech_learning_hub"
   DIRECT_URL="postgresql://username:password@localhost:5432/amatech_learning_hub"

   # JWT Secret (generate a secure random string)
   JWT_SECRET="your-super-secure-jwt-secret-key"

   # Cloudinary (for file uploads)
   CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
   CLOUDINARY_API_KEY="your-cloudinary-api-key"
   CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

   # OpenAI (for AI features)
   OPENAI_API_KEY="your-openai-api-key"

   # Pinecone (for vector database)
   PINECONE_API_KEY="your-pinecone-api-key"
   PINECONE_ENVIRONMENT="your-pinecone-environment"
   PINECONE_INDEX_NAME="your-pinecone-index-name"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   pnpm prisma generate

   # Run database migrations
   pnpm prisma migrate deploy

   # Seed the database (optional)
   pnpm run seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (public)/          # Public pages
│   ├── api/               # API routes
│   └── dashboard/         # Protected dashboard pages
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   └── admin/            # Admin-specific components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and configurations
├── middleware/           # Custom middleware
├── providers/            # Global providers
├── store/                # State management
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

2. **Configure environment variables** in the Vercel dashboard

3. **Set up database** (recommended: Railway, Supabase, or Neon)

### Alternative Deployment Options

- **Docker**: Dockerfiles can be added for containerized deployment
- **Railway**: Direct deployment with PostgreSQL
- **Netlify**: With serverless functions

## 🔧 Configuration

### Database Configuration
The application uses Prisma ORM with PostgreSQL. Configure your database connection in the `.env` file.

### AI Features Setup
To enable AI features:
1. Set up an OpenAI account and get your API key
2. Create a Pinecone account for vector database
3. Configure the environment variables accordingly

### File Upload Setup
Configure Cloudinary for handling file uploads:
1. Create a Cloudinary account
2. Get your cloud name, API key, and secret
3. Add them to your environment variables

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/signup` - User registration

### Course Endpoints
- `GET /api/v1/courses` - Get all courses
- `GET /api/v1/courses/[id]` - Get course by ID
- `POST /api/v1/courses` - Create course (Admin only)

### RAG Endpoints
- `POST /api/v1/rag/query` - AI-powered document query
- `POST /api/v1/rag/process` - Process documents for RAG

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate test coverage
pnpm test:coverage
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the documentation** in this README
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Contact the development team**

## 🙏 Acknowledgments

- **Lagos State University** - For providing the educational foundation
- **AMATECH Department** - Association of Management Technology Students
- **Student Community** - For their valuable feedback and support
- [Next.js](https://nextjs.org/) - The React framework
- [Prisma](https://www.prisma.io/) - Database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [OpenAI](https://openai.com/) - AI capabilities
- [Pinecone](https://www.pinecone.io/) - Vector database
- [Cloudinary](https://cloudinary.com/) - Media management

---

**Built with ❤️ for AMATECH students by the Student President and Development Team**
*Empowering Project Management Technology education at Lagos State University*
