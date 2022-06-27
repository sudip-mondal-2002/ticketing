export enum OrderStatus {
    // The order has been created but the ticket is not reserved yet.
    Created = 'created',
    // The order has been reserved.
    AwaitingPayment = 'awaiting:payment',
    // The order has been paid.
    Complete = 'complete',
    // The order has been cancelled.
    Cancelled = 'cancelled'
}