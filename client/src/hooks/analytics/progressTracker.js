import { useState } from "react";
import axios from "axios";
import { isBefore } from 'date-fns';

// ------ This hook submits the forms in the ExerciseProgress component with a GET reqyest; its values are {fromDate, toDate, exercise} ------
// form values are passed in the query string as they do not contain sensitive information, simply user selections of the filters
export default function useForm({ initialValues }) {
    const [values, setValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [prevError, setPrevError] = useState(null);
    const [response, setResponse] = useState(null);

    //track form values
    const handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        setValues({
            ...values,
            [name]: value,
        });
    };

    //submit form when enter key is pressed
    const handleKeyDown = (event) => {
        const enter = 13;
        if (event.keyCode === enter) {
            handleSubmit(event);
        }
    };

    const validateInputs = (values) => {
        if (!prevError || (error !== prevError)) {
            setPrevError(error);
        } else {
            setPrevError(null);
        }
        const { exercise, fromDate, toDate, exerciseOptions } = values;

        // Empty fields
        if (exercise === "" || !fromDate || !toDate) {
            setError("Please fill out empty fields.");
            return false;
        }
        // End date <= start date
        else if (isBefore(toDate, fromDate)) {
            setError("End date must come after start date.");
            return false;
        }
        // Invalid muscle group
        else if (exerciseOptions.indexOf(exercise) === -1) {
            setError("Invalid muscle group.");
            return false;
        }

        return true;
    };

    //submit form when submit button is clicked
    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateInputs(values)) {
            submitData({ values });
        }
    };

    const baseUrl = process.env.REACT_APP_HOME_URL || "http://localhost:5000";

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        let { fromDate, toDate, exercise } = dataObject;

        try {
            await axios({
                method: "GET",
                url: `${baseUrl}/api/stats/setsOfExercise?exercise=${exercise}&fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`,
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }),
                withCredentials: true,
            }).then((res) => {
                setResponse(res.data);
                if (res.data.redirect === "/") {
                    window.location = "/";
                } else if (res.data.redirect === "/login") {
                    window.location = "/login";
                }
                setError(null);
            });
        } catch (err) {
            // Handles identical, consecutive errors (else block)
            if (!prevError || (error !== prevError)) {
                setPrevError(error);
            } else {
                setPrevError(null);
            }

            // Extra line of defense in case empty dates somehow get past validateInputs(values) above
            if (err.message &&
                (err.message === "Cannot read properties of undefined (reading 'toISOString')"
                    || err.message === "Cannot read properties of null (reading 'toISOString')")
            ) {
                setError("Please select dates.");
            } else {
                setError(err.response.data.message);
            }
        }
    };
    return {
        handleChange,
        handleKeyDown,
        values,
        handleSubmit,
        error,
        prevError,
        response,
    };
}