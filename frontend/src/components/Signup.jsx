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
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {
    const navigate = useNavigate()

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            first_name: '',
            email: '',
            password: '',
        },
    })

    const handleSuccess = () => {
        //alert success message
        alert('Account Created Successfully')
        navigate('/signin')
        reset()
    }

    const handleError = (error) => {
        //alert error message
        alert(
            `Status Code: ${error.response.status} \nMessage: ${
                error.response.data || error.message
            }`
        )
    }

    const createUser = async (data) => {
        const response = await axios.post(
            'http://localhost:8000/auth/register',
            data
        )
        return response.data
    }

    const { mutate } = useMutation({
        mutationFn: createUser,
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
                    Sign up
                </Typography>
                <Box
                    id='submit-form'
                    component='form'
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ mt: 3 }}>
                    <Grid
                        container
                        spacing={2}>
                        <Grid
                            item
                            xs={12}>
                            <TextField
                                name='firstName'
                                fullWidth
                                id='firstName'
                                label='First Name'
                                {...register('first_name')}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}>
                            <TextField
                                fullWidth
                                id='email'
                                label='Email Address'
                                name='email'
                                {...register('email')}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}>
                            <TextField
                                fullWidth
                                label='Password'
                                type='password'
                                id='password'
                                {...register('password')}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        form='submit-form'
                        sx={{ mt: 3, mb: 2 }}>
                        Sign Up
                    </Button>
                    <Grid
                        container
                        justifyContent='flex-end'>
                        <Grid item>
                            <Link to='/signin'>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}
