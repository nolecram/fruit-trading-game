// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const lightModeIcon = document.getElementById('light-mode-icon');
    const darkModeIcon = document.getElementById('dark-mode-icon');
    const themeStatus = document.getElementById('theme-status');
    
    function setTheme(isDarkMode) {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            lightModeIcon.style.display = 'none';
            darkModeIcon.style.display = 'block';
            themeStatus.textContent = 'Dark Mode';
        } else {
            document.body.classList.remove('dark-mode');
            lightModeIcon.style.display = 'block';
            darkModeIcon.style.display = 'none';
            themeStatus.textContent = 'Light Mode';
        }
        
        // Save preference
        localStorage.setItem('dark-mode', isDarkMode);
        
        // Update charts if available
        if (window.game && typeof window.game.updatePriceHistoryChart === 'function') {
            window.game.updatePriceHistoryChart();
        }
    }
    
    // Apply saved theme preference or use dark mode as default
    const savedDarkMode = localStorage.getItem('dark-mode');
    // Use dark mode by default if no preference is saved
    const isDarkMode = savedDarkMode === null ? true : savedDarkMode === 'true';
    setTheme(isDarkMode);
    
    // Theme toggle handler
    themeToggleButton.addEventListener('click', function() {
        const willBeDarkMode = !document.body.classList.contains('dark-mode');
        setTheme(willBeDarkMode);
    });
}); 