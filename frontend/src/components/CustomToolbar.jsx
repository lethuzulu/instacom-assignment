import { GridToolbarContainer } from '@mui/x-data-grid'
import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Button } from '@mui/material'
import FilterByDateDialog from './FilterByDateDialog'
import CreateLeadDialog from './CreateLeadDialog'
import FilterByDateRangeDialog from './FilterByDateRangeDialog'
import FilterListIcon from '@mui/icons-material/FilterList';

export default function CustomToolbar() {
    const [openCreate, setOpenCreate] = React.useState(false)
    const [openDateFilter, setOpenDateFilter] = React.useState(false)
    const [openRangeFilter, setOpenRangeFilter] = React.useState(false)

    return (
        <React.Fragment>
            <GridToolbarContainer>
                <Button
                    onClick={() => setOpenCreate(true)}
                    color='primary'
                    startIcon={<AddIcon />}
                    variant='contained'>
                    Add Lead
                </Button>
                <Button
                    onClick={() => setOpenDateFilter(true)}
                    color='primary'
                    endIcon={<FilterListIcon />}
                    variant='contained'>
                    Filter By Single Date
                </Button>
                <Button
                    onClick={() => setOpenRangeFilter(true)}
                    color='primary'
                    variant='contained'
                    endIcon={<FilterListIcon />}>
                    Filter By Range of Dates
                </Button>
            </GridToolbarContainer>

            <CreateLeadDialog
                open={openCreate}
                setOpenCreate={setOpenCreate}
            />

            <FilterByDateDialog
                open={openDateFilter}
                setOpenDateFilter={setOpenDateFilter}
            />

            <FilterByDateRangeDialog
                open={openRangeFilter}
                setOpenRangeFilter={setOpenRangeFilter}
            />
        </React.Fragment>
    )
}
