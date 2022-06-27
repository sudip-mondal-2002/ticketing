export const stripe = {
    charges: {
        create: jest.fn().mockReturnValue({ 
            id: 'ch_1Fakjx'
        })
    }
}