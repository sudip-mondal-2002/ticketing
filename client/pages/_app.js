import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import buildClient from '../api/build-client';
import Navbar from '../components/navbar';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <>
            <Navbar currentUser={currentUser} />
            <div className='container'>
                <Component {...pageProps} currentUser={currentUser} />
            </div>
        </>
    )
}

AppComponent.getInitialProps = async (appContext) => {
    try {
        const client = buildClient(appContext.ctx);
        const { data } = await client.get('/api/users/currentuser')
        let pageProps = {};
        if (appContext.Component.getInitialProps) {
            pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
        }
        return {
            pageProps,
            ...data
        }
    } catch {
        return {
            currentUser: null
        }
    }
}
export default AppComponent;
