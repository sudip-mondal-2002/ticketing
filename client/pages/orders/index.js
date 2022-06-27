import React from 'react';
import Link from 'next/link';

const Orders = ({ orders }) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Order Id</th>
                    <th>Ticket Id</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {
                    orders.map(order => {
                        return (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>
                                    <Link href="/tickets/[ticketid]" as={`/tickets/${order.ticket.id}`}>
                                        {order.ticket.id}
                                    </Link>
                                </td>
                                <td>{order.status}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
}

Orders.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders')
    return { orders: data }
}

export default Orders;
