import { ValidationException } from '../../../infrastructure/exceptions/ValidationException';
import { Money } from './Money';

describe('Money', () => {
    describe('Money.create', () => {
        it('should create Money with value', async () => {
            // arrange
            const value = 100

            // act
            const actual = await Money.create(value)

            // assert
            expect(actual.value).toEqual(100);
            expect(actual.currency).toEqual('BRL');
        });
    });

    describe('validate', () => {
        it('should not throw an error when the value is valid', async () => {
            // arrange
            const value = 100

            // act
            const actual = await Money.create(value)

            // assert
            expect(actual.validate()).resolves.not.toThrow()
        });

        it('should throw a ValidationException when the value is negative', async () => {
            // arrange
            const value = -1

            // act
            const actual = await Money.create(value)

            // assert
            expect(actual.validate()).rejects.toThrow(ValidationException)
        });

        it('should throw a ValidationException when the value is equal to 0', async () => {
            // arrange
            const value = 0

            // act
            const actual = await Money.create(value)

            // assert
            expect(actual.validate()).rejects.toThrow(ValidationException)
        });
    });
});