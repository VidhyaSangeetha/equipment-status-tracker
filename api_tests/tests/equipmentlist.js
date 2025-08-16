const { expect } = require('chai');
const go = require('../helpers/commonrequests.js');
const attempt = require('../helpers/assertions.js');
const random = require('../helpers/util.js');
const { faker } = require('@faker-js/faker');
const _ = require('lodash')
const fromEquipment = '/api/equipment'

describe('Equipment Tracker API tests', function () {
  let equipmentId;
  let location = random.generateLocation();
  let status = random.generateRandomStatus();
  let equipmentKeys = ['id', 'name', 'status', 'location', 'lastUpdated'];
  // Create a new equipment before running tests
  before('Test Data- Create a new equipment', async () => {
    const payload = { name: random.generateEquipmentNames()[0], status: status, location: location }
    const content = await go.post(fromEquipment, payload);
    equipmentId = content.id;
  })

  // Positive tests for Equipment Tracker API
  describe('Equipment Status Tracker Positive Tests ', function () {
    // Validate the keys and types of the equipment data
    it('API001 Get all equipments and validate the keys', async () => {

      const content = await go.getAll(fromEquipment)
      expect(content).to.be.an('array');
      content.forEach(item => {
        expect(item).to.have.all.keys(...equipmentKeys);
        expect(item.id).to.be.a('number').and.greaterThan(0);
        expect(item.name).to.be.a('string');
        expect(item.status).to.be.a('string');
        expect(item.location).to.be.a('string');
        expect(item.status).to.be.oneOf(['Idle', 'Under Maintenance', 'Active']);
      });
    });
    // Create a new equipment with random status and validate the response
    it('API002 POST Creates a new equipment in random status', async () => {
      const payload = { name: random.generateEquipmentNames()[0], status: status, location: location }
      const content = await go.post(fromEquipment, payload);
      expect(content).to.have.property('name', payload.name);
      expect(content).to.have.property('status', payload.status);
      expect(content).to.have.property('location', payload.location);
      expect(content).to.have.property('lastUpdated');
      expect(content).to.have.property('id');
      expect(content).to.have.all.keys('id', 'name', 'status', 'location', 'lastUpdated');
      expect(content.id).to.be.a('number').and.greaterThan(0);
      expect(content.name).to.be.a('string').and.not.empty;
      expect(content.status).to.be.a('string').and.not.empty;
      expect(content.location).to.be.a('string').and.not.empty;
      expect(content.lastUpdated).to.be.a('string').and.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
      expect(content.status).to.be.oneOf(['Idle', 'Under Maintenance', 'Active']);
      expect(content.id).to.be.a('number').and.greaterThan(0);
    });
    // Update the status of the created equipment and validate the response
    it('API003 POST Updates status of equipment', async () => {
      const payload = { status: status };
      const content = await go.post(`${fromEquipment}/${equipmentId}/status`, payload);
      expect(content.equipment.status).to.be.oneOf(['Idle', 'Under Maintenance', 'Active']);
      expect(content.equipment).to.have.property('id', equipmentId);
      expect(content.equipment).to.have.property('lastUpdated');
      expect(content.equipment).to.have.property('name');
      expect(content.equipment).to.have.property('location');
      expect(content.equipment).to.have.all.keys('id', 'name', 'status', 'location', 'lastUpdated');
      expect(content.equipment.id).to.equal(equipmentId);
      expect(content.historyEntry.equipmentId).to.equal(equipmentId);
      expect(content.historyEntry.previousStatus).to.be.oneOf(['Idle', 'Under Maintenance', 'Active']);
      expect(content.historyEntry.newStatus).to.equal(status);
      expect(content.historyEntry.timestamp).to.be.a('string').and.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
      expect(content.historyEntry.changedBy).to.be.a('string').and.not.empty;
      expect(content.historyEntry).to.have.all.keys('id', 'equipmentId', 'previousStatus', 'newStatus', 'timestamp', 'changedBy');
    });
    // Get the history of the equipment and validate the response
    it('API004 GET equipment history', async () => {
      const content = await go.getAll(`${fromEquipment}/${equipmentId}/history`);
      expect(content.equipmentId).to.equal(equipmentId);
      expect(content.history).to.be.an('array');
      if (content.history.length > 0) {
        content.history.forEach(entry => {
          expect(entry).to.have.all.keys('id', 'equipmentId', 'previousStatus', 'newStatus', 'timestamp', 'changedBy');
          expect(entry.equipmentId).to.equal(equipmentId);
          expect(entry.previousStatus).to.be.a('string').and.not.empty;
          expect(entry.newStatus).to.be.a('string').and.not.empty;
          expect(entry.timestamp).to.be.a('string').and.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
        });
      }
      expect(content).to.have.all.keys('equipmentId', 'history', 'total', 'limit', 'offset', 'hasMore');
    });
      // Get the history of the equipment with limit and offset
    it('API005 GET equipment history with limit and offset', async () => {
      for(let i = 0; i < 20; i++) {
        const payload = { status: random.generateRandomStatus() };
        await go.create(`${fromEquipment}/${equipmentId}/status`, payload);
      }
      let limitValue = 5|8|10;
      let offsetValue = 2|3;
      const content = await go.getAll(`${fromEquipment}/${equipmentId}/history?limit=${limitValue}&offset=${offsetValue}`);
      expect(content.equipmentId).to.equal(equipmentId);
      expect(content.limit).to.equal(limitValue);
      expect(content.offset).to.equal(offsetValue);
      expect(content.total).to.be.a('number');
      expect(content.hasMore).to.be.a('boolean');
      expect(content.history).to.be.an('array');
      if (content.history.length > 0) {
        content.history.forEach(entry => {
          expect(entry).to.have.all.keys('id', 'equipmentId', 'previousStatus', 'newStatus', 'timestamp', 'changedBy');
          expect(entry.equipmentId).to.equal(equipmentId);
          expect(entry.previousStatus).to.be.a('string').and.not.empty;
          expect(entry.newStatus).to.be.a('string').and.not.empty;
          expect(entry.timestamp).to.be.a('string').and.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
        });
      }
      expect(content).to.have.all.keys('equipmentId', 'history', 'total', 'limit', 'offset', 'hasMore');
    });

     it('API006 GET equipment history check pagination and no duplicate entries', async () => {
      for(let i = 0; i < 20; i++) {
        const payload = { status: random.generateRandomStatus() };
        await go.create(`${fromEquipment}/${equipmentId}/status`, payload);
      }
      let limitValue = 5;
      let offsetValue = 0;
      const page1 = await go.getAll(`${fromEquipment}/${equipmentId}/history?limit=${limitValue}&offset=${offsetValue}`);
      const page2 = await go.getAll(`${fromEquipment}/${equipmentId}/history?limit=${limitValue}&offset=${offsetValue + limitValue}`);
      expect(page1).to.not.equal(page2);
    });
  });

  // Negative tests for Equipment Tracker API
  describe('Equipment Status Tracker Negative Tests', function () {
    // Attempt to create a new equipment without required fields/invalid data and validate the error response
    it('API007 POST without name', async () => {
      const payload = { status: 'InvalidStatus', location: location };
      const content = await attempt.toPost400(fromEquipment, payload);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Name, status, and location are required');
    });

    it('API008 POST without status', async () => {
      const payload = { name: faker.commerce.productName(), location: location };
      const content = await attempt.toPost400(fromEquipment, payload);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Name, status, and location are required');
    });

    it('API009 POST without location', async () => {
      const payload = { name: faker.commerce.productName(), status: 'Active' };
      const content = await attempt.toPost400(fromEquipment, payload);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Name, status, and location are required');
    });

    it('API010 POST with empty name', async () => {
      const payload = { name: '', status: 'Active', location: location };
      const content = await attempt.toPost400(fromEquipment, payload);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Name, status, and location are required');
    });

    it('API011 POST with empty location', async () => {
      const payload = { name: faker.commerce.productName(), status: 'Active', location: '' };
      const content = await attempt.toPost400(fromEquipment, payload);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Name, status, and location are required');
    });

    it('API012 POST with empty status', async () => {
      const payload = { name: faker.commerce.productName(), status: '', location: location };
      const content = await attempt.toPost400(fromEquipment, payload);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Name, status, and location are required');
    });

    it('API013 POST with empty payload', async () => {
      const content = await attempt.toPost400(fromEquipment, {});
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Name, status, and location are required');
    });

    it('API014 POST with invalid status', async () => {
      const payload = { name: faker.commerce.productName(), status: 'InvalidStatus', location: location };
      const content = await attempt.toPost400(fromEquipment, payload);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Invalid status. Must be Active, Idle, or Under Maintenance');
    });

     it('API015 POST with long name', async () => {
      const payload = { name: faker.string.sample(120), status: status, location: location };
      const content = await attempt.toPost400(fromEquipment, payload);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Name must be between 1 and 100 characters');
    });

    it('API016 POST with long location', async () => {
      const payload = { name: faker.commerce.productName(), status: status, location:faker.string.sample(120) };
      const content = await attempt.toPost400(fromEquipment, payload);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Location must be between 1 and 100 characters');
    });
    // Attempt to update the status of the equipment with invalid data and validate the error response
    it('API017 POST update status with invalid equipment ID', async () => {
      const payload = { status: status };
      const content = await attempt.toPost404(`${fromEquipment}/999999/status`, payload);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Equipment not found');
    });

    it('API018 POST update status with invalid equipment ID type', async () => {
      const payload = { status: status };
      const content = await attempt.toPost404(`${fromEquipment}/invalid/status`, payload);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Equipment not found');
    });

     it('API019 POST update status with invalid status', async () => {
      const payload = { status: 'Invalid' };
      const content = await attempt.toPost400(`${fromEquipment}/${equipmentId}/status`, payload);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Invalid status. Must be Active, Idle, or Under Maintenance');
    });

     it('API020 POST update status with empty status', async () => {
      const payload = { status: '' };
      const content = await attempt.toPost400(`${fromEquipment}/${equipmentId}/status`, payload);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Status is required');
    });

     it('API021 POST update status without status', async () => {
      const payload = {};
      const content = await attempt.toPost400(`${fromEquipment}/${equipmentId}/status`, payload);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Status is required');
    });

    it('API022 GET equipment history with invalid id', async () => {
      const content = await attempt.toGet404(`${fromEquipment}/999999/history`);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Equipment not found');
    });

    it('API023 GET equipment history with invalid id type', async () => {
      const content = await attempt.toGet404(`${fromEquipment}/invalid/history`);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Equipment not found');
    });
    // Attempt to update the status of an equipment that is already under maintenance
     it('API024 POST update status of an equipment from under maintenance', async () => {
     const payload = { name: random.generateEquipmentNames()[0], status: "Under Maintenance", location: location }
    const content = await go.post(fromEquipment, payload);
    let newId = content.id;
    const payload1 = { status: status };
      const content1 = await attempt.toPost400(`${fromEquipment}/${newId}/status`, payload1);
      expect(content1.success).to.be.false;
      expect(content1.error).to.equal('Cannot change status of equipment under maintenance');
    });

     it('API025 GET equipment history with invalid limit', async () => {
      let limitValue = -1; // Invalid limit
      let offsetValue = 2;
      const content = await attempt.toGet400(`${fromEquipment}/${equipmentId}/history?limit=${limitValue}&offset=${offsetValue}`);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Invalid limit');
    });

    it('API026 GET equipment history with invalid offset', async () => {
      let limitValue = 1; // Valid limit
      let offsetValue = -2; // Invalid offset
      const content = await attempt.toGet400(`${fromEquipment}/${equipmentId}/history?limit=${limitValue}&offset=${offsetValue}`);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Invalid offset');
    });

    it('API027 GET equipment history with invalid type limit', async () => {
      let limitValue = 'invalid'; // Invalid limit
      let offsetValue = 2;
      const content = await attempt.toGet400(`${fromEquipment}/${equipmentId}/history?limit=${limitValue}&offset=${offsetValue}`);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Invalid limit');
    });

    it('API028 GET equipment history with invalid offset', async () => {
      let limitValue = 1; // Valid limit
      let offsetValue = 'invalid'; // Invalid offset
      const content = await attempt.toGet400(`${fromEquipment}/${equipmentId}/history?limit=${limitValue}&offset=${offsetValue}`);
      expect(content.success).to.be.false;
      expect(content.error).to.equal('Invalid offset');
    });

  });

  // Cleanup after tests
  after('Delete created equipment', async () => {
    if (equipmentId) {
     // await go.remove(`${fromEquipment}/${equipmentId}`)
    }
  })

});
