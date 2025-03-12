class Dashboard {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('carbonHistory')) || [];
        this.initializeCharts();
        this.updateDashboard();
    }

    initializeCharts() {
        this.createTrendChart();
        this.createCategoryChart();
    }

    createTrendChart() {
        const ctx = document.getElementById('trendChart').getContext('2d');
        const data = this.prepareTrendData();
        
        this.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Total Emissions',
                    data: data.values,
                    borderColor: '#2ecc71',
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'CO2 Emissions (tonnes)'
                        }
                    }
                }
            }
        });
    }

    createCategoryChart() {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        const data = this.prepareCategoryData();
        
        this.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Transport', 'Household', 'Food', 'Lifestyle'],
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#3498db',
                        '#e74c3c',
                        '#2ecc71',
                        '#f1c40f'
                    ]
                }]
            }
        });
    }

    prepareTrendData() {
        const sortedHistory = [...this.history].sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
        );

        return {
            labels: sortedHistory.map(entry => 
                new Date(entry.timestamp).toLocaleDateString()
            ),
            values: sortedHistory.map(entry => entry.total)
        };
    }

    prepareCategoryData() {
        if (this.history.length === 0) return [0, 0, 0, 0];
        
        const latest = this.history[this.history.length - 1];
        return [
            latest.transport,
            latest.household,
            latest.food,
            latest.lifestyle
        ];
    }

    updateDashboard() {
        this.updateSummaryCards();
        this.updateInsights();
        this.updateActionPlan();
        this.displayConclusions();
    }

    updateSummaryCards() {
        if (this.history.length === 0) return;

        const latest = this.history[this.history.length - 1];
        const previous = this.history.length > 1 ? this.history[this.history.length - 2] : null;

        // Update total emissions
        document.getElementById('totalEmissions').textContent = 
            latest.total.toFixed(2) + ' tonnes';

        // Update carbon score
        const score = this.calculateCarbonScore(latest);
        document.getElementById('carbonScore').textContent = score;

        // Update trees needed
        const trees = Math.ceil(latest.total * 45); // Approximate number of trees needed
        document.getElementById('treesNeeded').textContent = trees;

        // Update trends
        if (previous) {
            const change = ((latest.total - previous.total) / previous.total) * 100;
            const trendElement = document.querySelector('.total-emissions .trend');
            trendElement.textContent = `${Math.abs(change).toFixed(1)}% ${change >= 0 ? '↑' : '↓'} vs last calculation`;
            trendElement.className = `trend ${change >= 0 ? 'positive' : 'negative'}`;
        }
    }

    calculateCarbonScore(calculation) {
        // Simple scoring algorithm (0-100)
        const maxEmissions = 20; // Example threshold
        const score = Math.max(0, 100 - (calculation.total / maxEmissions * 100));
        return Math.round(score);
    }

    updateInsights() {
        if (this.history.length === 0) return;

        const latest = this.history[this.history.length - 1];
        const insights = this.generateInsights(latest);
        
        const insightCards = document.querySelector('.insight-cards');
        insightCards.innerHTML = insights.map(insight => `
            <div class="insight-card ${insight.type}">
                <div class="insight-icon">
                    <i class="fas ${insight.icon}"></i>
                </div>
                <div class="insight-content">
                    <h4>${insight.title}</h4>
                    <p>${insight.description}</p>
                </div>
            </div>
        `).join('');
    }

    generateInsights(calculation) {
        const insights = [];
        
        // Example insights based on calculations
        if (calculation.transport < 3) {
            insights.push({
                type: 'achievement',
                icon: 'fa-trophy',
                title: 'Transport Champion!',
                description: 'Your transport emissions are well below average. Great job using sustainable transportation!'
            });
        }

        if (calculation.household > 5) {
            insights.push({
                type: 'alert',
                icon: 'fa-exclamation-circle',
                title: 'High Energy Usage',
                description: 'Your household emissions are above average. Consider an energy audit.'
            });
        }

        insights.push({
            type: 'tip',
            icon: 'fa-lightbulb',
            title: 'Quick Win',
            description: 'Switch to LED bulbs to reduce your electricity footprint by up to 80%!'
        });

        return insights;
    }

    updateActionPlan() {
        if (this.history.length === 0) return;

        const latest = this.history[this.history.length - 1];
        const actions = this.generateActions(latest);
        
        const actionCards = document.querySelector('.action-cards');
        actionCards.innerHTML = actions.map(action => `
            <div class="action-card priority-${action.priority}">
                <div class="action-header">
                    <span class="priority-badge">${action.priority} Impact</span>
                    <i class="fas ${action.icon} action-icon"></i>
                </div>
                <h4>${action.title}</h4>
                <p>${action.description}</p>
                <button class="action-btn">${action.buttonText}</button>
            </div>
        `).join('');
    }

    generateActions(calculation) {
        const actions = [];
        
        // Prioritized actions based on emissions
        if (calculation.transport > 4) {
            actions.push({
                priority: 'high',
                icon: 'fa-car',
                title: 'Switch to Public Transport',
                description: 'Reducing car usage by 50% could save 2.3 tonnes of CO2 annually',
                buttonText: 'Start Action'
            });
        }

        if (calculation.household > 3) {
            actions.push({
                priority: 'medium',
                icon: 'fa-home',
                title: 'Home Energy Audit',
                description: 'Schedule a professional energy audit to identify improvement areas',
                buttonText: 'Learn More'
            });
        }

        actions.push({
            priority: 'low',
            icon: 'fa-recycle',
            title: 'Start Composting',
            description: 'Reduce your food waste impact by creating nutrient-rich soil',
            buttonText: 'Get Started'
        });

        return actions;
    }

    displayConclusions() {
        const conclusionElement = document.getElementById('conclusionCards');
        const latest = this.history[this.history.length - 1];
        
        if (latest) {
            const conclusions = this.generateConclusions(latest);
            conclusionElement.innerHTML = conclusions
                .map(conclusion => `<div class="conclusion-card"><h5>${conclusion.title}</h5><p>${conclusion.description}</p></div>`)
                .join('');
        }
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

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
}); 