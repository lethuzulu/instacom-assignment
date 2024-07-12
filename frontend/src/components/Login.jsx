import React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

export default function SignIn() {
    const navigate = useNavigate()

    const { register, handleSubmit} = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const handleSuccess = (data) => {
        localStorage.setItem('token', data)
        alert('Sign In Succesful!')
        navigate('/leads')
    }

    const handleError = (error) => {
        alert(
            `Status Code: ${error.response.status} \nMessage: ${
                error.response.data || error.message
            }`
        )
    }

    const signIn = async (data) => {
        const response = await axios.post(
            'http://localhost:8000/auth/login',
            data
        )
        return response.data
    }

    const { mutate } = useMutation({
        mutationFn: signIn,
        onSuccess: handleSuccess,
        onError: handleError,
    })

    const onSubmit = (data) => {
        mutate(data)
    }

    return (
        <Container
            component='main'
            maxWidth='xs'>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography
                    component='h1'
                    variant='h5'>
                    Sign in
                </Typography>
                <Box
                    component='form'
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={{ mt: 1 }}>
                    <TextField
                        margin='normal'
                        fullWidth
                        label='Email Address'
                        {...register('email')}
                    />
                    <TextField
                        margin='normal'
                        fullWidth
                        label='Password'
                        type='password'
                        {...register('password')}
                    />
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid
                            item
                            xs></Grid>
                        <Grid item>
                            <Link to='/signup'>
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}
