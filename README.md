# 🚀 RePurpose AI | Content Engine Pro

RePurpose AI is a high-performance, full-stack content strategy engine designed to help creators "10x" their output. It transforms a single idea into a complete, optimized content strategy for YouTube, TikTok, Instagram, LinkedIn, and Twitter simultaneously.

![UI Preview](https://raw.githubusercontent.com/Vivek-Ghanwat/repurpose-ai-pro/main/preview.png) *(Add a screenshot here!)*

## ✨ Key Features

*   **💎 Premium Glassmorphism UI:** A sleek, modern interface with interactive background blobs and a smooth dark/light mode.
*   **🌐 Omni-Channel Generator:** Generate unique strategies for 5 social platforms at once from a single input.
*   **🔥 Viral Predictor AI:** Every generation includes a 1-100 Virality Score and detailed reasoning based on current social media algorithms.
*   **🎨 Live AI Image Generation:** Integrated with Pollinations.ai to instantly render high-quality images for your Instagram and LinkedIn posts.
*   **⚙️ Global Brand Profile:** Define your brand name, audience, and tone once. The AI automatically adapts all future content to your brand voice.
*   **🪄 AI Refinement Tool:** Use the "Magic Wand" to instantly rewrite any specific headline or caption with custom instructions.
*   **📄 Pro Exports:** One-click export to PDF and CSV for professional strategy documentation.

## 🛠️ Tech Stack

*   **Frontend:** Vanilla JavaScript, HTML5, CSS3 (Custom Glassmorphism system)
*   **Backend:** Node.js, Express
*   **AI Engine:** Google Gemini 2.5 Flash API
*   **Image Gen:** Pollinations.ai (Free open-source API)
*   **Storage:** Browser LocalStorage (for History & Brand Profiles)

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   A Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Vivek-Ghanwat/repurpose-ai-pro.git
   cd repurpose-ai-pro
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   *   Create a `.env` file in the root directory.
   *   Add your API key:
     ```env
     API_KEY=your_gemini_api_key_here
     ```
4. Start the server:
   ```bash
   node server.js
   ```
5. Open your browser to `http://localhost:8080`.

## ☁️ Deployment

### Google Cloud (App Engine / Cloud Run)
1. Deploy the code to Google Cloud.
2. In the Google Cloud Console, navigate to your app's **Environment Variables**.
3. Add a variable named `API_KEY` and paste your key.

---

Built with ❤️ for the next generation of content creators.
