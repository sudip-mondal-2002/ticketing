import React from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const Signup = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [signup, errors] = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            email,
            password
        },
        onSuccess: () => Router.push("/",undefined, { shallow: true })
    })
    const submitHandler = async (e) => {
        e.preventDefault();
        signup();
    }
    return (
        <form
            onSubmit={submitHandler}
            className="container">
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email</label>
                <input
                    className="form-control"
                    type="email"
                    placeholder="example@abc.com"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    className="form-control"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }} />
            </div>
            {errors}
            <button className="btn btn-primary">Sign Up</button>
        </form >
    )
}
export default Signup;