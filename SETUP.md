# 🚀 Setup Instructions - RepurposeIQ

## Quick Start

1. **Install Dependencies:**
   ```bash
   cd pharma-nodejs
   npm run install-all
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your GROQ_API_KEY
   ```

3. **Initialize Database:**
   ```bash
   node server/database/init.js
   ```

4. **Start Development:**
   ```bash
   npm run dev
   ```

5. **Access Application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Features Implemented

✅ **Backend (Express.js)**
- Authentication (JWT)
- Multi-agent system
- Groq API integration
- Database (SQLite)
- File upload (images, documents)
- Report generation (PDF/Excel)
- RESTful API

✅ **Frontend (React + Vite)**
- Modern UI with Tailwind CSS
- Multiple fonts (Inter, Poppins, Roboto, Montserrat, Raleway, Playfair, Lora)
- Animations (Framer Motion)
- Responsive design
- Voice input (ready)
- Image upload (ready)
- File upload (ready)

## Next Steps

The project structure is complete. You can now:
1. Install dependencies
2. Add your API keys
3. Run the application
4. Customize and extend features

## Notes

- Voice input requires browser microphone permissions
- Image analysis uses basic processing (can be enhanced with vision APIs)
- All original Python features have been ported to Node.js

