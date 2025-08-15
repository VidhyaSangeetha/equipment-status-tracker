const request = require('supertest')
const { expect } = require('chai');
require('dotenv').config()
const app = process.env.BASE_URL

const getAll = async (module) => {
    const start = Date.now();
    const response = await request(app)
        .get(module)
        .expect(200)
    const elapsed = Date.now() - start;
    console.log(`Response time for ${module}: ${elapsed} ms`);
    expect(elapsed).to.be.below(1000);
    return response.body.data;
}

const post = async (module, data) => {
    const start = Date.now();
    const res = await request(app)
        .post(module)
        .send(data)
        .expect([201, 200])
    const elapsed = Date.now() - start;
    expect(elapsed).to.be.below(1000);
    console.log(`Response time for ${module}: ${elapsed} ms`);
    return res.body.data
}

const remove = async (module) => {
    const start = Date.now();
    const res = await request(app)
        .delete(module)
        .expect([204, 200])
    const elapsed = Date.now() - start;
    expect(elapsed).to.be.below(1000);
    console.log(`Response time for ${module}: ${elapsed} ms`);
    return res.body.data
}

const get = async (module) => {
    const response = await request(app)
        .get(module)
    return response
}

const create = async (module, data) => {
    const res = await request(app)
        .post(module)
        .send(data)
    return res
}

module.exports = {
    getAll, post, remove,get,create
}