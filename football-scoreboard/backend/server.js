const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

const matches = [
    {
        id: 1,
        homeTeam: "Manchester United",
        awayTeam: "Liverpool",
        homeScore: 0,
        awayScore: 0,
        status: "1st Half",
        minute: 0,
        competition: "Premier League",
        homeLogo: "MU",
        awayLogo: "LIV",
        goalHistory: []
    },
    {
        id: 2,
        homeTeam: "Barcelona",
        awayTeam: "Real Madrid",
        homeScore: 0,
        awayScore: 0,
        status: "Not Started",
        minute: 0,
        competition: "La Liga",
        homeLogo: "BAR",
        awayLogo: "RMA",
        goalHistory: []
    },
    {
        id: 3,
        homeTeam: "Bayern Munich",
        awayTeam: "PSG",
        homeScore: 0,
        awayScore: 0,
        status: "2nd Half",
        minute: 0,
        competition: "Champions League",
        homeLogo: "BAY",
        awayLogo: "PSG",
        goalHistory: []
    }
];

function simulateMatchEvent(match) {
    if (Math.random() < 0.3) {
        const isHomeTeam = Math.random() > 0.5;
        const scorer = isHomeTeam 
            ? ['Ronaldo', 'Rashford', 'Fernandes'][Math.floor(Math.random() * 3)]
            : ['Salah', 'Nunez', 'Jota'][Math.floor(Math.random() * 3)];
        
        if (isHomeTeam) {
            match.homeScore++;
        } else {
            match.awayScore++;
        }
        
        const goalMinute = match.status === "1st Half" ? Math.floor(Math.random() * 45) + 1 : Math.floor(Math.random() * 45) + 46;
        match.goalHistory.push({
            team: isHomeTeam ? match.homeTeam : match.awayTeam,
            scorer: scorer,
            minute: goalMinute,
            isHomeTeam: isHomeTeam
        });
        
        return {
            type: 'goal',
            matchId: match.id,
            isHomeTeam: isHomeTeam,
            scorer: scorer,
            minute: goalMinute,
            homeScore: match.homeScore,
            awayScore: match.awayScore
        };
    }
    return null;
}

function updateMatchStatus(match) {
    if (match.status === "Not Started") {
        match.status = "1st Half";
        match.minute = 1;
    } else if (match.status === "1st Half") {
        match.minute++;
        if (match.minute >= 45) match.status = "Half Time";
    } else if (match.status === "Half Time") {
        match.status = "2nd Half";
        match.minute = 46;
    } else if (match.status === "2nd Half") {
        match.minute++;
        if (match.minute >= 90) match.status = "Full Time";
    }
    
    return {
        type: 'status_update',
        matchId: match.id,
        status: match.status,
        minute: match.minute
    };
}

app.get('/events', (req, res) => {
    console.log('Client connected to SSE');
    
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
    });
    
    res.write(`event: initial\ndata: ${JSON.stringify({ matches })}\n\n`);
    
    const intervalId = setInterval(() => {
        matches.forEach(match => {
            if (match.status !== "Full Time" && match.status !== "Not Started") {
                const goalEvent = simulateMatchEvent(match);
                if (goalEvent) {
                    res.write(`event: score_update\ndata: ${JSON.stringify(goalEvent)}\n\n`);
                }
                
                const statusEvent = updateMatchStatus(match);
                res.write(`event: status_update\ndata: ${JSON.stringify(statusEvent)}\n\n`);
            }
        });
        
        res.write(`event: matches_update\ndata: ${JSON.stringify({ matches })}\n\n`);
    }, 3000 + Math.random() * 2000);
    
    req.on('close', () => {
        console.log('Client disconnected');
        clearInterval(intervalId);
        res.end();
    });
});

app.get('/api/matches', (req, res) => {
    res.json(matches);
});

app.listen(PORT, () => {
    console.log(`⚽ Backend: http://localhost:${PORT}`);
    console.log(`📡 SSE: http://localhost:${PORT}/events`);
});
