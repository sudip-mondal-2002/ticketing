import React from "react"
import Link from 'next/link';
const Landing = ({ tickets }) => {
    return <div>
        <table className="table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                {
                    tickets.map(ticket => {
                        return <tr key={ticket.id}>
                            <td>{ticket.title}</td>
                            <td>{ticket.price}</td>
                            <td>
                                <Link href={"/tickets/[ticketId]"} as={`/tickets/${ticket.id}`}> Details </Link>
                            </td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    </div>
}

Landing.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/tickets')
    return { tickets: data }
}

export default Landing