import { ValueObject } from "./ValueObject";

class ConcreteValueObject extends ValueObject<{ prop1: string; prop2: number }> {}

describe('ValueObject', () => {
    describe('ValueObject.equals', () => {
        it('should return false when the compared object is null', () => {
            // arrange
            const valueObject = { prop1: 'value1', prop2: 100 }

            // act
            const actual = new ConcreteValueObject(valueObject).equals(null)

            // assert
            expect(actual).toBe(false);
        });

        it('should return false when the compared object is undefined', () => {
            // arrange
            const valueObject = { prop1: 'value1', prop2: 100 }

            // act
            const actual = new ConcreteValueObject(valueObject).equals(undefined)

            // assert
            expect(actual).toBe(false);
        });

        it('should return false when the compared object does not have properties', () => {
            // arrange
            const valueObject = { prop1: 'value1', prop2: 100 }
            const undefinedObject = {} as ValueObject<{ prop1: string; prop2: number }>

            // act
            const actual = new ConcreteValueObject(valueObject).equals(undefinedObject)

            // assert
            expect(actual).toBe(false);
        });

        it('should return false when the properties are different', () => {
            // arrange
            const valueObject1 = new ConcreteValueObject({ prop1: 'value1', prop2: 100 });
            const valueObject2 = new ConcreteValueObject({ prop1: 'value2', prop2: 200 });

            // act
            const actual = valueObject1.equals(valueObject2)

            // assert
            expect(actual).toBe(false);
        });

        it('should return false when the compared object has properties as undefined', () => {
            // arrange
            const valueObject1 = new ConcreteValueObject({ prop1: 'value1', prop2: 100 });
            const valueObject2 = new ConcreteValueObject({ prop1: 'value2', prop2: undefined });

            // act
            const actual = valueObject1.equals(valueObject2)

            // assert
            expect(actual).toBe(false);
        });

        it('should return true when the properties are the same', () => {
            // arrange
            const valueObject1 = new ConcreteValueObject({ prop1: 'value1', prop2: 100 });
            const valueObject2 = new ConcreteValueObject({ prop1: 'value1', prop2: 100 });

            // act
            const actual = valueObject1.equals(valueObject2)

            // assert
            expect(actual).toBe(true);
        });
    })
})

