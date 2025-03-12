class CarbonCalculator {
    constructor() {
        this.initializeData();
        this.setupEventListeners();
    }

    initializeData() {
        // Load historical data from localStorage
        this.history = JSON.parse(localStorage.getItem('carbonHistory')) || [];
    }

    setupEventListeners() {
        document.querySelector('.calculate-btn').addEventListener('click', () => this.calculateFootprint());
        
        // Tab switching logic
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e));
        });
    }

    switchTab(e) {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        e.target.classList.add('active');
        document.getElementById(e.target.dataset.tab).classList.add('active');
    }

    calculateFootprint() {
        const calculation = {
            transport: this.calculateTransport(),
            household: this.calculateHousehold(),
            food: this.calculateFood(),
            lifestyle: this.calculateLifestyle(),
            timestamp: new Date().toISOString()
        };

        calculation.total = this.calculateTotal(calculation);
        
        // Save to history
        this.history.push(calculation);
        this.saveToLocalStorage();
        
        // Update results display
        this.displayResults(calculation);
    }

    calculateTransport() {
        const carKm = parseFloat(document.getElementById('car-km').value) || 0;
        const publicTransport = parseFloat(document.getElementById('public-transport').value) || 0;
        const flights = parseFloat(document.getElementById('flights').value) || 0;
        
        return (carKm * 0.2) + (publicTransport * 0.1) + (flights * 0.9);
    }

    calculateHousehold() {
        const electricity = parseFloat(document.getElementById('electricity').value) || 0;
        const gas = parseFloat(document.getElementById('gas').value) || 0;
        const water = parseFloat(document.getElementById('water').value) || 0;
        
        return (electricity * 0.5) + (gas * 0.3) + (water * 0.1);
    }

    calculateFood() {
        const meat = parseFloat(document.getElementById('meat').value) || 0;
        const dairy = parseFloat(document.getElementById('dairy').value) || 0;
        const waste = parseFloat(document.getElementById('waste').value) || 0;
        
        return (meat * 0.7) + (dairy * 0.4) + (waste * 0.2);
    }

    calculateLifestyle() {
        const shopping = parseFloat(document.getElementById('shopping').value) || 0;
        const recycling = document.getElementById('recycling').value;
        
        let recyclingFactor = 1;
        if (recycling === 'always') recyclingFactor = 0.7;
        else if (recycling === 'sometimes') recyclingFactor = 0.85;
        
        return (shopping * 0.3) * recyclingFactor;
    }

    calculateTotal(calculation) {
        return calculation.transport + 
               calculation.household + 
               calculation.food + 
               calculation.lifestyle;
    }

    saveToLocalStorage() {
        localStorage.setItem('carbonHistory', JSON.stringify(this.history));
    }

    displayResults(calculation) {
        // Show results container
        document.querySelector('.results-container').style.display = 'block';
        
        // Update emissions values
        document.getElementById('total-emissions').textContent = calculation.total.toFixed(2);
        document.getElementById('transport-emissions').textContent = calculation.transport.toFixed(2);
        document.getElementById('home-emissions').textContent = calculation.household.toFixed(2);
        document.getElementById('food-emissions').textContent = calculation.food.toFixed(2);
        document.getElementById('lifestyle-emissions').textContent = calculation.lifestyle.toFixed(2);
        
        // Generate and display recommendations
        this.displayRecommendations(calculation);
        this.displayConclusions(calculation);
    }

    displayRecommendations(calculation) {
        const recommendationsList = document.getElementById('recommendations-list');
        const recommendations = this.generateRecommendations(calculation);
        
        recommendationsList.innerHTML = recommendations
            .map(rec => `<li>${rec}</li>`)
            .join('');
    }

    generateRecommendations(calculation) {
        const recommendations = [];
        
        if (calculation.transport > 5) {
            recommendations.push('Consider using public transportation or carpooling to reduce your transport emissions.');
        }
        
        if (calculation.household > 4) {
            recommendations.push('Install energy-efficient appliances and LED bulbs to reduce household emissions.');
        }
        
        if (calculation.food > 3) {
            recommendations.push('Try incorporating more plant-based meals into your diet.');
        }
        
        if (calculation.lifestyle > 2) {
            recommendations.push('Focus on reducing single-use items and choosing sustainable products.');
        }
        
        return recommendations;
    }

    displayConclusions(calculation) {
        const conclusionElement = document.getElementById('conclusionCards');
        const conclusions = this.generateConclusions(calculation);
        
        conclusionElement.innerHTML = conclusions
            .map(conclusion => `<div class="conclusion-card"><h5>${conclusion.title}</h5><p>${conclusion.description}</p></div>`)
            .join('');
    }

    generateConclusions(calculation) {
        const conclusions = [];
        let conclusionText = '';

        if (calculation.total < 5) {
            conclusionText = "Great job! Your carbon footprint is impressively low. This indicates that you are making sustainable choices in your daily life. Keep up the good work and continue to promote eco-friendly practices!";
            conclusions.push({
                title: 'Excellent Performance!',
                description: conclusionText
            });
        } else if (calculation.total < 10) {
            conclusionText = "Good effort! Your carbon footprint is moderate, suggesting that while you are making some sustainable choices, there is still room for improvement. Consider adopting more eco-friendly habits to further reduce your impact.";
            conclusions.push({
                title: 'Good Effort!',
                description: conclusionText
            });
        } else {
            conclusionText = "Needs improvement. Your carbon footprint is higher than average, indicating that there are significant opportunities to reduce your emissions. Focus on areas such as transportation and energy consumption to make a positive change.";
            conclusions.push({
                title: 'Needs Improvement',
                description: conclusionText
            });
        }

        return conclusions;
    }
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    window.carbonCalculator = new CarbonCalculator();
});