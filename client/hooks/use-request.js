import axios from 'axios'
import React from 'react'
const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = React.useState(null)
    const doRequest = async (props={}) => {
        try {
            const response = await axios[method](url, {
                ...body, ...props
            });
            setErrors(null)
            if (onSuccess) {
                onSuccess(response)
            }
        } catch (err) {
            const errors = err.response?.data?.errors || [{ message: 'Something went wrong' }]
            setErrors(
                <div className="alert alert-danger" role="alert">
                    <ul>
                        {
                            errors.map((error, index) => {
                                return <li key={index}>{error.message}</li>
                            })
                        }
                    </ul>
                </div>
            )
        }
    }
    return [doRequest, errors]
}

export default useRequest