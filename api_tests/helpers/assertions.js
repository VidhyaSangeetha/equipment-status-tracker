const request = require('supertest')
const app = process.env.BASE_URL
const { expect } = require('chai');
const attempt = require('../helpers/assertions')

const toGet400 = async (module) => {
    const start = Date.now();
    const res = await request(app)
        .get(module)
        .expect(400)
    const elapsed = Date.now() - start;
    console.log(`Response time for ${module}: ${elapsed} ms`);
    expect(elapsed).to.be.below(1000);
    const { error } = res.body
    return error
}

const toGet404 = async (module) => {
    const start = Date.now();
    const res = await request(app)
        .get(module)
        .expect(404)
    const elapsed = Date.now() - start;
    console.log(`Response time for ${module}: ${elapsed} ms`);
    expect(elapsed).to.be.below(1000);
    const { error } = res.body
    return error
}

const toPost400 = async (module, data) => {
    const start = Date.now();
    const res = await request(app)
        .post(module)
        .send(data)
        .expect(400)
    const elapsed = Date.now() - start;
    console.log(`Response time for ${module}: ${elapsed} ms`);
    expect(elapsed).to.be.below(1000);
    return res.body
}

const toPost404 = async (module, data) => {
    const start = Date.now();
    const res = await request(app)
        .post(module)
        .send(data)
        .expect(404)
    const elapsed = Date.now() - start;
    console.log(`Response time for ${module}: ${elapsed} ms`);
    expect(elapsed).to.be.below(1000);
    return res.body
}

module.exports = {
    toGet400,
    toPost400,
    toPost404,
    toGet404
}