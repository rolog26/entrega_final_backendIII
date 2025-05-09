import { expect } from 'chai';
import supertest from 'supertest';

import dotenv from 'dotenv';
dotenv.config();

const requester = supertest(`http://localhost:${process.env.PORT}`);

describe('Rutas de usuarios', () => {
    it('Debe obtener todos los usuarios de /api/users [GET]', async () => {
        const { statusCode, body } = await requester.get('/api/users');
        expect(statusCode).to.be.equal(200);
        expect(body.payload).to.be.an('array');
        expect(body.payload.length).to.be.greaterThan(0);
    })
    it('Debe obtener un usuario de /api/users/:uid [GET]', async () => {
        const { statusCode, body } = await requester.get('/api/users');
        if (body.payload.length === 0) {
            throw new Error('No hay usuarios para obtener');
        }
        const user = body.payload[body.payload.length - 1];
        const { statusCode: getStatusCode, body: getBody } = await requester.get(`/api/users/${user._id}`);
        expect(getStatusCode).to.be.equal(200);
        expect(getBody).to.have.property('status', 'success');
        expect(getBody.payload).to.have.property('_id', user._id);
    })
    it('Debe actualizar un usuario en /api/users/:uid [PUT]', async () => {
        const { statusCode, body } = await requester.get('/api/users');
        if (body.payload.length === 0) {
            throw new Error('No hay usuarios para actualizar');
        }
        const user = body.payload[body.payload.length - 1];
        const userUpdateBody = {
            first_name: 'Juan',
            last_name: 'Pérez',
            email: 'juan.perez@gmail.com',
            password: '123asd'
        }
        const { statusCode: updateStatusCode, body: updateBody } = await requester.put(`/api/users/${user._id}`).send(userUpdateBody);
        expect(updateStatusCode).to.be.equal(200);
        expect(updateBody).to.have.property('message', 'User updated');
        const { statusCode: afterStatusCode, body: afterBody } = await requester.get('/api/users');
        expect(afterStatusCode).to.equal(200);
        const updatedUser = afterBody.payload.find(u => u._id === user._id);
        expect(updatedUser).to.have.property('first_name', userUpdateBody.first_name);
    })
    it('Debe eliminar un usuario en /api/users/:uid [DELETE]', async () => {
        const { statusCode, body } = await requester.get('/api/users');
        if (body.payload.length === 0) {
            throw new Error('No hay usuarios para eliminar');
        }
        const user = body.payload[body.payload.length - 1];
        const { statusCode: deleteStatusCode, body: deleteBody } = await requester.delete(`/api/users/${user._id}`);
        expect(deleteStatusCode).to.be.equal(200);
        expect(deleteBody).to.have.property('message', 'User deleted');
        const { statusCode: afterStatusCode, body: afterBody } = await requester.get('/api/users');
        expect(afterStatusCode).to.equal(200);
        const exists = afterBody.payload.some(u => u._id === user._id);
        expect(exists).to.be.false;
    })
})