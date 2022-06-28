import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = React.useState(0);
    const [doRequest, error] = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => {
            Router.push('/orders', undefined, { shallow: true })
        }
    })
    React.useEffect(() => {
        const updateTimeLeft = () => {
            const now = new Date();
            const event = new Date(order.expiresAt);
            const timeLeft = event - now;
            setTimeLeft(Math.round(timeLeft / 1000));
        }
        updateTimeLeft();
        const interval = setInterval(updateTimeLeft, 1000);
        return () => clearInterval(interval);
    }, [order])
    return (
        <div className='card p-3 my-5'>
            {
                timeLeft > 0 ?
                    <div>
                        <h4>Your order is waiting payment</h4>
                        <p style={{ color: 'red' }}>{timeLeft} seconds left before the order expires</p>
                        <StripeCheckout 
                            token={token => doRequest({ token: token.id })}
                            stripeKey={"pk_test_51LFEuaG6TlU6io7fVbXocxuf7Vlb34f5Ap1cXtZbE34ARdGl6So5ccpasPocJUR0VC4CwKsRZuo68fs0uqtJ3LFV00iMIUwpl5"}
                            amount={order.ticket.price * 100}
                            email={currentUser.email}
                        />
                        {error}
                    </div> :
                    <div style={{ color: 'red' }}>Order Expired</div>
            }
        </div>

    );
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderid } = context.query;
    const { data } = await client.get(`/api/orders/${orderid}`);
    return { order: data };
}

export default OrderShow;
