# AI Chatbot - Professional Assistant

A professional AI chatbot built with Next.js, TypeScript, and Tailwind CSS, powered by OpenAI's GPT-3.5-turbo model.

## Features

- 🤖 **AI-Powered Conversations**: Uses OpenAI's GPT-3.5-turbo for intelligent responses
- 💬 **Professional Chat Interface**: Clean, modern UI with message bubbles and avatars
- 🌙 **Dark Mode Support**: Automatic dark/light theme switching
- ⚡ **Real-time Messaging**: Instant message sending with typing indicators
- 🔄 **Auto-scroll**: Automatically scrolls to new messages
- 🧹 **Clear Chat**: Reset conversation with one click
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ⚠️ **Error Handling**: Graceful error handling with user-friendly messages
- 🎨 **Professional Styling**: Modern, clean design with smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd jjchatbot
```

2. Install dependencies:
```bash
npm install
```

3. The OpenAI API key is already configured in the code. If you need to change it, update the `OPENAI_API_KEY` in `/src/app/api/chat/route.ts`.

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to start chatting!

## Usage

1. **Start a Conversation**: Type your message in the input field at the bottom
2. **Send Messages**: Press Enter to send, or Shift+Enter for a new line
3. **Clear Chat**: Click the trash icon in the header to start a new conversation
4. **View History**: All messages are displayed with timestamps

## Technical Details

### Architecture

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **AI Integration**: OpenAI GPT-3.5-turbo
- **State Management**: React hooks (useState, useEffect)

### File Structure

```
src/
├── app/
│   ├── api/chat/route.ts          # OpenAI API integration
│   ├── components/
│   │   ├── ChatInterface.tsx      # Main chat component
│   │   ├── ChatMessage.tsx        # Individual message component
│   │   ├── ChatInput.tsx          # Message input component
│   │   └── LoadingSpinner.tsx     # Loading and typing indicators
│   ├── layout.tsx                 # App layout
│   └── page.tsx                   # Home page
```

### API Endpoints

- `POST /api/chat` - Send messages to OpenAI and get responses

## Customization

### Styling
The chatbot uses Tailwind CSS for styling. You can customize colors, spacing, and other design elements by modifying the className props in the components.

### AI Model
To use a different OpenAI model, update the `model` parameter in `/src/app/api/chat/route.ts`:
```typescript
model: 'gpt-4', // or any other supported model
```

### Message Limits
Adjust the `max_tokens` parameter to control response length:
```typescript
max_tokens: 1000, // Increase for longer responses
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
