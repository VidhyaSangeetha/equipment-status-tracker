
const equipmentLocators = require('../pageObjects/EquipmentPageObject.json');
const { faker } = require('@faker-js/faker');
const _ = require('lodash')
const random = require('../utils/utils.js');

class EquipmentPage {
    name = ''; location = ''; status = '';

    clickAddEquipment() {
        cy.get(equipmentLocators.addEquipmentButton).click();
    }

    verifyAddEquipmentButtonisDisabled() {
        cy.get(equipmentLocators.saveButton).should('be.disabled');
    }

    enterEquipmentName() {
        this.name = random.generateEquipmentNames()[0];
        cy.get(equipmentLocators.equipmentNameInput).clear().type(this.name);
    }

    enterLocation() {
        this.location = random.generateLocation();
        cy.get(equipmentLocators.locationInput).should('be.visible');
        cy.get(equipmentLocators.locationInput).clear().type(this.location);
    }

    selectStatus() {
        this.status = random.generateRandomStatus();
        cy.get(equipmentLocators.statusDropdown).select(this.status);
    }

    saveEquipment() {
        cy.get(equipmentLocators.saveButton).click();
    }

    updateStatusforAnEquipment() {
        let currentStatus = cy.get(equipmentLocators.equipmentTableContent).eq(4).find('select').invoke('text');
        let newStatus = random.generateRandomStatus();
        if (currentStatus === 'Under Maintenance') {
            console.log('Current status is Under Maintenance, attempting to update to the same status');
            cy.get(equipmentLocators.equipmentTableContent).eq(4).find('select').select(newStatus);
            cy.get('body').then($body => {
                // Check if error message exists
                if ($body.find('.error-message').length === 0) {
                    // No error message displayed as expected
                    throw new Error('Status cannot be updated from Under Maintenance: error message is expected but not visible');
                }
            });
        } else {
            console.log(`Changing status to: ${newStatus}`);
            cy.get(equipmentLocators.equipmentTableContent).eq(4).find('select').select(newStatus);
        }

    }

    openHistoryModal() {
        cy.get(equipmentLocators.equipmentTableContent).eq(4).find('button').then($btn => {
            if ($btn.length && !$btn.is(':disabled')) {
                cy.wrap($btn).click();
            } else {
                cy.get(equipmentLocators.equipmentTableContent).eq(4).find('select').invoke('val').then(currentStatus => {
                    // Log bug: button not clickable, print current status
                    throw new Error(`BUG: History button not clickable. Current status: ${currentStatus}`);
                });
            }
        });
    }

    verifyHistoryModalContent() {
        cy.get(equipmentLocators.historyModal).should('be.visible');
        cy.get(equipmentLocators.historyHeading).should('contain', 'Status History');

        cy.get('body').then($body => {
            if ($body.find(equipmentLocators.historyContent).length > 0, { timeout: 10000 }) {
                // Wait for history content to fully render
                cy.get(equipmentLocators.historyContent)
                    .should('have.length.greaterThan', 0);

                cy.get(equipmentLocators.historyFromStatus).should('be.visible');
                cy.get(equipmentLocators.historyToStatus).should('be.visible');
                cy.get(equipmentLocators.historyTimestamp).should('be.visible');
                cy.get(equipmentLocators.operatorName)
                    .should('be.visible')
                    .and('contain', 'Changed by: ');

                cy.get(equipmentLocators.historyCloseButton).should('be.visible').click();
                cy.get(equipmentLocators.historyModal).should('not.exist');
            } else {
                // no history
                cy.get(equipmentLocators.noHistoryMessage, { timeout: 10000 })
                    .should('be.visible')
                    .and('contain', 'No history available for this equipment');
            }
        });
    }

    verifyEquipmentVisibility() {
        cy.get(equipmentLocators.equipmentTableContent, { timeout: 10000 }).should(($rows) => {
            const equipmentNames = $rows.map((index, row) => {
                return Cypress.$(row).find('div:nth-child(1)').text().trim();
            }).get();

            expect(equipmentNames).to.deep.include(this.name);
        });
    }

    verifyEquipmentStatusTypes() {
        cy.get(equipmentLocators.equipmentTableContentRow).each(($row) => {
            // Grab the 3rd column (status cell) inside the current row
            cy.wrap($row)
                .find('td').eq(2).find('span')
                .invoke('text')
                .then((text) => {
                    const status = text.trim();
                    cy.log('Status:', status);

                    if (status === 'Under Maintenance') {
                        cy.wrap($row)
                            .find('td').eq(2).find('span')
                            .should('have.class', 'bg-red-100')
                            .and('have.class', 'dark:text-red-400');
                    }
                    else if (status === 'Active') {
                        cy.wrap($row)
                            .find('td').eq(2).find('span')
                            .should('have.class', 'bg-green-100')
                            .and('have.class', 'dark:text-green-400');
                    }
                    else if (status === 'Idle') {
                        cy.wrap($row)
                            .find('td').eq(2).find('span')
                            .should('have.class', 'bg-yellow-100')
                            .and('have.class', 'dark:text-yellow-400');
                             // Log bug: Idle status not in expected color
                             throw new Error(`BUG: Status Badge for ${status} not in expected color`);
                    }
                });
        });
    }

    verifyEquipmentListPageElements() {
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
    }
}

module.exports = new EquipmentPage();
