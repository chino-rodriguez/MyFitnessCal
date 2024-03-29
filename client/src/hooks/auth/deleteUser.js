import { useState } from 'react';
import axios from 'axios';

// ------ Custom form control: submits AddSet and AddExercise forms and redirects to home if successful or login if unsuccessful ------
export default function useForm({ initialValues }) {
    const [values, setValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [prevError, setPrevError] = useState(null);

    //track form values
    const handleChange = event => {
        const value = event.target.value;
        const name = event.target.name;
        setValues({
            ...values,
            [name]: value
        });
    };

    //submit form when submit button is clicked
    const handleSubmit = event => {
        event.preventDefault();
        submitData({ values });
    };

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        let { userId } = dataObject;

        try {
            await axios({
                method: 'DELETE',
                url: `/api/auth/user?userId=${userId}`,
                withCredentials: true

            }).then(res => {
                if (res.data.redirect) {
                    window.location = res.data.redirect;
                }
            })
        } catch (err) {
            if (!prevError || (error !== prevError)) {
                setPrevError(error);
            } else {
                setPrevError(null);
            }
            setError(err.response.data.message);
        }
    };
    return {
        handleChange,
        values,
        handleSubmit,
        error,
        prevError
    }
}