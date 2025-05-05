import mongoose from 'mongoose';
import Adoptions from '../../src/dao/Adoption.js';
import { expect } from 'chai';

import dotenv from 'dotenv';
dotenv.config();

describe('Adoptions DAO', () => {
    let mockAdoption;
    let adoptionId;
    before(async function(){
        mongoose.connect(process.env.URL_MONGO, () => {
            console.log('Connected to MongoDB');
        })
        this.adoptionsDao = new Adoptions();
        mockAdoption = await this.adoptionsDao.save({
            owner: process.env.OWNER_ID,
            pet: process.env.PET_ID,
        })
        let adoptionRes = await this.adoptionsDao.getBy({ _id: mockAdoption._id })
        adoptionId = adoptionRes._id
    })
    it('Debe comprobar que se creó una adopción', async function(){
        const res = await this.adoptionsDao.getBy({ _id: mockAdoption._id })
        expect(res).to.be.an('object')
        expect(res.name).to.be.equal(mockAdoption.name)
        expect(res.type).to.be.equal(mockAdoption.type)
        expect(res.owner.toString()).to.be.equal(mockAdoption.owner.toString())
    })
    it('Debe retornar todas las adopciones', async function(){
        const res = await this.adoptionsDao.get()
        expect(res).to.be.an('array')
        expect(res.length).to.be.greaterThan(0)
    })
    it('Debe retornar una adopción por id', async function(){
        const res = await this.adoptionsDao.getBy(adoptionId)
        expect(res.owner.toString()).to.be.equal(process.env.OWNER_ID)
        expect(res.pet.toString()).to.be.equal(process.env.PET_ID)
    })
    it('Debe actualizar una adopción', async function(){
        const newPet = process.env.NEW_PET_ID
        await this.adoptionsDao.update(adoptionId,{ pet: newPet })
        const updatedAdoption = await this.adoptionsDao.getBy(adoptionId)
        expect(updatedAdoption.owner.toString()).to.be.equal(process.env.OWNER_ID)
        expect(updatedAdoption.pet.toString()).to.be.equal(process.env.NEW_PET_ID)
    })
    it('Debe eliminar una adopción', async function(){
        const res = await this.adoptionsDao.delete(adoptionId)
        expect(res).to.be.an('object')
        expect(res._id.toString()).to.be.equal(adoptionId.toString())
    })
    after(async function(){
        await mongoose.connection.close()
    })
})