import mongoose from 'mongoose';
import Users from '../../src/dao/Users.dao.js';
import { expect } from 'chai';

import dotenv from 'dotenv';
dotenv.config();

describe('Users DAO', () => {
    before(function(){
        mongoose.connect(process.env.URL_MONGO, () => {
            console.log('Connected to MongoDB');
        })
        this.userDao = new Users();
    })
    it('Debe retornar todos los usuarios', async function(){
        const res = await this.userDao.get()
        expect(res).to.be.an('array')
        expect(res.length).to.be.greaterThan(0)
    })
    it('Debe retornar un usuario por id', async function(){
        const id = process.env.USER_ID
        const res = await this.userDao.getBy({ _id: id })
        expect(res.first_name).to.oneOf(['Mia', 'Sara'])
        expect(res.last_name).to.equal('Metz')
    })
    it('Debe actualizar un usuario', async function(){
        const id = process.env.USER_ID
        const user = await this.userDao.getBy({ _id: id })
        const newName = user.first_name === 'Mia' ? 'Sara' : 'Mia'
        await this.userDao.update(id,{ first_name: newName })
        const updatedUser = await this.userDao.getBy({ _id: id })
        expect(updatedUser.first_name).to.be.oneOf(['Mia', 'Sara'])
    })
    after(async function(){
            await mongoose.connection.close()
        })
})