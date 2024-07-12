import React from 'react'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import CustomToolbar from './CustomToolbar'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import EditDialog from './EditDialog'
import axios from 'axios'

export default function Leads() {
    const queryClient = useQueryClient()

    const getLeads = async () => {
        let token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8000/leads/', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        return response.data
    }

    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['leads'] })
    }

    const handleError = (error) => {
        console.error(error)
    }

    const deleteData = async (id) => {
        let token = localStorage.getItem('token')
        const response = await axios.delete(
            `http://localhost:8000/leads/${id}`,
            {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            }
        )
        return response.data
    }

    const { mutate } = useMutation({
        mutationFn: deleteData,
        onSuccess: handleSuccess,
        onError: handleError,
    })

    const handleDelete = (id) => {
        mutate(id)
    }

    const [openEdit, setOpenEdit] = React.useState(false)
    const [details, setDetails] = React.useState({})
    const handleEdit = (params) => {
        setOpenEdit((open) => !open)
        setDetails(params.row)
    }
    const columns = [
        { field: 'id', headerName: 'ID', width: 150 },
        { field: 'first_name', headerName: 'First Name', width: 150 },
        { field: 'last_name', headerName: 'Last Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 150 },
        { field: 'phone', headerName: 'Phone', width: 150 },
        { field: 'created_at', headerName: 'Created At', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 150,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label='Delete'
                    onClick={() => handleDelete(params.row.id)}
                />,
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label='Edit'
                    onClick={() => handleEdit(params)}
                />,
            ],
        },
    ]

    const {
        data: leads,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['leads'],
        queryFn: getLeads,
    })

    if (error) {
        alert(`Status Code: 401 \nMessage: Unauthorized`)
    }

    return (
        <React.Fragment>
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    sx={{ padding: '20px' }}
                    rows={leads}
                    columns={columns}
                    slots={{ toolbar: CustomToolbar }}
                    loading={isLoading}
                    autoHeight
                />
            </div>
            <EditDialog
                open={openEdit}
                setOpenEdit={setOpenEdit}
                details={details}
            />
        </React.Fragment>
    )
}
