import request from 'supertest';
import { app } from './../server';
import { Store } from './../resources/store/store.model';
import { userData } from './../__mocks__/user';
import { itemData } from './../__mocks__/store';
import { startDB, stopDB, clearDB } from './../__mocks__/db';
import mongoose from 'mongoose';

describe('Store items', () => {
    let token;
    
    beforeAll(async () => {
        startDB();
        await request(app).post('/auth/signup').send(userData);
        let signUserIn = await request(app).post('/auth/signin').send(userData);
        token = signUserIn.header['set-cookie'];
    });

    beforeEach(() => {
        clearDB();
    });

    afterAll(() => {
        stopDB();
    })

    it('creates a new item in store', async () => {
        const result = await request(app).post('/api/store').send(itemData.itemOne).set('Cookie', token)
        expect(result.statusCode).toBe(201);
        expect(result.body.data).toHaveProperty('barcodeId', itemData.itemOne.store.barcodeId);
    });

    it('cannot create two items in store with the same barcode ID', async () => {
        await request(app).post('/api/store').send(itemData.itemOne).set('Cookie', token)
        const result = await request(app).post('/api/store').send(itemData.itemOne).set('Cookie', token)
        expect(result.statusCode).toBe(400);
        expect(result.body).toHaveProperty('message');
    });

    it('cannot create item in store without barcode ID', async () => {
        let noBarcodeItem = { store: { ...itemData.itemOne, barcodeId: ''}}
        const result = await request(app).post('/api/store').send(noBarcodeItem).set('Cookie', token)

        expect(result.statusCode).toBe(400);
    });

    it('returns all existing items in store and delete one', async () => {
        await request(app).post('/api/store').send(itemData.itemOne).set('Cookie', token);
        await request(app).post('/api/store').send(itemData.itemTwo).set('Cookie', token);

        const result = await request(app).get('/api/store').set('Cookie', token);

        expect(result.statusCode).toBe(200);
        expect(result.body).toHaveProperty('data');
        expect(result.body.data).toHaveLength(2);
    }); 

    it('deletes one item in store and returns the rest', async () => {
        await request(app).post('/api/store').send(itemData.itemOne).set('Cookie', token);
        await request(app).post('/api/store').send(itemData.itemTwo).set('Cookie', token);
        const deletedItem = await request(app).delete('/api/store/12345').set('Cookie', token);

        expect(deletedItem.statusCode).toBe(200);
        expect(deletedItem.body.data).toHaveProperty('barcodeId', itemData.itemOne.store.barcodeId);
        
        const result = await request(app).get('/api/store').set('Cookie', token);

        expect(result.statusCode).toBe(200);
        expect(result.body.data[0]).toHaveProperty('barcodeId', itemData.itemTwo.store.barcodeId);
    });

    it('returns item from store by barcodeId', async () => {
        await request(app).post('/api/store').send(itemData.itemOne).set('Cookie', token);
        await request(app).post('/api/store').send(itemData.itemTwo).set('Cookie', token);
        
        const result = await request(app).get('/api/store/find')
                                .send({ barcodeId: itemData.itemOne.store.barcodeId })
                                .set('Cookie', token);

        expect(result.statusCode).toBe(200);
        expect(result.body).toHaveProperty('data');
        expect(result.body.data).toHaveProperty('name', itemData.itemOne.store.name);
    });

    it('creates and updates an item by barcodeId', async () => {
        await request(app).post('/api/store').send(itemData.itemOne).set('Cookie', token);
        
        const itemToUpdate = await request(app)
                                .get('/api/store/find')
                                .send({ barcodeId: itemData.itemOne.store.barcodeId })
                                .set('Cookie', token);
        expect(itemToUpdate.body.data).toHaveProperty('_id');

        const updatedItem = await request(app)
                                .put(`/api/store/${itemToUpdate.body.data._id}`)
                                .send({ name: 'test updateItem'})
                                .set('Cookie', token);
        expect(updatedItem.body.data).toHaveProperty('barcodeId', itemData.itemOne.store.barcodeId)
        expect(updatedItem.body.data).toHaveProperty('name', 'test updateItem');
    });

    describe('tests store with storage', () => {
        beforeAll(async () => {
            await request(app).post('/api/stock').set('Cookie', token)
        });

        it('creates a new item in store and adds it to storage', async () => {
            const result = await request(app).post('/api/store').send(itemData.itemWithStorageOne).set('Cookie', token)
            expect(result.statusCode).toBe(201);
            expect(result.body.data).toHaveProperty('barcodeId', itemData.itemWithStorageOne.store.barcodeId);
        });
    });

    describe('tests database directly', () => {
        it('errors if the barcode type is invalid', async () => {
            const withIncorrectBarcodeType = { store: { ...itemData, barcodeType: 'ean_test' }};
            const itemWithIncorrectBarcode = new Store(withIncorrectBarcodeType);
            let err;
    
            try {
                const saveItemWithIncorrectBarcode = await itemWithIncorrectBarcode.save();
                error = saveItemWithIncorrectBarcode;
            } catch (error) {
                err = error;
            }
    
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(err.errors.barcodeType).toBeDefined();
        });
    
        it('errors if the barcode id is missing', async () => {
            const withIncorrectBarcodeId = { store: { ...itemData, barcodeId: '' }};
            const itemWithIncorrectBarcodeId = new Store(withIncorrectBarcodeId);
            let err;
            try {
                const saveItemWithIncorrectBarcodeId = await itemWithIncorrectBarcodeId.save();
                err = saveItemWithIncorrectBarcodeId;
            } catch (error) {
                err = error;
            }
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(err.barcodeId).not.toBeDefined();
        });
    });
});