import React from 'react';
import Link from 'next/link';
const Navbar = ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        currentUser && { label: 'Sell a ticket', href: '/tickets/new' },
        currentUser && { label: 'My Orders', href: '/orders' },
        currentUser && { label: 'Sign Out', href: '/auth/signout' }
    ].filter(l => l).map(link => {
        return <Link key={link.href} href={link.href}>
            <a className="nav-link">{link.label}</a>
        </Link>
    })
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light px-5">
                <Link href="/">
                    <a className="navbar-brand">Ticketing</a>
                </Link>
                <div className="d-flex justify-content-end">
                    <ul className="nav d-flex align-items-center">
                        {links}
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
