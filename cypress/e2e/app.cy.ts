describe('HomeQuest Application', () => {
    beforeEach(() => {
        // Visit the app before each test
        cy.visit('/');
    });

    it('loads the application successfully', () => {
        // Check if the main title exists (adjust selector based on actual content)
        cy.get('h1').should('contain', 'HomeQuest');
    });

    it('displays the Quest Board', () => {
        // Check for a specific element that signifies the board plays
        cy.contains('Daily Quests').should('be.visible');
    });

    it('allows navigation to profiles', () => {
        // A simple test to check interaction if possible, or just presence of key UI
        cy.get('[aria-label="Select Profile"]').should('exist');
    });
});
