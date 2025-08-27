import React from 'react';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
}));

interface SDLCStatsProps {
    totalInitiatives: number;
    avgHealth: number;
    atRiskCount: number;
    getHealthStatus: (percentage: number) => { color: string; label: string; textColor: string };
}

const SDLCStats: React.FC<SDLCStatsProps> = ({ totalInitiatives, avgHealth, atRiskCount, getHealthStatus }) => {
    // console.log('Rendering SDLCStats', {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={6}>
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.default',
                        display: 'grid',
                        width: 1000,
                        gap: 2,
                    }}
                >
                    <Paper
                        elevation={5}
                        sx={{
                            p: 2,
                            bgcolor: 'background.paper',
                            color: 'text.primary',
                        }}
                    >
                        <Typography variant="subtitle2">Total Initiatives</Typography>
                        <Typography variant="h1">
                            <TrendingUpIcon sx={{
                                float: 'right',
                                fontSize: '3rem',
                                mt: -1
                            }} />
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{totalInitiatives}</Typography>
                    </Paper><br />
                    <Paper elevation={5} sx={{ p: 2, bgcolor: 'background.paper', color: 'text.primary' }}>
                        <Typography variant="subtitle2">Average Health</Typography>
                        <Box
                            sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                bgcolor: getHealthStatus(avgHealth).color,
                                display: 'inline-block',
                                mt: 1,
                                float: 'right'
                            }}
                        />
                        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{avgHealth}%</Typography>
                    </Paper><br />
                    <Paper elevation={5} sx={{ p: 2, bgcolor: 'background.paper', color: 'text.primary' }}>
                        <Typography variant="subtitle2">At Risk</Typography>
                        <Box
                            sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                bgcolor: 'error.main',
                                display: 'inline-block',
                                mt: 1,
                                float: 'right',
                            }}
                        />
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'error.main' }}>{atRiskCount}</Typography>
                    </Paper>

                </Box>
            </Grid>
        </Box>
    );
};

export default SDLCStats;
