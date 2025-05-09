import { expect } from 'chai';
import supertest from 'supertest';

import dotenv from 'dotenv';
dotenv.config();

const requester = supertest(`http://localhost:${process.env.PORT}`);

describe('Rutas de mascotas', () => {
    it('Debe obtener todas las mascotas de /api/pets [GET]', async () => {
        const { statusCode, body } = await requester.get('/api/pets');
        expect(statusCode).to.be.equal(200);
        expect(body.payload).to.be.an('array');
        expect(body.payload.length).to.be.greaterThan(0);
    })
    it('Debe crear una mascota en /api/pets [POST]', async () => {
        const mockPet = {
            name: 'Toto',
            specie: 'perro',
            birthDate: new Date('2020-01-01'),
        };
        const { statusCode, body } = await requester.post('/api/pets').send(mockPet);
        expect(statusCode).to.be.equal(200);
        expect(body.payload).to.have.property('_id');
        expect(body.payload).to.have.property('name', mockPet.name);
    })
    it('Debe crear una mascota con imagen en /api/pets/withimage [POST]', async () => {
        const imagePath = './public/images/toto.jpg';
        const { statusCode, body } = await requester
            .post('/api/pets/withimage')
            .attach('image', imagePath)
            .field('name', 'Toto')
            .field('specie', 'perro')
            .field('birthDate', '2020-01-01');
        expect(statusCode).to.be.equal(200);
        expect(body.payload).to.have.property('_id');
        expect(body.payload).to.have.property('image');
        expect(body.payload.image).to.include('toto.jpg');
    })
    it('Debe actualizar una mascota en /api/pets/:pid [PUT]', async () => {
        const { statusCode, body } = await requester.get('/api/pets');
        if (body.payload.length === 0) {
            throw new Error('No hay mascotas para actualizar');
        }
        const pet = body.payload[body.payload.length - 1];
        const petUpdateBody = {
            name: 'Draco',
            specie: 'perro',
            birthDate: new Date('2020-01-01'),
        };
        const { statusCode: updateStatusCode, body: updateBody } = await requester.put(`/api/pets/${pet._id}`).send(petUpdateBody);
        expect(updateStatusCode).to.be.equal(200);
        expect(updateBody).to.have.property('message', 'pet updated');
        const { statusCode: afterStatusCode, body: afterBody } = await requester.get('/api/pets');
        expect(afterStatusCode).to.equal(200);
        const updatedPet = afterBody.payload.find(p => p._id === pet._id);
        expect(updatedPet).to.have.property('name', petUpdateBody.name);
    })
    it('Debe eliminar una mascota en /api/pets/:pid [DELETE]', async () => {
        const { statusCode, body } = await requester.get('/api/pets');
        if (body.payload.length === 0) {
            throw new Error('No hay mascotas para eliminar');
        }
        const pet = body.payload[body.payload.length - 1];
        const { statusCode: deleteStatusCode, body: deleteBody } = await requester.delete(`/api/pets/${pet._id}`);
        expect(deleteStatusCode).to.be.equal(200);
        expect(deleteBody).to.have.property('message', 'pet deleted');
        const { statusCode: afterStatusCode, body: afterBody } = await requester.get('/api/pets');
        expect(afterStatusCode).to.equal(200);
        const exists = afterBody.payload.some(p => p._id === pet._id);
        expect(exists).to.be.false;
    })
})