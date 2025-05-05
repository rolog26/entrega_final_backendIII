import { expect } from 'chai';
import supertest from 'supertest';

import dotenv from 'dotenv';
dotenv.config();

const requester = supertest(`http://localhost:${process.env.PORT}`);

describe('Rutas de adopción', () => {
    it('Debe crear una adopción en /api/adoptions/:uid/:pid [POST]', async () => {
        const mockPet = {
            name: 'Toto',
            specie: 'perro',
            birthDate: new Date('2020-01-01'),
        };
        const userResponse = await requester.get(`/api/users/${process.env.USER_RESPONSE_ID}`);
        const userId = userResponse._body.payload._id;
        
        const petResponse = await requester.post('/api/pets').send(mockPet);
        const petId = petResponse._body.payload._id;
        
        const adoptionResponse = await requester.post(`/api/adoptions/${userId}/${petId}`);
        expect(adoptionResponse.statusCode).to.be.equal(200);
        expect(adoptionResponse._body).to.have.property('message', 'Pet adopted');
    })
    it('Debe obtener todas las adopciones de /api/adoptions [GET]', async () => {
        const { statusCode, _body } = await requester.get('/api/adoptions');
        expect(statusCode).to.be.equal(200);
        expect(_body.payload).to.be.an('array');
        expect(_body.payload.length).to.be.greaterThan(0);
    })
    it('Debe obtener una adopción por ID de /api/adoptions/:aid [GET]', async () => {
        const { _body } = await requester.get('/api/adoptions/');
        const adoption = _body.payload[0];
        const { statusCode, _body: adoptionResponse } = await requester.get(`/api/adoptions/${adoption._id}`);
        expect(statusCode).to.be.equal(200);
        expect(adoptionResponse.payload).to.have.property('_id', adoption._id);
    })
})