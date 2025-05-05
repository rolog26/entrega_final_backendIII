import mongoose from 'mongoose';
import Pets from '../../src/dao/Pets.dao.js';
import { expect } from 'chai';

import dotenv from 'dotenv';
dotenv.config();

describe('Pets DAO', () => {
    let mockPet;
    let petId;
    before(async function(){
        mongoose.connect(process.env.URL_MONGO, () => {
            console.log('Connected to MongoDB');
        })
        this.petsDao = new Pets();
        mockPet = await this.petsDao.save({
            name: 'Treya',
            specie: 'cat',
            birthDate: new Date('2020-01-01'),
        })
        let petRes = await this.petsDao.getBy({ name: 'Treya' })
        petId = petRes._id
    })
    it('Debe comprobar que se creó un pet', async function(){
        const res = await this.petsDao.getBy({ _id: mockPet._id })
        expect(res).to.be.an('object')
        expect(res.name).to.be.equal(mockPet.name)
        expect(res.type).to.be.equal(mockPet.type)
        expect(res.owner).to.be.equal(mockPet.owner)
    })
    it('Debe retornar todos los pets', async function(){
        const res = await this.petsDao.get()
        expect(res).to.be.an('array')
        expect(res.length).to.be.greaterThan(0)
    })
    it('Debe retornar un pet por id', async function(){
        const res = await this.petsDao.getBy(petId)
        expect(res.name).to.be.equal('Treya')
        expect(res.specie).to.be.equal('cat')
    })
    it('Debe actualizar un pet', async function(){
        const newName = 'Max'
        await this.petsDao.update(petId,{ name: newName })
        const updatedPet = await this.petsDao.getBy(petId)
        expect(updatedPet.name).to.be.equal('Max')
    })
    it('Debe eliminar un pet', async function(){
        const res = await this.petsDao.delete(petId)
        expect(res).to.be.an('object')
        expect(res._id.toString()).to.be.equal(petId.toString())
    })
    after(async function(){
        await mongoose.connection.close()
    })
})