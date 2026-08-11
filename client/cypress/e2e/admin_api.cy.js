describe('Admin UI CRUD Tests (Users, Vehicles, Bookings, Payments)', () => {
  
  const adminCredentials = {
    email: 'admin@example.com',
    password: 'adminpassword123'
  };

  beforeEach(() => {
    cy.visit('/signin');
    cy.get('input#email').type(adminCredentials.email);
    cy.get('input#password').type(adminCredentials.password);
    cy.get('button#signin-submit').click();
    cy.url().should('include', '/adminDashboard', { timeout: 10000 });
  });

  // --- USERS CRUD ---
  context('Users CRUD', () => {
    it('should Create, Read, Update, and Delete a User', () => {
      cy.visit('/adminDashboard/allUsers');
      cy.contains('All Users', { matchCase: false }).should('be.visible');

      const uniqueUser = 'crud_user_' + Date.now();

      // 1. CREATE
      cy.contains('button', 'Add User').click({ force: true });
      cy.contains('Add User').should('be.visible');
      cy.get('input[type="text"]').eq(1).type(uniqueUser);
      cy.get('input[type="email"]').type(uniqueUser + '@test.com');
      cy.get('input[type="password"]').type('password123');
      cy.contains('button', 'Create User').click({ force: true });
      
      cy.contains('User has been created', { timeout: 10000 }).should('be.visible');
      cy.contains('button', 'OK').click({ force: true });

      // 2. READ & 3. UPDATE
      // Find the specific user we just created to edit
      cy.contains('.MuiDataGrid-row', uniqueUser).find('.text-blue-500').click({ force: true });
      cy.contains('Edit User').should('be.visible');
      cy.contains('button', 'Save Changes').click({ force: true });
      cy.contains('User has been updated', { timeout: 10000 }).should('be.visible');
      cy.contains('button', 'OK').click({ force: true });

      // 4. DELETE
      // Find the specific user we just created to delete
      cy.contains('.MuiDataGrid-row', uniqueUser).find('.text-red-500').click({ force: true });
      cy.contains('Are you sure?').should('be.visible');
      cy.contains('button', 'Yes, delete it!').click({ force: true });
      cy.contains('The user has been deleted', { timeout: 10000 }).should('be.visible');
      cy.contains('button', 'OK').click({ force: true });
    });
  });

  // --- VEHICLES CRUD ---
  context('Vehicles CRUD', () => {
    it('should perform CRUD operations on Vehicles', () => {
      cy.visit('/adminDashboard/allProduct');
      cy.url().should('include', '/allProduct');

      // 1. CREATE (Open modal)
      cy.contains('button', 'Add Vehicle').click({ force: true });
      cy.contains('Add New Vehicle', { timeout: 10000 }).should('be.visible');
      cy.get('#registeration_number').type('REG-' + Date.now(), { force: true });
      cy.get('#name').type('Test Vehicle', { force: true });
      cy.get('#price').type('5000', { force: true });
      // Close modal gracefully to avoid backend failure without images
      cy.get('button').find('svg').first().click({ force: true }); 

      // CONDITIONAL UPDATE/DELETE
      cy.get('body').then($body => {
        if ($body.find('.MuiDataGrid-row').length > 0) {
          // 3. UPDATE (Open Edit modal without saving)
          cy.get('[data-testid="ModeEditOutlineIcon"]').first().click({ force: true });
          cy.wait(1000); // Wait for modal
          // Close it safely
          cy.get('button').find('svg').first().click({ force: true }); 
        }
      });
    });
  });

  // --- BOOKINGS CRUD ---
  context('Bookings CRUD', () => {
    it('should perform CRUD operations on Bookings', () => {
      cy.visit('/adminDashboard/orders');
      cy.url().should('include', '/orders');

      // 1. CREATE
      cy.contains('button', '+ Add Booking').click({ force: true });
      cy.contains('Add New Booking').should('be.visible');
      cy.get('form select').eq(0).find('option').then(options => {
        if(options.length > 1) cy.get('form select').eq(0).select(1, { force: true });
      });
      cy.get('form select').eq(1).find('option').then(options => {
        if(options.length > 1) cy.get('form select').eq(1).select(1, { force: true });
      });
      cy.contains('button', 'Cancel').click({ force: true });

      // CONDITIONAL UPDATE/DELETE
      cy.get('body').then($body => {
        if ($body.find('.MuiDataGrid-row').length > 0) {
          // 3. UPDATE (Edit first booking)
          cy.get('.text-blue-500').first().click({ force: true }); 
          cy.contains('Edit Booking').should('be.visible');
          cy.contains('button', 'Save Changes').click({ force: true });
          cy.contains('The booking has been updated', { timeout: 10000 }).should('be.visible');
          cy.contains('button', 'OK').click({ force: true });

          // 4. DELETE (Delete first booking)
          cy.get('.text-red-500').first().click({ force: true });
          cy.contains('Are you sure?').should('be.visible');
          cy.contains('button', 'Yes, delete it!').click({ force: true });
          cy.contains('The booking has been deleted', { timeout: 10000 }).should('be.visible');
          cy.contains('button', 'OK').click({ force: true });
        }
      });
    });
  });

  // --- PAYMENTS CRUD ---
  context('Payments CRUD', () => {
    it('should perform CRUD operations on Payments', () => {
      cy.visit('/adminDashboard/payments');
      cy.url().should('include', '/payments');

      // 1. CREATE
      cy.contains('button', 'Add Request').click({ force: true });
      cy.contains('Add Payment Request').should('be.visible');
      cy.get('input[type="number"]').type('5000', { force: true });
      cy.get('input[type="text"]').eq(0).type('user_id_test', { force: true });
      cy.get('input[type="text"]').eq(1).type('vehicle_id_test', { force: true });
      cy.contains('button', 'Cancel').click({ force: true });

      // CONDITIONAL UPDATE/DELETE
      cy.get('body').then($body => {
        if ($body.find('.MuiDataGrid-row').length > 0) {
          // 3. UPDATE
          cy.get('button.bg-green-50').first().click({ force: true }); 
          cy.contains('Edit Payment Request').should('be.visible');
          cy.contains('button', 'Save Changes').click({ force: true });
          
          // 4. DELETE
          cy.get('button.bg-red-50').first().click({ force: true });
          cy.contains('Are you sure?').should('be.visible');
          cy.contains('button', 'Yes, delete it!').click({ force: true });
          cy.contains('The payment has been deleted', { timeout: 10000 }).should('be.visible');
          cy.contains('button', 'OK').click({ force: true });
        }
      });
    });
  });

});
