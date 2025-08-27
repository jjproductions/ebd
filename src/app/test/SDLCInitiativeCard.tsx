import React from 'react';
import { lighten, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Person as UserIcon, CalendarToday as CalendarIcon, History as HistoryIcon } from '@mui/icons-material';
import { Initiative } from './../types';

interface SDLCInitiativeCardProps {
    initiative: Initiative;
    milestones: string[];
    calculateHealth: (scores: number[]) => number;
    getHealthStatus: (percentage: number) => { color: string; label: string; textColor: string };
    getScoreColor: (score: number) => { bgcolor: string; color: string; borderColor: string };
    updateScore: (initiativeId: number, milestoneIndex: number, newScore: number, comment?: string) => void;
    showMilestoneHistory: (initiative: Initiative, milestoneIndex: number) => void;
}

const SDLCInitiativeCard: React.FC<SDLCInitiativeCardProps> = ({
    initiative,
    milestones,
    calculateHealth,
    getHealthStatus,
    getScoreColor,
    updateScore,
    showMilestoneHistory
}) => {
    const theme = useTheme();
    const health = calculateHealth(initiative.scores);
    const healthStatus = getHealthStatus(health);
    // Type-safe mapping for known palette keys
    const paletteMap: Record<string, any> = {
        primary: theme.palette.primary,
        secondary: theme.palette.secondary,
        error: theme.palette.error,
        warning: theme.palette.warning,
        info: theme.palette.info,
        success: theme.palette.success,
        grey: theme.palette.grey,
        text: theme.palette.text,
        background: theme.palette.background,
    };
    // Resolve theme color key to actual color value
    let arcColor = healthStatus.color;
    if (arcColor && typeof arcColor === 'string' && arcColor.includes('.')) {
        const [paletteKey, shade] = arcColor.split('.');
        if (paletteMap[paletteKey] && paletteMap[paletteKey][shade]) {
            arcColor = paletteMap[paletteKey][shade];
        }
    }

    // Helper to get lighter shade for Select background
    const getLighterBg = (scoreColor: { bgcolor: string; color: string; borderColor: string }) => {
        if (scoreColor.color && typeof scoreColor.color === 'string' && scoreColor.color.includes('.')) {
            const [paletteKey] = scoreColor.color.split('.');
            if (paletteMap[paletteKey] && (paletteMap[paletteKey] as any).light) {
                // Use lighten to get an even lighter shade
                return lighten((paletteMap[paletteKey] as any).light, 0.7);
            }
        }
        return scoreColor.bgcolor;
    };
    return (
        <Paper elevation={2} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
            {/* Initiative Header */}
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'grey.200' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{initiative.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, color: 'text.secondary', fontSize: 14 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <UserIcon sx={{ fontSize: 16 }} />
                                <span>{initiative.owner}</span>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarIcon sx={{ fontSize: 16 }} />
                                <span>Updated {initiative.lastUpdated}</span>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h4" sx={{ color: healthStatus.color, fontWeight: 700 }}>{health}%</Typography>
                            <Typography variant="body2" sx={{ color: healthStatus.color }}>{healthStatus.label}</Typography>
                        </Box>
                        <Box sx={{ width: 64, height: 64, position: 'relative' }}>
                            {(() => {
                                const radius = 15.9155;
                                const circumference = 2 * Math.PI * radius;
                                // Avoid invisible arc at 0%
                                const progress = Math.max(health, 0.01);
                                const offset = circumference * (1 - progress / 100);
                                // console.log('Rendering SDLCInitiativeCard', { health, progress, offset, circumference, radius, healthStatus });
                                return (
                                    <svg width={64} height={64} style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#E5E7EB"
                                            strokeWidth="2"
                                        />
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke={arcColor}
                                            strokeWidth="2"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={offset}
                                            strokeLinecap="round"
                                            style={{ transition: 'stroke-dashoffset 0.5s' }}
                                        />
                                    </svg>
                                );
                            })()}
                            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{health}%</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            {/* Milestones Grid */}
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(5, 1fr)' }, gap: 2 }}>
                    {milestones.map((milestone, index) => {
                        const scoreColor = getScoreColor(initiative.scores[index]);
                        const selectBg = getLighterBg(scoreColor);
                        console.log('Rendering milestone', { scoreColor, selectBg });
                        return (
                            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>{milestone}</Typography>
                                    {initiative.history[index] && initiative.history[index].length > 0 && (
                                        <Box component="span" sx={{ color: 'text.disabled', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} onClick={() => showMilestoneHistory(initiative, index)} title="View history">
                                            <HistoryIcon sx={{ fontSize: 16 }} />
                                        </Box>
                                    )}
                                </Box>
                                <Select
                                    value={initiative.scores[index]}
                                    onChange={(e) => updateScore(initiative.id, index, Number(e.target.value))}
                                    sx={{ width: '100%', px: 1, py: 0.5, fontSize: 14, bgcolor: selectBg, color: scoreColor.color, border: 1, borderColor: scoreColor.borderColor, borderRadius: 1, fontWeight: 550 }}
                                >
                                    <MenuItem value={0}>0 - Not Started</MenuItem>
                                    <MenuItem value={1}>1 - In Progress</MenuItem>
                                    <MenuItem value={2}>2 - Nearly Complete</MenuItem>
                                    <MenuItem value={3}>3 - Complete</MenuItem>
                                </Select>
                            </Box>
                        );
                    })}
                </Box>
                {/* Progress Bar */}
                <Box sx={{ mt: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>Overall Progress</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{initiative.scores.reduce((sum, score) => sum + score, 0)}/30 points</Typography>
                    </Box>
                    <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 2, height: 12 }}>
                        <Box sx={{ height: 12, borderRadius: 2, bgcolor: healthStatus.color, width: `${health}%`, transition: 'width 0.5s' }} />
                    </Box>
                </Box>
            </Box >
        </Paper >
    );
};

export default SDLCInitiativeCard;
