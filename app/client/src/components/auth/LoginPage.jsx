import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authHook from '../../hooks/auth';
import {
    Typography,
    Stack,
    FormControl,
    FormLabel,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function LoginPage() {

    // State variable and handler that represents password visibility
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    // Login hook
    const { values, handleChange, handleKeyDown, handleSubmit, error, prevError } = authHook({
        initialValues: {
            username: '',
            password: '',
        },
        slug: 'api/auth/login'
    });

    // Setup to display feedback message -- error
    const [showError, setShowError] = useState(false);
    const [attempted, setAttempted] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }

    useEffect(() => {
        if (error) {
            setShowError(true);
            setAttempted(true);
            setTimeout(() => {
                setShowError(false);
            }, 4000)
        }
    }, [error, prevError]);

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >

            {/* Heading */}
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>

            {/* Form fields */}
            <Stack spacing={2} sx={{ mb: '1rem' }}>

                {/* Username input */}
                <FormControl>
                    <FormLabel>Username</FormLabel>
                    <TextField
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        error={attempted && (!values.username || values.username === "")}
                        required >
                    </TextField>
                </FormControl>

                {/* Password input */}
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <TextField
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        error={attempted && (!values.username || values.password === "")}


                        // endAdornment represents show / hide password button
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }}

                        required>
                    </TextField>
                </FormControl>
            </Stack>

            {/* Submit button */}
            <Button
                onClick={handleSubmit}
                type="submit"
                color="primary"
                variant="contained"
                sx={{ mb: '1rem' }}
            > Login
            </Button>

            {/* Feedback message -- error */}
            {error && showError && <Alert severity="error" onClose={handleCloseError}>{error}</Alert>}

            {/* Link to Register page */}
            <Typography>New user? <Link to="/register">Register</Link></Typography>
        </Stack>
    )
}

export default LoginPage;