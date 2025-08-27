"use client"

import React, { useState, useMemo } from 'react';
import {
    Schedule as ClockIcon,
    ChatBubbleOutline as MessageIcon,
    Close as CloseIcon,
    ChevronRight as ChevronRightIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import SDLCStats from './SDLCStats';
import SDLCInitiativeCard from './SDLCInitiativeCard';
import SDLCSearchFilter from './SDLCSearchFilter';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Initiative, SelectedHistory } from '../types';
import Paper from '@mui/material/Paper';


const SDLCTracker = () => {
    // Sample data with history - in real app this would come from API
    const [initiatives, setInitiatives] = useState<Initiative[]>([
        {
            id: 1,
            name: "Customer Portal Redesign",
            owner: "Sarah Chen",
            lastUpdated: "2024-08-19",
            scores: [3, 3, 2, 1, 2, 1, 0, 0, 0, 0],
            history: {
                0: [
                    { date: "2024-08-15", user: "Sarah Chen", oldScore: 2, newScore: 3, comment: "Architecture review completed" },
                    { date: "2024-08-10", user: "Sarah Chen", oldScore: 1, newScore: 2, comment: "Initial design draft done" },
                    { date: "2024-08-05", user: "Sarah Chen", oldScore: 0, newScore: 1, comment: "Started architectural planning" }
                ],
                1: [
                    { date: "2024-08-18", user: "Sarah Chen", oldScore: 2, newScore: 3, comment: "All components detailed" },
                    { date: "2024-08-12", user: "Sarah Chen", oldScore: 1, newScore: 2, comment: "Core modules designed" },
                    { date: "2024-08-07", user: "Sarah Chen", oldScore: 0, newScore: 1, comment: "Started low-level design" }
                ],
                2: [
                    { date: "2024-08-19", user: "Sarah Chen", oldScore: 3, newScore: 2, comment: "Found issues in API spec, revising" },
                    { date: "2024-08-16", user: "Sarah Chen", oldScore: 1, newScore: 3, comment: "Contract published and reviewed" },
                    { date: "2024-08-14", user: "Sarah Chen", oldScore: 0, newScore: 1, comment: "Draft interface created" }
                ],
                4: [
                    { date: "2024-08-19", user: "Sarah Chen", oldScore: 1, newScore: 2, comment: "Core functionality tests added" },
                    { date: "2024-08-17", user: "Sarah Chen", oldScore: 0, newScore: 1, comment: "Test framework setup" }
                ]
            }
        },
        {
            id: 2,
            name: "Payment Gateway Integration",
            owner: "Mike Rodriguez",
            lastUpdated: "2024-08-18",
            scores: [3, 3, 3, 3, 3, 2, 2, 1, 0, 0],
            history: {
                5: [
                    { date: "2024-08-18", user: "Mike Rodriguez", oldScore: 3, newScore: 2, comment: "Security review found issues" },
                    { date: "2024-08-15", user: "Mike Rodriguez", oldScore: 2, newScore: 3, comment: "All reviews completed" },
                    { date: "2024-08-12", user: "Mike Rodriguez", oldScore: 0, newScore: 2, comment: "Peer reviews done" }
                ]
            }
        },
        {
            id: 3,
            name: "Mobile App Authentication",
            owner: "Alex Kim",
            lastUpdated: "2024-08-20",
            scores: [3, 2, 2, 2, 1, 1, 0, 0, 0, 0],
            history: {}
        },
        {
            id: 4,
            name: "Data Analytics Dashboard",
            owner: "Emma Thompson",
            lastUpdated: "2024-08-17",
            scores: [3, 3, 3, 3, 3, 3, 3, 2, 1, 1],
            history: {}
        },
        {
            id: 5,
            name: "API Rate Limiting Service",
            owner: "David Park",
            lastUpdated: "2024-08-19",
            scores: [3, 3, 3, 2, 2, 2, 1, 1, 0, 0],
            history: {}
        }
    ]);

    const milestones = [
        "System Architectural Design",
        "Low Level Design",
        "Published Interface Contract",
        "Responders",
        "Unit Test Completion",
        "Code Review Completion",
        "Dev Integration",
        "Code Scan Completion",
        "Ready for SIT Day 1",
        "Production Readiness"
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("all");
    const [currentUser] = useState("Sarah Chen"); // Mock current user
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<SelectedHistory | null>(null);

    // Calculate health percentage for an initiative
    const calculateHealth = (scores: number[]) => {
        const total = scores.reduce((sum, score) => sum + score, 0);
        return Math.round((total / 30) * 100);
    };

    // Get health status color and label
    const getHealthStatus = (percentage: number) => {
        if (percentage >= 80) return { color: 'success.main', label: 'Excellent', textColor: 'success.main' };
        if (percentage >= 60) return { color: 'info.main', label: 'Good', textColor: 'info.main' };
        if (percentage >= 40) return { color: 'warning.main', label: 'At Risk', textColor: 'warning.main' };
        return { color: 'error.main', label: 'Critical', textColor: 'error.main' };
    };

    // Get score color
    const getScoreColor = (score: number) => {
        const muiColors = [
            {
                bgcolor: 'error.light',
                color: 'error.dark',
                borderColor: 'error.main'
            },
            {
                bgcolor: 'warning.light',
                color: 'warning.dark',
                borderColor: 'warning.main'
            },
            {
                bgcolor: 'warning.light',
                color: 'warning.dark',
                borderColor: 'warning.main'
            },
            {
                bgcolor: 'success.light',
                color: 'success.dark',
                borderColor: 'success.main'
            }
        ];
        return muiColors[score];
    };

    // Update milestone score
    const updateScore = (initiativeId: number, milestoneIndex: number, newScore: number, comment: string = "") => {
        const currentDate = new Date().toISOString().split('T')[0];

        setInitiatives(prev => prev.map(init => {
            if (init.id === initiativeId) {
                const oldScore = init.scores[milestoneIndex];
                const newScores = init.scores.map((score, idx) =>
                    idx === milestoneIndex ? newScore : score
                );

                // Add to history if score actually changed
                const newHistory: Record<number, Array<{ date: string; user: string; oldScore: number; newScore: number; comment: string }>> = { ...init.history };
                if (oldScore !== newScore) {
                    if (!newHistory[milestoneIndex]) {
                        newHistory[milestoneIndex] = [];
                    }
                    newHistory[milestoneIndex].unshift({
                        date: currentDate,
                        user: currentUser,
                        oldScore,
                        newScore,
                        comment: comment || `Updated from ${oldScore} to ${newScore}`
                    });
                }

                return {
                    ...init,
                    scores: newScores,
                    lastUpdated: currentDate,
                    history: newHistory
                };
            }
            return init;
        }));
    };

    // Show milestone history
    const showMilestoneHistory = (initiative: Initiative, milestoneIndex: number) => {
        setSelectedHistory({
            initiative: initiative.name,
            milestone: milestones[milestoneIndex],
            milestoneIndex,
            history: initiative.history[milestoneIndex] || [],
            currentScore: initiative.scores[milestoneIndex]
        });
        setShowHistoryModal(true);
    };

    // Filter and search initiatives
    const filteredInitiatives = useMemo(() => {
        let filtered = initiatives;

        if (searchTerm) {
            filtered = filtered.filter(init =>
                init.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                init.owner.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterBy === "mine") {
            filtered = filtered.filter(init => init.owner === currentUser);
        } else if (filterBy === "at-risk") {
            filtered = filtered.filter(init => {
                const health = calculateHealth(init.scores);
                return health < 60;
            });
        }

        return filtered;
    }, [initiatives, searchTerm, filterBy, currentUser]);

    // Calculate overall stats
    const overallStats = useMemo(() => {
        const totalInitiatives = initiatives.length;
        const avgHealth = Math.round(
            initiatives.reduce((sum, init) => sum + calculateHealth(init.scores), 0) / totalInitiatives
        );
        const atRiskCount = initiatives.filter(init => calculateHealth(init.scores) < 60).length;

        return { totalInitiatives, avgHealth, atRiskCount };
    }, [initiatives]);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                    SDLC Milestone Tracker
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Track and self-assess your development milestones
                </Typography>
            </Box>

            {/* Stats Overview */}
            <SDLCStats
                totalInitiatives={overallStats.totalInitiatives}
                avgHealth={overallStats.avgHealth}
                atRiskCount={overallStats.atRiskCount}
                getHealthStatus={getHealthStatus}
            />

            {/* Search and Filter */}
            <SDLCSearchFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterBy={filterBy}
                setFilterBy={setFilterBy}
            />

            {/* Initiative Cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {filteredInitiatives.map((initiative) => (
                    <SDLCInitiativeCard
                        key={initiative.id}
                        initiative={initiative}
                        milestones={milestones}
                        calculateHealth={calculateHealth}
                        getHealthStatus={getHealthStatus}
                        getScoreColor={getScoreColor}
                        updateScore={updateScore}
                        showMilestoneHistory={showMilestoneHistory}
                    />
                ))}
            </Box>

            {filteredInitiatives.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 12 }}>
                    <Typography variant="h6" sx={{ color: 'text.disabled', mb: 2 }}>
                        No initiatives found
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Try adjusting your search or filter criteria
                    </Typography>
                </Box>
            )}

            {/* History Modal */}
            {showHistoryModal && selectedHistory && (
                <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.5)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                    <Paper sx={{ borderRadius: 3, boxShadow: 6, maxWidth: 600, width: '100%', maxHeight: '80vh', overflow: 'hidden' }}>
                        {/* Modal Header */}
                        <Box sx={{ px: 4, py: 3, borderBottom: 1, borderColor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>Milestone History</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                    {selectedHistory.initiative} • {selectedHistory.milestone}
                                </Typography>
                            </Box>
                            <Box component="span" sx={{ color: 'text.disabled', cursor: 'pointer', '&:hover': { color: 'text.primary' } }} onClick={() => setShowHistoryModal(false)}>
                                <CloseIcon sx={{ fontSize: 28 }} />
                            </Box>
                        </Box>

                        {/* Modal Content */}
                        <Box sx={{ p: 4, overflowY: 'auto', maxHeight: 400 }}>
                            {/* Current Status */}
                            <Paper elevation={0} sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>Current Status</Typography>
                                    <Box sx={{ px: 2, py: 1, borderRadius: 2, fontSize: 14, fontWeight: 500, bgcolor: getScoreColor(selectedHistory.currentScore).bgcolor, color: getScoreColor(selectedHistory.currentScore).color, border: 1, borderColor: getScoreColor(selectedHistory.currentScore).borderColor }}>
                                        {selectedHistory.currentScore} - {
                                            selectedHistory.currentScore === 0 ? "Not Started" :
                                                selectedHistory.currentScore === 1 ? "In Progress" :
                                                    selectedHistory.currentScore === 2 ? "Nearly Complete" : "Complete"
                                        }
                                    </Box>
                                </Box>
                            </Paper>

                            {/* History Timeline */}
                            {selectedHistory.history.length > 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Change History</Typography>
                                    <Box sx={{ position: 'relative', pl: 6 }}>
                                        {/* Timeline line */}
                                        <Box sx={{ position: 'absolute', left: 12, top: 0, bottom: 0, width: 2, bgcolor: 'grey.200' }} />

                                        {selectedHistory.history.map((entry, index) => (
                                            <Box key={index} sx={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 2, pb: 3 }}>
                                                {/* Timeline dot */}
                                                <Box sx={{ position: 'relative', zIndex: 1, width: 48, height: 48, borderRadius: '50%', border: 2, borderColor: 'common.white', boxShadow: 2, bgcolor: entry.newScore > entry.oldScore ? 'success.main' : entry.newScore < entry.oldScore ? 'error.main' : 'info.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {entry.newScore > entry.oldScore ? (
                                                        <TrendingUpIcon sx={{ color: 'common.white', fontSize: 24 }} />
                                                    ) : (
                                                        <ClockIcon sx={{ color: 'common.white', fontSize: 24 }} />
                                                    )}
                                                </Box>

                                                {/* Timeline content */}
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{entry.user}</Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{entry.date}</Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <Box sx={{ px: 1, py: 0.5, borderRadius: 1, fontSize: 12, fontWeight: 500, bgcolor: getScoreColor(entry.oldScore).bgcolor, color: getScoreColor(entry.oldScore).color, border: 1, borderColor: getScoreColor(entry.oldScore).borderColor }}>
                                                            {entry.oldScore}
                                                        </Box>
                                                        <ChevronRightIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                                                        <Box sx={{ px: 1, py: 0.5, borderRadius: 1, fontSize: 12, fontWeight: 500, bgcolor: getScoreColor(entry.newScore).bgcolor, color: getScoreColor(entry.newScore).color, border: 1, borderColor: getScoreColor(entry.newScore).borderColor }}>
                                                            {entry.newScore}
                                                        </Box>
                                                    </Box>

                                                    {entry.comment && (
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 0.5 }}>
                                                            <MessageIcon sx={{ color: 'text.disabled', fontSize: 18, mt: 0.5, flexShrink: 0 }} />
                                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{entry.comment}</Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 6 }}>
                                    <ClockIcon sx={{ color: 'grey.300', fontSize: 48, mb: 2 }} />
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>No change history available</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1 }}>Updates will appear here as changes are made</Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Modal Footer */}
                        <Box sx={{ px: 4, py: 3, borderTop: 1, borderColor: 'grey.200', bgcolor: 'background.default', textAlign: 'right' }}>
                            <Box component="button" onClick={() => setShowHistoryModal(false)} sx={{ px: 3, py: 1, bgcolor: 'grey.700', color: 'common.white', borderRadius: 2, fontWeight: 500, cursor: 'pointer', '&:hover': { bgcolor: 'grey.800' } }}>
                                Close
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            )}
        </Box>
    );
};

export default SDLCTracker;