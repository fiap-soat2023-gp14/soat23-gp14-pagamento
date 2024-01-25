import { ValidationException } from "src/infrastructure/exceptions/ValidationException"
import { CPF } from "./Cpf"

describe('CPF', () => {
    describe('CPF.create', () => {
        it('should create CPF with sanitized value', async () => {
            // arrange
            const cpf = "123.456.789-10"
            
            // act
            const actual = await CPF.create(cpf)

            // assert
            expect(actual).toBeInstanceOf(CPF)
            expect(actual.value).toBe('12345678910')
        })

        it('should create CPF when is only numbers', async () => {
            // arrange
            const cpf = "12345678910"

            // act
            const actual = await CPF.create(cpf)

            // assert
            expect(actual).toBeInstanceOf(CPF)
            expect(actual.value).toBe('12345678910')

        })
    })

    describe('CPF.validate', () => {
        it('should return error when cpf is invalid length', async () => {
            // arrange
            const cpf = "1"
    
            // act
            const actual = await CPF.create(cpf)
    
            // assert
            expect(actual).toBeInstanceOf(CPF)
            expect(actual.validate()).rejects.toThrow(ValidationException)
        })

        it('should return error when cpf verification code is invalid', async () => {
            // arrange
            const cpf = "12345678900"
    
            // act
            const actual = await CPF.create(cpf)
    
            // assert
            expect(actual).toBeInstanceOf(CPF)
            expect(actual.validate()).rejects.toThrow(ValidationException)
        })
    })
})