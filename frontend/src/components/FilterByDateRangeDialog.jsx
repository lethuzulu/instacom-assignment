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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export default function FilterByDateRangeDialog({ open, setOpenRangeFilter }) {
    const queryClient = useQueryClient()

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            start_date: '',
            end_date: '',
        },
    })

    const filterByRange = async (data) => {
        let token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8000/leads/', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
            params: { start_date: data.start_date, end_date: data.end_date },
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
    }

    const { mutate } = useMutation({
        mutationFn: filterByRange,
        onSuccess: handleSuccess,
        onError: handleError,
    })

    const handleToggle = () => {
        setOpenRangeFilter(!open)
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
                    id='filter-by-date-range'
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
                    <TextField
                        placeholder='2024-12-31'
                        label='End Date'
                        type={'text'}
                        margin={'dense'}
                        variant='standard'
                        fullWidth={true}
                        {...register('end_date')}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleToggle}>Cancel</Button>
                <Button
                    type='submit'
                    form='filter-by-date-range'>
                    Filter
                </Button>
            </DialogActions>
        </Dialog>
    )
}
