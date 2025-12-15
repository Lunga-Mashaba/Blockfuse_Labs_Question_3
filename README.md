⚽ Live Football Scoreboard

A real-time football match scoreboard that updates scores automatically using Server-Sent Events (SSE).

📋 Features

Real-time Updates: Scores update every 3-5 seconds automatically
Multiple Matches: Display 3 concurrent football matches
Live Indicators: Visual cues for live matches and recent goals
Score History: Track goal history for each match
Responsive Design: Works on desktop, tablet, and mobile
Server-Sent Events (SSE): Efficient real-time communication
Mock Backend: Simulates real football match events

🏗️ Project Structure

football-scoreboard/
├── backend/
│   ├── server.js              # Node.js backend with SSE
│   └── package.json          # Backend dependencies
├── frontend/
│   ├── index.html            # Main web interface
│   ├── style.css             # Styling
│   ├── app.js                # Frontend logic
│   └── README.md             # This file
└── README.md                 # Root README
🚀 Quick Start

Prerequisites

Node.js 
Modern web browser
Installation

Clone and navigate to project:
bash
git clone https://github.com/Lunga-Mashaba/Blockfuse_Labs_Question_3.git
cd football-scoreboard

Set up backend:
bash
cd backend
npm install

Start the backend server:
node server.js
The backend will run on http://localhost:3000

Open the frontend:
Open frontend/index.html in your browser
Or use Live Server in VS Code
Or run a simple HTTP server:

🎮 How to Use

Open the web interface in your browser
You'll see 3 football matches with live scores
Scores update automatically every 3-5 seconds

Watch for:

Score changes (indicated by flashing animation)
Goal indicators next to teams
Match status (1st Half, 2nd Half, Finished)
Goal history in the timeline
🏆 Featured Matches

The scoreboard displays 3 live matches:

Premier League: Manchester United vs Liverpool
La Liga: Barcelona vs Real Madrid
Champions League: Bayern Munich vs PSG
🔧 Technical Implementation

Backend (Node.js with SSE)

Key Features:

Simulates realistic football match events
Random score updates every 3-5 seconds
Maintains match state and statistics
Provides SSE endpoint at /events

Event Types:

score_update: When a team scores
match_status: When match period changes
match_start: When a new match begins
Frontend (Vanilla JavaScript)

Features:

Listens to SSE events from backend
Updates UI in real-time without page refresh
Smooth animations for score changes
Responsive design using CSS Grid/Flexbox
Error handling and reconnection logic

Communication Flow:

Frontend (Browser)
        ↓
   HTTP GET /events
        ↓
Backend (Node.js SSE)
        ↓
  Event Stream (text/event-stream)
        ↓
  Real-time Score Updates
  
📱 Web Interface Components

Match Cards: Individual match display with team logos
Score Display: Large, clear score numbers
Live Indicator: Red dot showing active matches
Match Status: Current minute and half
Goal Timeline: History of when goals were scored
Controls: Manual refresh and connection status

🧪 Testing

Test Backend SSE Endpoint:

bash
# Using curl to test SSE
curl -N http://localhost:3000/events

Manual Testing:

Open browser console (F12)
Check Network tab for SSE connection
Verify events are received every 3-5 seconds
Test reconnection by stopping/starting backend

🔄 Real-time Updates

The system simulates realistic football events:

Goal Probability: Higher chance of goals in 2nd half
Yellow/Red Cards: Random disciplinary events
Match Progression: Time increases realistically
Match End: Automatically finishes after 90+ minutes

🎨 Styling Features

Team Colors: Each team has representative colors
Goal Animation: Flashing effect when score changes
Live Status: Visual indicators for active matches
Card Design: Clean, modern match cards
Dark/Light: Adapts to system preferences

⚡ Performance Optimizations

Efficient Updates: Only updates changed elements
Debounced Events: Prevents rapid UI updates
Connection Management: Auto-reconnects if disconnected
Memory Efficient: No memory leaks with proper cleanup
Lightweight: No external dependencies in frontend

🔌 API Reference

SSE Endpoint

text
GET http://localhost:3000/events
Response Format:

javascript
event: score_update
data: {
  matchId: 1,
  homeScore: 2,
  awayScore: 1,
  scorer: "Player Name",
  minute: 45,
  isHomeTeam: true
}

Event Types:

score_update: Score changed
match_status: Match time/status changed
match_start: New match data
connection_info: Connection established



