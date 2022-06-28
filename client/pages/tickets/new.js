import React from 'react';
import useRequest from './../../hooks/use-request';
import Router from 'next/router';
const New = () => {
    const [title, setTitle] = React.useState('');
    const [price, setPrice] = React.useState('');
    const blurPriceHandler = () => {
        const value = parseFloat(price);
        if(isNaN(value)){
            return
        }
        setPrice(value.toFixed(2));
    }
    const [doRequest, errors] = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title,
            price
        },
        onSuccess: () => {
            setPrice('');
            setTitle('');
            Router.push('/', undefined, { shallow: true })
        }
    })
    const submitHandler = (e)=>{
        e.preventDefault();
        doRequest();
    }
    return (
        <div>
            <h1>Create a Ticket</h1>
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        className="form-control"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Price ($USD)</label>
                    <input
                        className="form-control"
                        type="number"
                        value={price}
                        onBlur={blurPriceHandler}
                        onChange={(event) => setPrice(event.target.value)}
                    />
                </div>
                <button className="btn btn-primary">Submit</button>
                {errors}
            </form>
        </div>
    );
}

export default New;
