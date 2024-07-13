describe('Draw Button Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
  });

  it('should display the draw button', () => {
    cy.get('button').contains('Draw a Character').should('be.visible');
  });

  it('should draw a character and display it', () => {
    cy.intercept('GET', '**/character/*', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      },
    }).as('getCharacter');

    cy.get('button').contains('Draw a Character').click();

    cy.wait('@getCharacter');
    cy.get('app-character-card h2').should('contain.text', 'Rick Sanchez');
    cy.get('app-character-card img')
      .should('have.attr', 'src')
      .should('include', '1.jpeg');
    cy.get('app-character-card .details').should(
      'contain.text',
      'Status: Alive | Species: Human | Character ID: 1'
    );
  });

  it('should initialize lastDrawTime and drawnCharacters from localStorage on ngOnInit', () => {
    const storedTime = Date.now() - 1000;
    const storedCharacters = [1, 2, 3];

    localStorage.setItem('lastDrawTime', storedTime.toString());
    localStorage.setItem('drawnCharacters', JSON.stringify(storedCharacters));

    cy.visit('http://localhost:4200/');

    cy.window().then((win) => {
      const component = (win as any).ng.getComponent(
        win.document.querySelector('app-draw-button')
      );
      expect(component.lastDrawTime).to.equal(storedTime);
      expect(Array.from(component.drawnCharacters)).to.deep.equal(
        storedCharacters
      );
    });
  });

  it('should correctly enable and disable the draw button based on time elapsed', () => {
    const currentTime = Date.now();
    const oneHourAgo = currentTime - 1 * 60 * 60 * 1000; // 1 hour ago
    const threeHoursAgo = currentTime - 3 * 60 * 60 * 1000; // 3 hours ago

    // Case 1 : Click on button
    cy.get('button')
      .contains('Draw a Character')
      .should('not.be.disabled')
      .click();
    cy.window().then((win) => {
      const component = (win as any).ng.getComponent(
        win.document.querySelector('app-draw-button')
      );
      component.canDraw = false;
      localStorage.setItem('lastDrawTime', Date.now().toString());
    });

    // Case 2 : -1h
    cy.window().then((win) => {
      localStorage.setItem('lastDrawTime', oneHourAgo.toString());
      win.location.reload();
    });
    cy.get('button').contains('Draw a Character').should('be.disabled');

    // Case 3 : -3h
    cy.window().then((win) => {
      localStorage.setItem('lastDrawTime', threeHoursAgo.toString());
      win.location.reload();
    });
    cy.get('button').contains('Draw a Character').should('be.not.disabled');
  });

  it('should fetch a new character if the same character is drawn again', () => {
    const character1 = {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    };

    const character2 = {
      id: 2,
      name: 'Morty Smith',
      status: 'Alive',
      species: 'Human',
      image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    };

    let requestCount = 0;

    cy.intercept('GET', '**/character/*', (req) => {
      requestCount++;
      if (requestCount === 1) {
        req.reply({ body: character1 });
      } else {
        req.reply({ body: character2 });
      }
    }).as('getCharacter');

    const currentTime = Date.now();
    const threeHoursLater = currentTime + 3 * 60 * 60 * 1000; // 3 hours later

    // Case 1: Click on the button to draw the first character
    cy.get('button')
      .contains('Draw a Character')
      .should('not.be.disabled')
      .click();
    cy.wait('@getCharacter');
    cy.get('app-character-card h2').should('contain.text', 'Rick Sanchez');

    // Simulate storing the drawn character and the time in localStorage
    cy.window().then((win) => {
      const component = (win as any).ng.getComponent(
        win.document.querySelector('app-draw-button')
      );
      component.drawnCharacters.add(character1.id);
      component.canDraw = false;
      localStorage.setItem('lastDrawTime', Date.now().toString());
    });

    // Simulate 3 hours later and verify that a new character is drawn
    cy.window().then((win) => {
      localStorage.setItem(
        'lastDrawTime',
        (Date.now() - 3 * 60 * 60 * 1000).toString()
      );
      win.location.reload();
    });

    cy.get('button')
      .contains('Draw a Character')
      .should('not.be.disabled')
      .click();
    cy.wait('@getCharacter');
    cy.get('app-character-card h2').should('contain.text', 'Morty Smith');
  });
});
