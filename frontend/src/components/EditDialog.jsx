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

export default function EditDialog({ open, setOpenEdit, details }) {
    console.log('details   ', details)
    const queryClient = useQueryClient()

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            first_name: details.first_name,
            last_name: details.last_name,
            email: details.email,
            phone: details.phone,
        },
    })

    const updateLead = async (data) => {
        let token = localStorage.getItem('token')
        const response = await axios.put(
            `http://localhost:8000/leads/${details.id}`,
            data,
            {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            }
        )
        return response.data
    }

    const handleSuccess = (data) => {
        queryClient.invalidateQueries({ queryKey: ['leads'] })
        handleToggle()
    }

    const handleError = (error) => {
        alert(error)
    }

    const { mutate } = useMutation({
        mutationFn: updateLead,
        onSuccess: handleSuccess,
        onError: handleError,
    })

    const handleToggle = () => {
        setOpenEdit((open) => !open)
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
                <DialogContentText>Edit Lead</DialogContentText>
                <Box
                    component='form'
                    onSubmit={handleSubmit(onSubmit)}
                    id='update-lead-form'>
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
                    form='update-lead-form'>
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    )
}
