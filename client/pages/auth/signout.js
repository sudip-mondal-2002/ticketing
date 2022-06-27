import React from 'react';
import useRequest from './../../hooks/use-request';
import Router from 'next/router';

const Signout = () => {
    const [ doRequest, errors ] = useRequest({
        method: 'post',
        url: '/api/users/signout',
        body:{},
        onSuccess: () => {
            Router.push("/")
        }
    });
    React.useEffect(() => {
        doRequest();
    },[])

    return (
        <div>
            Signing you out...
            {errors}
        </div>
    );
}

export default Signout;
