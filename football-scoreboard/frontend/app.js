class FootballScoreboard {
    constructor() {
        this.matches = new Map();
        this.eventSource = null;
        this.updateCount = 0;
        
        this.matchesContainer = document.getElementById('matchesContainer');
        this.eventsList = document.getElementById('eventsList');
        this.connectionStatus = document.getElementById('connectionStatus');
        this.updateCountElement = document.getElementById('updateCount');
        this.currentTimeElement = document.getElementById('currentTime');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.addGoalBtn = document.getElementById('addGoalBtn');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.connectToSSE();
        this.startClock();
    }
    
    setupEventListeners() {
        this.refreshBtn.addEventListener('click', () => this.refreshMatches());
        this.addGoalBtn.addEventListener('click', () => this.simulateGoal());
    }
    
    connectToSSE() {
        if (this.eventSource) {
            this.eventSource.close();
        }
        
        this.eventSource = new EventSource('http://localhost:3000/events');
        
        this.eventSource.onopen = () => {
            this.updateConnectionStatus(true);
            this.addEvent('Connected to server', 'info');
        };
        
        this.eventSource.onerror = (error) => {
            this.updateConnectionStatus(false);
            setTimeout(() => this.connectToSSE(), 5000);
        };
        
        this.eventSource.addEventListener('initial', (event) => {
            const data = JSON.parse(event.data);
            this.initializeMatches(data.matches);
        });
        
        this.eventSource.addEventListener('score_update', (event) => {
            const data = JSON.parse(event.data);
            this.handleScoreUpdate(data);
        });
        
        this.eventSource.addEventListener('status_update', (event) => {
            const data = JSON.parse(event.data);
            this.handleStatusUpdate(data);
        });
        
        this.eventSource.addEventListener('matches_update', (event) => {
            const data = JSON.parse(event.data);
            this.updateAllMatches(data.matches);
        });
    }
    
    updateConnectionStatus(connected) {
        const statusDot = this.connectionStatus.querySelector('.status-dot');
        const statusText = this.connectionStatus.querySelector('span:last-child');
        
        if (connected) {
            statusDot.classList.add('connected');
            statusText.textContent = 'Connected';
        } else {
            statusDot.classList.remove('connected');
            statusText.textContent = 'Disconnected';
        }
    }
    
    initializeMatches(matchesData) {
        matchesData.forEach(match => {
            this.matches.set(match.id, match);
            this.renderMatch(match);
        });
    }
    
    renderMatch(match) {
        const template = document.getElementById('matchTemplate');
        const matchElement = template.content.cloneNode(true);
        const card = matchElement.querySelector('.match-card');
        card.id = `match-${match.id}`;
        
        card.querySelector('.competition').textContent = match.competition;
        card.querySelector('.status-text').textContent = match.status;
        card.querySelector('.match-minute').textContent = match.minute + "'";
        
        card.querySelector('.home-team .team-name').textContent = match.homeTeam;
        card.querySelector('.home-team .team-logo').textContent = match.homeLogo;
        card.querySelector('.home-score').textContent = match.homeScore;
        
        card.querySelector('.away-team .team-name').textContent = match.awayTeam;
        card.querySelector('.away-team .team-logo').textContent = match.awayLogo;
        card.querySelector('.away-score').textContent = match.awayScore;
        
        this.updateGoalTimeline(card, match.goalHistory);
        
        this.matchesContainer.appendChild(matchElement);
    }
    
    updateAllMatches(matchesData) {
        matchesData.forEach(match => {
            this.matches.set(match.id, match);
            this.updateMatchUI(match);
        });
    }
    
    updateMatchUI(match) {
        const matchElement = document.getElementById(`match-${match.id}`);
        if (!matchElement) return;
        
        matchElement.querySelector('.status-text').textContent = match.status;
        matchElement.querySelector('.match-minute').textContent = match.minute + "'";
        
        const homeScore = matchElement.querySelector('.home-score');
        const awayScore = matchElement.querySelector('.away-score');
        
        if (parseInt(homeScore.textContent) !== match.homeScore) {
            homeScore.textContent = match.homeScore;
            homeScore.classList.add('score-update');
            setTimeout(() => homeScore.classList.remove('score-update'), 500);
        }
        
        if (parseInt(awayScore.textContent) !== match.awayScore) {
            awayScore.textContent = match.awayScore;
            awayScore.classList.add('score-update');
            setTimeout(() => awayScore.classList.remove('score-update'), 500);
        }
        
        this.updateGoalTimeline(matchElement, match.goalHistory);
    }
    
    updateGoalTimeline(matchElement, goalHistory) {
        const timeline = matchElement.querySelector('.timeline-content');
        
        if (goalHistory.length === 0) {
            timeline.innerHTML = '<div class="no-goals">No goals yet</div>';
            return;
        }
        
        timeline.innerHTML = '';
        goalHistory.slice(-3).forEach(goal => {
            const goalEvent = document.createElement('div');
            goalEvent.className = `goal-event ${goal.isHomeTeam ? 'home-goal' : 'away-goal'}`;
            goalEvent.innerHTML = `
                <span>${goal.scorer}</span>
                <span>${goal.minute}'</span>
            `;
            timeline.appendChild(goalEvent);
        });
    }
    
    handleScoreUpdate(data) {
        this.addEvent(`${data.scorer} scored! ${data.homeScore}-${data.awayScore}`, 'goal');
        this.updateCount++;
        this.updateCountElement.textContent = this.updateCount;
    }
    
    handleStatusUpdate(data) {
        const match = this.matches.get(data.matchId);
        if (match) {
            match.status = data.status;
            match.minute = data.minute;
            this.updateMatchUI(match);
        }
    }
    
    addEvent(message, type = 'info') {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
            <i class="fas fa-${type === 'goal' ? 'futbol' : 'info-circle'}"></i>
            <span>${new Date().toLocaleTimeString()} - ${message}</span>
        `;
        
        this.eventsList.prepend(eventItem);
        
        if (this.eventsList.children.length > 10) {
            this.eventsList.removeChild(this.eventsList.lastChild);
        }
    }
    
    refreshMatches() {
        fetch('http://localhost:3000/api/matches')
            .then(response => response.json())
            .then(matches => {
                this.updateAllMatches(matches);
                this.addEvent('Matches refreshed', 'info');
            });
    }
    
    simulateGoal() {
        const matchIds = Array.from(this.matches.keys());
        if (matchIds.length === 0) return;
        
        const randomMatchId = matchIds[Math.floor(Math.random() * matchIds.length)];
        const match = this.matches.get(randomMatchId);
        
        if (match && match.status !== "Full Time") {
            const isHomeTeam = Math.random() > 0.5;
            const scorers = isHomeTeam 
                ? ['Ronaldo', 'Rashford', 'Fernandes']
                : ['Salah', 'Nunez', 'Jota'];
            const scorer = scorers[Math.floor(Math.random() * scorers.length)];
            
            if (isHomeTeam) {
                match.homeScore++;
            } else {
                match.awayScore++;
            }
            
            const minute = Math.floor(Math.random() * 90) + 1;
            match.goalHistory.push({
                team: isHomeTeam ? match.homeTeam : match.awayTeam,
                scorer: scorer,
                minute: minute,
                isHomeTeam: isHomeTeam
            });
            
            this.updateMatchUI(match);
            this.addEvent(`[Manual] ${scorer} scored for ${isHomeTeam ? match.homeTeam : match.awayTeam}!`, 'goal');
            this.updateCount++;
            this.updateCountElement.textContent = this.updateCount;
        }
    }
    
    startClock() {
        setInterval(() => {
            const now = new Date();
            this.currentTimeElement.textContent = now.toLocaleTimeString();
        }, 1000);
    }
}

// Start the scoreboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new FootballScoreboard();
});
