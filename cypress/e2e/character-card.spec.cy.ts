describe('CharacterCardComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
  });

  it('should display character details after drawing a character', () => {
    const character = {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth (C-137)', url: '' },
      location: { name: 'Earth (Replacement Dimension)', url: '' },
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      episode: [],
      url: '',
      created: '',
    };

    // Mock the API response
    cy.intercept('GET', '**/character/*', {
      statusCode: 200,
      body: character,
    }).as('getCharacter');

    // Click the button to draw a character
    cy.get('button').contains('Draw a Character').click();

    // Wait for the API call to complete
    cy.wait('@getCharacter');

    // Check details
    cy.get('app-character-card h2').should('contain.text', 'Rick Sanchez');
    cy.get('app-character-card img')
      .should('have.attr', 'src')
      .should('include', character.image);
    cy.get('app-character-card .details').should(
      'contain.text',
      'Status: Alive | Species: Human | Character ID: 1'
    );
  });
});
