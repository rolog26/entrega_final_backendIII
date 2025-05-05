import { createHash } from '../../src/utils/index.js'
import { expect } from 'chai'

describe('Manejo de contraseña', () => {
    it('Debe retornar una contraseña hasheada o que no sea la misma pasada por parámetro', async () => {
        const password = 'asd1234'
        const resultado = await createHash(password)
        expect(resultado).not.to.equal(password)
    })
})