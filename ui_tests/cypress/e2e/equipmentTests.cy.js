const EquipmentPage = require('../page/EquipmentPage');

describe('Equipment Status Tracker Tests', () => {

    beforeEach(() => {
        cy.visitEquipmentStatusTracker();
    });

    it('UI_001 Equipment list page display', () => {
        EquipmentPage.verifyEquipmentListPageElements();
        EquipmentPage.verifyEquipmentListContentIsVisible();
    });

    it('UI_002 Should add new equipment', () => {
        EquipmentPage.clickAddEquipment();
        EquipmentPage.verifyAddEquipmentButtonisDisabled();
        EquipmentPage.enterEquipmentName();
        EquipmentPage.selectStatus();
        EquipmentPage.enterLocation();
        EquipmentPage.saveEquipment();
        EquipmentPage.verifyEquipmentVisibility();
    });

    it('UI_003 Should update equipment status', () => {
        // Expects error in case of current status is 'Under Maintenance' while trying to update
        //Otherwise it updates the current status to new status
        EquipmentPage.updateStatusforAnEquipment();
    });

    it('UI_004 Should open history modal', () => {
        EquipmentPage.openHistoryModal();
        EquipmentPage.verifyHistoryModalContent();
    });

    it('UI_005 Verify Equipment Status Types', () => {
        EquipmentPage.verifyEquipmentStatusTypes();
    });

});
