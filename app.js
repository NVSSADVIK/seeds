// AgriCredit Application JavaScript

class AgriCreditApp {
    constructor() {
        this.currentUser = null;
        this.farmerData = {};
        this.alternativeData = {};
        this.creditResult = null;
        
        // Sample credentials
        this.credentials = {
            username: "farmer123",
            password: "demo2024"
        };
        
        // Credit scoring rules
        this.scoringRules = {
            baseScore: 500,
            maxScore: 850,
            rainfall: { threshold: 500, points: 50 },
            phoneUsage: { weekly: 30, biweekly: 20, monthly: 10, irregular: 5 },
            landSize: { threshold: 2, points: 40 },
            income: { threshold: 150000, points: 60 },
            digitalPayment: { high: 25, medium: 15, low: 5, none: 0 },
            irrigation: { drip: 20, sprinkler: 15, canal: 10, 'tube-well': 12, 'rain-fed': 0 },
            farmEquipment: { modern: 30, basic: 15, traditional: 5, none: 0 },
            experience: { threshold: 5, points: 20 }
        };
        
        // Risk categories
        this.riskCategories = {
            low: { minScore: 700, label: "Low Risk", multiplier: 3, status: "success" },
            medium: { minScore: 600, label: "Medium Risk", multiplier: 2, status: "warning" },
            high: { minScore: 0, label: "High Risk", multiplier: 1, status: "error" }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkLoginStatus();
        this.loadSavedData();
    }
    
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Farmer details form
        const farmerDetailsForm = document.getElementById('farmerDetailsForm');
        if (farmerDetailsForm) {
            farmerDetailsForm.addEventListener('submit', (e) => this.handleFarmerDetails(e));
        }
        
        // Alternative data form
        const alternativeDataForm = document.getElementById('alternativeDataForm');
        if (alternativeDataForm) {
            alternativeDataForm.addEventListener('submit', (e) => this.handleAlternativeData(e));
        }
        
        // Navigation buttons
        const backToFarmerDetailsBtn = document.getElementById('backToFarmerDetails');
        if (backToFarmerDetailsBtn) {
            backToFarmerDetailsBtn.addEventListener('click', () => this.showPage('farmerDetailsPage'));
        }
        
        const startNewAssessmentBtn = document.getElementById('startNewAssessment');
        if (startNewAssessmentBtn) {
            startNewAssessmentBtn.addEventListener('click', () => this.startNewAssessment());
        }
        
        const proceedToApplicationBtn = document.getElementById('proceedToApplication');
        if (proceedToApplicationBtn) {
            proceedToApplicationBtn.addEventListener('click', () => this.proceedToApplication());
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        // Toast close button
        const toastClose = document.getElementById('toastClose');
        if (toastClose) {
            toastClose.addEventListener('click', () => this.hideToast());
        }
        
        // Form validation
        this.setupFormValidation();
    }
    
    setupFormValidation() {
        // Add real-time validation for required fields
        const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const isValid = field.checkValidity();
        
        if (!isValid || !value) {
            this.showFieldError(field, 'This field is required');
            field.classList.add('error');
            return false;
        } else {
            this.clearFieldError(field);
            field.classList.remove('error');
            field.classList.add('success');
            return true;
        }
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
    
    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.classList.remove('error');
    }
    
    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');
        
        if (username === this.credentials.username && password === this.credentials.password) {
            this.currentUser = username;
            this.showNavActions(username);
            this.showPage('farmerDetailsPage');
            this.showToast('Login successful! Welcome to AgriCredit.', 'success');
            errorDiv.style.display = 'none';
        } else {
            errorDiv.textContent = 'Invalid username or password. Please use the sample credentials provided.';
            errorDiv.style.display = 'block';
            this.showToast('Login failed. Please check your credentials.', 'error');
        }
    }
    
    handleFarmerDetails(e) {
        e.preventDefault();
        
        // Validate all required fields
        const form = e.target;
        const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showToast('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Collect farmer data
        this.farmerData = {
            name: document.getElementById('farmerName').value,
            age: parseInt(document.getElementById('farmerAge').value),
            phone: document.getElementById('farmerPhone').value,
            email: document.getElementById('farmerEmail').value,
            address: document.getElementById('farmerAddress').value,
            landSize: parseFloat(document.getElementById('landSize').value),
            ownershipType: document.getElementById('ownershipType').value,
            farmingExperience: parseInt(document.getElementById('farmingExperience').value),
            soilType: document.getElementById('soilType').value,
            annualIncome: parseInt(document.getElementById('annualIncome').value),
            existingLoans: parseInt(document.getElementById('existingLoans').value),
            bankAccount: document.getElementById('bankAccount').value
        };
        
        this.saveData();
        this.showPage('alternativeDataPage');
        this.showToast('Farmer details saved successfully!', 'success');
    }
    
    handleAlternativeData(e) {
        e.preventDefault();
        
        // Validate all required fields
        const form = e.target;
        const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showToast('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Collect alternative data
        this.alternativeData = {
            primaryCrop: document.getElementById('primaryCrop').value,
            irrigationType: document.getElementById('irrigationType').value,
            averageRainfall: parseInt(document.getElementById('averageRainfall').value),
            averageTemperature: parseInt(document.getElementById('averageTemperature').value),
            phoneRechargeFreq: document.getElementById('phoneRechargeFreq').value,
            digitalPaymentUsage: document.getElementById('digitalPaymentUsage').value,
            marketDistance: parseFloat(document.getElementById('marketDistance').value),
            farmEquipment: document.getElementById('farmEquipment').value
        };
        
        this.saveData();
        this.showLoadingOverlay(true);
        
        // Simulate processing time
        setTimeout(() => {
            this.calculateCreditScore();
            this.showLoadingOverlay(false);
            this.showPage('resultsPage');
            this.showToast('Credit assessment completed!', 'success');
        }, 3000);
    }
    
    calculateCreditScore() {
        let score = this.scoringRules.baseScore;
        const breakdown = [];
        
        // Rainfall scoring
        if (this.alternativeData.averageRainfall > this.scoringRules.rainfall.threshold) {
            score += this.scoringRules.rainfall.points;
            breakdown.push({
                label: `High Rainfall (>${this.scoringRules.rainfall.threshold}mm)`,
                points: this.scoringRules.rainfall.points,
                positive: true
            });
        }
        
        // Phone recharge frequency scoring
        const phonePoints = this.scoringRules.phoneUsage[this.alternativeData.phoneRechargeFreq] || 0;
        if (phonePoints > 0) {
            score += phonePoints;
            breakdown.push({
                label: `Phone Usage (${this.alternativeData.phoneRechargeFreq})`,
                points: phonePoints,
                positive: true
            });
        }
        
        // Land size scoring
        if (this.farmerData.landSize > this.scoringRules.landSize.threshold) {
            score += this.scoringRules.landSize.points;
            breakdown.push({
                label: `Large Farm Size (>${this.scoringRules.landSize.threshold} acres)`,
                points: this.scoringRules.landSize.points,
                positive: true
            });
        }
        
        // Annual income scoring
        if (this.farmerData.annualIncome > this.scoringRules.income.threshold) {
            score += this.scoringRules.income.points;
            breakdown.push({
                label: `Good Income (>₹${this.scoringRules.income.threshold})`,
                points: this.scoringRules.income.points,
                positive: true
            });
        }
        
        // Digital payment usage scoring
        const digitalPoints = this.scoringRules.digitalPayment[this.alternativeData.digitalPaymentUsage] || 0;
        if (digitalPoints > 0) {
            score += digitalPoints;
            breakdown.push({
                label: `Digital Payment Usage (${this.alternativeData.digitalPaymentUsage})`,
                points: digitalPoints,
                positive: true
            });
        }
        
        // Irrigation type scoring
        const irrigationPoints = this.scoringRules.irrigation[this.alternativeData.irrigationType] || 0;
        if (irrigationPoints > 0) {
            score += irrigationPoints;
            breakdown.push({
                label: `Irrigation System (${this.alternativeData.irrigationType})`,
                points: irrigationPoints,
                positive: true
            });
        }
        
        // Farm equipment scoring
        const equipmentPoints = this.scoringRules.farmEquipment[this.alternativeData.farmEquipment] || 0;
        if (equipmentPoints > 0) {
            score += equipmentPoints;
            breakdown.push({
                label: `Farm Equipment (${this.alternativeData.farmEquipment})`,
                points: equipmentPoints,
                positive: true
            });
        }
        
        // Farming experience scoring
        if (this.farmerData.farmingExperience > this.scoringRules.experience.threshold) {
            score += this.scoringRules.experience.points;
            breakdown.push({
                label: `Experienced Farmer (>${this.scoringRules.experience.threshold} years)`,
                points: this.scoringRules.experience.points,
                positive: true
            });
        }
        
        // Deductions
        if (this.farmerData.existingLoans > 50000) {
            const deduction = 20;
            score -= deduction;
            breakdown.push({
                label: 'High Existing Loan Burden',
                points: -deduction,
                positive: false
            });
        }
        
        if (this.alternativeData.marketDistance > 50) {
            const deduction = 15;
            score -= deduction;
            breakdown.push({
                label: 'Remote Market Access',
                points: -deduction,
                positive: false
            });
        }
        
        // Cap the score
        score = Math.min(score, this.scoringRules.maxScore);
        score = Math.max(score, 300); // Minimum score
        
        // Determine risk category
        let riskCategory = this.riskCategories.high;
        if (score >= this.riskCategories.low.minScore) {
            riskCategory = this.riskCategories.low;
        } else if (score >= this.riskCategories.medium.minScore) {
            riskCategory = this.riskCategories.medium;
        }
        
        // Calculate recommended loan amount
        const baseAmount = Math.floor(this.farmerData.annualIncome * 0.5);
        const recommendedAmount = baseAmount * riskCategory.multiplier;
        
        this.creditResult = {
            score,
            riskCategory: riskCategory.label,
            riskStatus: riskCategory.status,
            recommendedAmount,
            breakdown,
            timestamp: new Date().toISOString()
        };
        
        this.displayResults();
        this.saveData();
    }
    
    displayResults() {
        const scoreElement = document.getElementById('creditScore');
        const riskStatusElement = document.getElementById('riskStatus');
        const recommendedAmountElement = document.getElementById('recommendedAmount');
        const loanDetailsElement = document.getElementById('loanDetails');
        const scoreBreakdownElement = document.getElementById('scoreBreakdown');
        
        if (scoreElement) {
            scoreElement.textContent = this.creditResult.score;
        }
        
        if (riskStatusElement) {
            riskStatusElement.textContent = this.creditResult.riskCategory;
            riskStatusElement.className = `status status--${this.creditResult.riskStatus}`;
        }
        
        if (recommendedAmountElement) {
            recommendedAmountElement.textContent = `₹ ${this.formatNumber(this.creditResult.recommendedAmount)}`;
        }
        
        if (loanDetailsElement) {
            const category = this.creditResult.riskCategory.toLowerCase();
            let details = '';
            
            if (category.includes('low')) {
                details = 'Excellent creditworthiness. You qualify for our best rates with flexible repayment terms.';
            } else if (category.includes('medium')) {
                details = 'Good creditworthiness. Competitive rates available with standard terms and conditions.';
            } else {
                details = 'Credit available with enhanced monitoring. Higher interest rates may apply.';
            }
            
            loanDetailsElement.textContent = details;
        }
        
        if (scoreBreakdownElement && this.creditResult.breakdown) {
            scoreBreakdownElement.innerHTML = '';
            
            // Add base score
            const baseItem = document.createElement('div');
            baseItem.className = 'breakdown-item';
            baseItem.innerHTML = `
                <span class="breakdown-label">Base Score</span>
                <span class="breakdown-points">+${this.scoringRules.baseScore}</span>
            `;
            scoreBreakdownElement.appendChild(baseItem);
            
            // Add breakdown items
            this.creditResult.breakdown.forEach(item => {
                const breakdownItem = document.createElement('div');
                breakdownItem.className = 'breakdown-item';
                breakdownItem.innerHTML = `
                    <span class="breakdown-label">${item.label}</span>
                    <span class="breakdown-points ${item.positive ? '' : 'negative'}">${item.positive ? '+' : ''}${item.points}</span>
                `;
                scoreBreakdownElement.appendChild(breakdownItem);
            });
        }
        
        // Update score circle percentage for visual effect
        const scorePercentage = (this.creditResult.score / this.scoringRules.maxScore) * 100;
        const scoreCircle = document.querySelector('.score-circle');
        if (scoreCircle) {
            scoreCircle.style.setProperty('--score-percentage', scorePercentage);
        }
    }
    
    proceedToApplication() {
        this.showToast('Redirecting to loan application process...', 'success');
        setTimeout(() => {
            this.showPage('dashboardPage');
            this.updateDashboard();
        }, 1500);
    }
    
    updateDashboard() {
        const summaryElement = document.getElementById('applicationSummary');
        if (summaryElement && this.creditResult) {
            summaryElement.innerHTML = `
                <div class="summary-card">
                    <h4>Application Status</h4>
                    <p><strong>Status:</strong> Assessment Complete</p>
                    <p><strong>Credit Score:</strong> ${this.creditResult.score}</p>
                    <p><strong>Risk Category:</strong> ${this.creditResult.riskCategory}</p>
                    <p><strong>Recommended Amount:</strong> ₹${this.formatNumber(this.creditResult.recommendedAmount)}</p>
                </div>
                <div class="summary-card">
                    <h4>Applicant Information</h4>
                    <p><strong>Name:</strong> ${this.farmerData.name}</p>
                    <p><strong>Land Size:</strong> ${this.farmerData.landSize} acres</p>
                    <p><strong>Primary Crop:</strong> ${this.alternativeData.primaryCrop}</p>
                    <p><strong>Annual Income:</strong> ₹${this.formatNumber(this.farmerData.annualIncome)}</p>
                </div>
                <div class="summary-card">
                    <h4>Next Steps</h4>
                    <p>Your credit assessment is complete. A loan officer will contact you within 2-3 business days to discuss your application and finalize the loan terms.</p>
                    <p><strong>Application ID:</strong> AGC${Date.now().toString().slice(-6)}</p>
                </div>
            `;
        }
    }
    
    startNewAssessment() {
        this.farmerData = {};
        this.alternativeData = {};
        this.creditResult = null;
        this.clearLocalStorage();
        
        // Reset forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => form.reset());
        
        // Clear validation states
        const fields = document.querySelectorAll('.form-control');
        fields.forEach(field => {
            field.classList.remove('error', 'success');
        });
        
        this.showPage('farmerDetailsPage');
        this.showToast('Starting new credit assessment...', 'success');
    }
    
    showPage(pageId) {
        const pages = document.querySelectorAll('.page-container');
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }
    
    showNavActions(username) {
        const navActions = document.getElementById('navActions');
        const userWelcome = document.getElementById('userWelcome');
        
        if (navActions && userWelcome) {
            userWelcome.textContent = `Welcome, ${username}`;
            navActions.style.display = 'flex';
        }
    }
    
    hideNavActions() {
        const navActions = document.getElementById('navActions');
        if (navActions) {
            navActions.style.display = 'none';
        }
    }
    
    logout() {
        this.currentUser = null;
        this.farmerData = {};
        this.alternativeData = {};
        this.creditResult = null;
        this.clearLocalStorage();
        
        // Reset forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => form.reset());
        
        // Clear validation states
        const fields = document.querySelectorAll('.form-control');
        fields.forEach(field => {
            field.classList.remove('error', 'success');
        });
        
        this.hideNavActions();
        this.showPage('loginPage');
        this.showToast('Logged out successfully!', 'success');
    }
    
    showLoadingOverlay(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `toast ${type}`;
            toast.style.display = 'flex';
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                this.hideToast();
            }, 5000);
        }
    }
    
    hideToast() {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.style.display = 'none';
        }
    }
    
    saveData() {
        const appData = {
            farmerData: this.farmerData,
            alternativeData: this.alternativeData,
            creditResult: this.creditResult,
            currentUser: this.currentUser
        };
        
        try {
            localStorage.setItem('agricreditData', JSON.stringify(appData));
        } catch (e) {
            console.warn('Could not save data to localStorage:', e);
        }
    }
    
    loadSavedData() {
        try {
            const savedData = localStorage.getItem('agricreditData');
            if (savedData) {
                const appData = JSON.parse(savedData);
                this.farmerData = appData.farmerData || {};
                this.alternativeData = appData.alternativeData || {};
                this.creditResult = appData.creditResult || null;
                
                // Don't auto-login, but populate forms if data exists
                this.populateFormsFromSavedData();
            }
        } catch (e) {
            console.warn('Could not load saved data:', e);
        }
    }
    
    populateFormsFromSavedData() {
        // Populate farmer details form
        if (this.farmerData && Object.keys(this.farmerData).length > 0) {
            Object.keys(this.farmerData).forEach(key => {
                const element = document.getElementById(this.getFieldId(key));
                if (element && this.farmerData[key]) {
                    element.value = this.farmerData[key];
                }
            });
        }
        
        // Populate alternative data form
        if (this.alternativeData && Object.keys(this.alternativeData).length > 0) {
            Object.keys(this.alternativeData).forEach(key => {
                const element = document.getElementById(this.getAltFieldId(key));
                if (element && this.alternativeData[key]) {
                    element.value = this.alternativeData[key];
                }
            });
        }
    }
    
    getFieldId(fieldName) {
        const fieldMap = {
            name: 'farmerName',
            age: 'farmerAge',
            phone: 'farmerPhone',
            email: 'farmerEmail',
            address: 'farmerAddress',
            landSize: 'landSize',
            ownershipType: 'ownershipType',
            farmingExperience: 'farmingExperience',
            soilType: 'soilType',
            annualIncome: 'annualIncome',
            existingLoans: 'existingLoans',
            bankAccount: 'bankAccount'
        };
        return fieldMap[fieldName] || fieldName;
    }
    
    getAltFieldId(fieldName) {
        const fieldMap = {
            primaryCrop: 'primaryCrop',
            irrigationType: 'irrigationType',
            averageRainfall: 'averageRainfall',
            averageTemperature: 'averageTemperature',
            phoneRechargeFreq: 'phoneRechargeFreq',
            digitalPaymentUsage: 'digitalPaymentUsage',
            marketDistance: 'marketDistance',
            farmEquipment: 'farmEquipment'
        };
        return fieldMap[fieldName] || fieldName;
    }
    
    clearLocalStorage() {
        try {
            localStorage.removeItem('agricreditData');
        } catch (e) {
            console.warn('Could not clear localStorage:', e);
        }
    }
    
    checkLoginStatus() {
        // Always start at login page for demo purposes
        this.showPage('loginPage');
    }
    
    formatNumber(num) {
        return num.toLocaleString('en-IN');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.agricreditApp = new AgriCreditApp();
});

// Export for potential testing or external access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgriCreditApp;
}