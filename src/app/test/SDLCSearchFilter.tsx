import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';

interface SDLCSearchFilterProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    filterBy: string;
    setFilterBy: React.Dispatch<React.SetStateAction<string>>;
}

const SDLCSearchFilter: React.FC<SDLCSearchFilterProps> = ({ searchTerm, setSearchTerm, filterBy, setFilterBy }) => (
    <Paper elevation={2} sx={{ mb: 3, p: 1, borderRadius: 2, width: 1000 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row', width: 1000 }, gap: 2 }}>
            <Box sx={{ position: 'relative', flex: 1 }}>
                <SearchIcon sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'text.disabled', fontSize: 20 }} />
                <InputBase
                    fullWidth
                    placeholder="Search by initiative name or owner..."
                    sx={{ pl: 5, pr: 2, py: 1, border: 1, borderColor: 'grey.300', borderRadius: 1, bgcolor: 'background.paper', fontSize: 16 }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>
            <Box sx={{ position: 'relative', minWidth: 180 }}>
                <FilterIcon sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'text.disabled', fontSize: 20 }} />
                <Select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as string)}
                    sx={{ pl: 5, pr: 2, py: 1, border: 1, borderColor: 'grey.300', borderRadius: 1, bgcolor: 'background.paper', fontSize: 16, width: '100%' }}
                >
                    <MenuItem value="all">All Initiatives</MenuItem>
                    <MenuItem value="mine">My Initiatives</MenuItem>
                    <MenuItem value="at-risk">At Risk</MenuItem>
                </Select>
            </Box>
        </Box>
    </Paper>
);

export default SDLCSearchFilter;
