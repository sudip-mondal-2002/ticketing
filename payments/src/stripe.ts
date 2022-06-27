import Stripe from 'stripe';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const stripe = new Stripe(process.env.STRIPE_KEY!,{
    apiVersion: '2020-08-27',
});
