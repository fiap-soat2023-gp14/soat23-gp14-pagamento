import PaymentAdapter from "src/core/application/adapter/PaymentAdapter"

describe('PaymentAdapter', () => {
    it('should convert a paymentDTO to domain Payment', async () => {
        // arrange
        const paymentDTO = { 
            id: 123456,
            type: 'payment',
            status: 'approved',
            dateCreated: new Date(),
            data: { id: '42a72d17-0cdd-48ee-a03b-07502272e217'}
        }

        // act
        const actual = await PaymentAdapter.toDomain(paymentDTO)

        // assert
        expect(actual).toStrictEqual({
            type: 'payment',
            status: 'approved',
            orderId: '42a72d17-0cdd-48ee-a03b-07502272e217',
        })
    })
})