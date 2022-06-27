import React from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router'
const TicketShow = ({ticket}) => {
    const [doRequest, errors] = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order) => {
            Router.push('/orders/[orderId]', `/orders/${order.data.id}`)
        }
    })
    return (
        <div className='card p-3 my-5'>
            <h1>{ticket.title}</h1>
            <h4>Price $ {ticket.price}</h4>
            {errors}
            <button onClick={()=>doRequest()} className="btn btn-success">Purchase</button>
        </div>
    );
}

TicketShow.getInitialProps = async (context, client) => {
    const { ticketid } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketid}`);
    return { ticket: data };
}

export default TicketShow;

