const EquipmentPage = require('../page/EquipmentPage');

describe('Equipment Status Tracker Tests', () => {

    beforeEach(() => {
        EquipmentPage.visit();
    });

    it('UI_001 Equipment list page display', () => {
        EquipmentPage.verifyEquipmentListIsVisible();
        EquipmentPage.verifyEquipmentListContentIsVisible();
    });

    it('UI_002 Should add new equipment', () => {
        EquipmentPage.clickAddEquipment();
        EquipmentPage.enterEquipmentName();
        EquipmentPage.selectStatus('Active');
        EquipmentPage.enterLocation();
        EquipmentPage.saveEquipment();
        EquipmentPage.verifyEquipmentVisibility();
    });

    it('Should update equipment status', () => {
        EquipmentPage.updateStatus('Active');
    });

    it('Should open history modal', () => {
        EquipmentPage.openHistoryModal();
    });

});
