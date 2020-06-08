import request from 'supertest';
import { app } from './../server';
import { startDB, stopDB } from './../__mocks__/db';

import { userData } from './../__mocks__/user';

describe('Stocks', () => {
    let token;
    
    beforeAll(async () => {
        startDB();
        await request(app).post('/auth/signup').send(userData);
        let signUserIn = await request(app).post('/auth/signin').send(userData);
        token = signUserIn.header['set-cookie'];
    });

    afterAll(async() => {
        stopDB();
    });
 
    it('creates a new stock with owner', async () => {
        const result = await request(app).post('/api/stock').set('Cookie', token)
        expect(result.statusCode).toBe(200);
    });

    it('fails to create stock without being loggedin', async () => {
        const result = await request(app).post('/api/stock')
        expect(result.statusCode).toBe(401);
    });

    it('Returns 200 with empty items', async () => {
        const result = await request(app).get('/api/stock').set('Cookie', token)
        expect(result.statusCode).toBe(200);
        expect(result.body).toHaveProperty('data');

    });
})