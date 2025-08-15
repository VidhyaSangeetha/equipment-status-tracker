
const equipmentLocators = require('../pageObjects/EquipmentPageObject.json');
const { faker } = require('@faker-js/faker');
const _ = require('lodash')

class EquipmentPage {
    name = '';
    
    visit() {
        cy.visit('https://qa-assignment-omega.vercel.app/');
    }

    clickAddEquipment() {
        cy.get(equipmentLocators.addEquipmentButton).click();
    }

    enterEquipmentName() {
        this.name = faker.commerce.productName();
        cy.get(equipmentLocators.equipmentNameInput).clear().type(this.name);
    }

    enterLocation() {
       let location = _.first(_.shuffle(['Warehouse', 'Site A', 'Site B'])); 
        cy.get(equipmentLocators.locationInput).clear().type(location);
    }

    selectStatus(status) {
        cy.get(equipmentLocators.statusDropdown).select(status);
    }

    saveEquipment() {
        cy.get(equipmentLocators.saveButton).click();
    }

    updateStatus(newStatus) {

       cy.get(equipmentLocators.equipmentTableContent).eq(4).find('select').select(newStatus);
    }

    openHistoryModal() {
       cy.get(equipmentLocators.equipmentTableContent).eq(4).find('button').click();
    }

    verifyEquipmentVisibility() {
        cy.get(equipmentLocators.equipmentTableContent, { timeout: 10000 }).should(($rows) => {
            const equipmentNames = $rows.map((index, row) => {
                return Cypress.$(row).find('div:nth-child(1)').text().trim();
            }).get();

            expect(equipmentNames).to.deep.include(this.name);
        });
    }

    verifyEquipmentListIsVisible() {
        cy.get(equipmentLocators.equipmentList).should('be.visible');
        cy.get(equipmentLocators.equipmentListHeading).should('contain', 'Equipment List');
        cy.get(equipmentLocators.equipmentTableHeadings).should('have.length', 5); 
        cy.get(equipmentLocators.statusCount).should('be.visible');
        cy.get(equipmentLocators.headerButtons).eq(0).should('contain', 'Refresh');
        cy.get(equipmentLocators.headerButtons).eq(1).should('contain', 'Add Equipment');
    }

        verifyEquipmentListContentIsVisible() {
        cy.get(equipmentLocators.equipmentTableContent).eq(0).find('div:nth-child(1)').should('be.visible');
         cy.get(equipmentLocators.equipmentTableContent).eq(0).find('div:nth-child(2)').should('contain', 'ID');
          cy.get(equipmentLocators.equipmentTableContent).eq(1).should('be.visible');
          cy.get(equipmentLocators.equipmentTableContent).eq(2).find('span').should(($span) => {
            const text = $span.text().trim();
            expect(['Active', 'Idle', 'Under Maintenance']).to.include(text);
          });
          cy.get(equipmentLocators.equipmentTableContent).eq(3).should('be.visible');
          cy.get(equipmentLocators.equipmentTableContent).eq(4).find('select>option').should('have.length', 3);
          cy.get(equipmentLocators.equipmentTableContent).eq(4).find('button').should('contain', 'History');
           cy.get(equipmentLocators.equipmentTableContent).eq(4).find('button').click();
    }
}

module.exports = new EquipmentPage();
