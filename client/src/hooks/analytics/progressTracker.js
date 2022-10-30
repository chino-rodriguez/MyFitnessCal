import { useState } from "react";
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

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        let { fromDate, toDate, exercise } = dataObject;

        try {
            const res = await fetch(`/api/stats/setsOfExercise?exercise=${exercise}&fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            const data = await res.json();
            setResponse(data);
            if (data.redirect === "/") {
                window.location = "/";
            } else if (data.redirect === "/login") {
                window.location = "/login";
            }
            setError(null);
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
