const _ = require('lodash');

function generateEquipmentNames() {
const equipment = _.shuffle(['Excavator', 'Bulldozer', 'Backhoe', 'Loader', 'Crane']).slice(0, 1);
  return equipment.map(name => `${name}-${Date.now()}`);
}

function generateLocation() {
  const locations = ['Warehouse', 'Site A', 'Site B'];
  return _.first(_.shuffle(locations));
}

function generateRandomStatus() {
  const statuses = ['Active', 'Idle', 'Under Maintenance'];
  return _.sample(statuses);
}

module.exports = { generateEquipmentNames, generateLocation, generateRandomStatus };