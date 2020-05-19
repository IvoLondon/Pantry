import request from 'supertest';
import { app } from './../server';
import { Item } from './../resources/item/item.model';
import { userData } from './../__mocks__/user';
import { itemData } from './../__mocks__/item';
import { startDB, stopDB } from './../__mocks__/db';
import mongoose from 'mongoose';

describe('Items', () => {
    let token;
    
    beforeAll(async () => {
        startDB();
        await request(app).post('/auth/signup').send(userData);
        let signUserIn = await request(app).post('/auth/signin').send(userData);
        token = signUserIn.header['set-cookie'];
    })

    afterAll(async() => {
        stopDB();
    })

    it('creates a new item', async () => {
        const result = await request(app).post('/api/item').send(itemData).set('Cookie', token)
        expect(result.statusCode).toBe(201);
        expect(result.body.data).toHaveProperty('barcodeId', itemData.barcodeId);
    });

    it('cannot create two items with the same barcode ID', async () => {
        await request(app).post('/api/item').send(itemData).set('Cookie', token)
        const result = await request(app).post('/api/item').send(itemData).set('Cookie', token)

        expect(result.statusCode).toBe(400);
        expect(result.body).toHaveProperty('message');
    });

    it('cannot create item without barcode ID', async () => {
        let noBarcodeItem = { ...itemData, barcodeId: '' }
        const result = await request(app).post('/api/item').send(noBarcodeItem).set('Cookie', token)

        expect(result.statusCode).toBe(400);
    });

    it('returns all existing items and delete one', async () => {
        await request(app).post('/api/item').send(itemData).set('Cookie', token);
        await request(app).post('/api/item').send({...itemData, barcodeId: "12345678"}).set('Cookie', token);

        const result = await request(app).get('/api/item').set('Cookie', token);

        expect(result.statusCode).toBe(200);
        expect(result.body).toHaveProperty('data');
        expect(result.body.data).toHaveLength(2);
    });

    it('deletes one item and returns the rest', async () => {
        let secondItem = {...itemData, barcodeId: "12345678"};
        await request(app).post('/api/item').send(itemData).set('Cookie', token);
        await request(app).post('/api/item').send(secondItem).set('Cookie', token);
        const deletedItem = await request(app).delete('/api/item/12345678').set('Cookie', token);

        expect(deletedItem.statusCode).toBe(200);
        expect(deletedItem.body.data).toHaveProperty('barcodeId', secondItem.barcodeId);
        
        const result = await request(app).get('/api/item').set('Cookie', token);

        expect(result.statusCode).toBe(200);
        expect(result.body).toHaveProperty('data');
        expect(result.body.data).toHaveLength(1);
    });

    it('returns item by barcodeId', async () => {
        let secondItem = {...itemData, barcodeId: "12345678"};
        await request(app).post('/api/item').send(itemData).set('Cookie', token);
        await request(app).post('/api/item').send(secondItem).set('Cookie', token);
        
        const result = await request(app).get('/api/item/field').send({ barcodeId: itemData.barcodeId }).set('Cookie', token);

        expect(result.statusCode).toBe(200);
        expect(result.body).toHaveProperty('data');
        expect(result.body.data).toHaveProperty('name', itemData.name);
    });

    it('creates and updates an item by barcodeId', async () => {
        await request(app).post('/api/item').send(itemData).set('Cookie', token);
        
        const itemToUpdate = await request(app)
                                .get('/api/item/field')
                                .send({ barcodeId: itemData.barcodeId })
                                .set('Cookie', token);
        expect(itemToUpdate.body.data).toHaveProperty('_id');

        const updatedItem = await request(app)
                                .put(`/api/item/${itemToUpdate.body.data._id}`)
                                .send({ name: 'test updateItem'})
                                .set('Cookie', token);
        expect(updatedItem.body.data).toHaveProperty('barcodeId', itemData.barcodeId)
        expect(updatedItem.body.data).toHaveProperty('name', 'test updateItem');
    });

    describe('tests database directly', () => {
        it('errors if the barcode type is invalid', async () => {
            const withIncorrectBarcodeType = { ...itemData, barcodeType: 'ean_test' };
            const itemWithIncorrectBarcode = new Item(withIncorrectBarcodeType);
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
            const withIncorrectBarcodeId = { ...itemData, barcodeId: '' };
            const itemWithIncorrectBarcodeId = new Item(withIncorrectBarcodeId);
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