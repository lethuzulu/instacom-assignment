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

export default function FilterByDateDialog({ open, setOpenDateFilter }) {
    const queryClient = useQueryClient()

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            start_date: '',
        },
    })

    const filterByDate = async (data) => {
        let token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8000/leads/', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
            params: { start_date: data.start_date, end_date: data.start_date },
        })
        return response.data
    }

    const handleSuccess = (data) => {
        queryClient.setQueryData(['leads'], data)
        handleToggle()
    }

    const handleError = (error) => {
        alert(
            `Status Code: ${error.response.status} \nMessage: ${
                error.response.data || error.message
            }`
        )
        console.log(error)
    }

    const { mutate } = useMutation({
        mutationFn: filterByDate,
        onSuccess: handleSuccess,
        onError: handleError,
    })

    const handleToggle = () => {
        setOpenDateFilter(!open)
        reset()
    }

    const onSubmit = (data) => {
        mutate(data)
    }

    return (
        <Dialog
            fullWidth={true}
            maxWidth={'sm'}
            open={open}
            onClose={handleToggle}>
            <DialogContent>
                <DialogContentText>
                    Use the format: YYYY--MM--DD
                </DialogContentText>
                <DialogContentText>E.g 2024-01-01</DialogContentText>
                <Box
                    id='filter-by-date'
                    component={'form'}
                    onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        placeholder='2024-01-01'
                        label='Start Date'
                        type={'text'}
                        margin={'dense'}
                        variant='standard'
                        fullWidth={true}
                        {...register('start_date')}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleToggle}>Cancel</Button>
                <Button
                    type='submit'
                    form='filter-by-date'>
                    Filter
                </Button>
            </DialogActions>
        </Dialog>
    )
}
