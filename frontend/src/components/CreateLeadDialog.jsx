import React from 'react'
import {
    Dialog,
    Box,
    Button,
    DialogActions,
    DialogContent,
    TextField,
    DialogContentText,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function CreateLeadDialog({ open, setOpenCreate }) {
    const queryClient = useQueryClient()

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
        },
    })

    const createLead = async (data) => {
        let token = localStorage.getItem('token')
        const response = await axios.post(
            'http://localhost:8000/leads/',
            data,
            {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            }
        )
        return response.data
    }

    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['leads'] })
        handleToggle()
    }

    const handleError = (error) => {
        alert(
            `Status Code: ${error.response.status} \nMessage: ${
                error.response.data || error.message
            }`
        )
    }

    const { mutate } = useMutation({
        mutationFn: createLead,
        onSuccess: handleSuccess,
        onError: handleError,
    })

    const handleToggle = () => {
        setOpenCreate(!open)
        reset()
    }

    const onSubmit = (data) => {
        mutate(data)
    }

    return (
        <Dialog
            fullWidth={true}
            maxWidth={'md'}
            open={open}
            onClose={handleToggle}>
            <DialogContent>
                <DialogContentText>Create a New Lead</DialogContentText>
                <Box
                    component='form'
                    onSubmit={handleSubmit(onSubmit)}
                    id='lead-form'>
                    <TextField
                        label='First Name'
                        fullWidth={true}
                        type={'text'}
                        margin={'dense'}
                        variant={'standard'}
                        {...register('first_name')}
                    />
                    <TextField
                        label='Last Name'
                        fullWidth={true}
                        type={'text'}
                        margin={'dense'}
                        variant={'standard'}
                        {...register('last_name')}
                    />
                    <TextField
                        label='Email'
                        fullWidth={true}
                        type={'text'}
                        margin={'dense'}
                        variant={'standard'}
                        {...register('email')}
                    />
                    <TextField
                        label='Phone'
                        fullWidth={true}
                        type={'text'}
                        margin={'dense'}
                        variant={'standard'}
                        {...register('phone')}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleToggle}>Cancel</Button>
                <Button
                    type='submit'
                    form='lead-form'>
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    )
}
