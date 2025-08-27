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
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">SDLC Milestone Tracker</h1>
                <p className="text-gray-600">Track and self-assess your development milestones</p>
            </div>

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
            <div className="space-y-6">
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
            </div>

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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Milestone History</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {selectedHistory.initiative} • {selectedHistory.milestone}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowHistoryModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <CloseIcon style={{ fontSize: '24px' }} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-96">
                            {/* Current Status */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Current Status</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(selectedHistory.currentScore)}`}>
                                        {selectedHistory.currentScore} - {
                                            selectedHistory.currentScore === 0 ? "Not Started" :
                                                selectedHistory.currentScore === 1 ? "In Progress" :
                                                    selectedHistory.currentScore === 2 ? "Nearly Complete" : "Complete"
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* History Timeline */}
                            {selectedHistory.history.length > 0 ? (
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900 mb-4">Change History</h4>
                                    <div className="relative">
                                        {/* Timeline line */}
                                        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200"></div>

                                        {selectedHistory.history.map((entry, index) => (
                                            <div key={index} className="relative flex items-start space-x-4 pb-6">
                                                {/* Timeline dot */}
                                                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow-sm ${entry.newScore > entry.oldScore ? 'bg-green-500' :
                                                    entry.newScore < entry.oldScore ? 'bg-red-500' : 'bg-blue-500'
                                                    }`}>
                                                    {entry.newScore > entry.oldScore ? (
                                                        <TrendingUpIcon style={{ fontSize: '20px' }} className="text-white" />
                                                    ) : (
                                                        <ClockIcon style={{ fontSize: '20px' }} className="text-white" />
                                                    )}
                                                </div>

                                                {/* Timeline content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="text-sm font-medium text-gray-900">{entry.user}</span>
                                                        <span className="text-sm text-gray-500">{entry.date}</span>
                                                    </div>

                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(entry.oldScore)}`}>
                                                            {entry.oldScore}
                                                        </span>
                                                        <ChevronRightIcon style={{ fontSize: '16px' }} className="text-gray-400" />
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(entry.newScore)}`}>
                                                            {entry.newScore}
                                                        </span>
                                                    </div>

                                                    {entry.comment && (
                                                        <div className="flex items-start space-x-2">
                                                            <MessageIcon style={{ fontSize: '16px' }} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                            <p className="text-sm text-gray-600">{entry.comment}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <ClockIcon style={{ fontSize: '48px' }} className="text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No change history available</p>
                                    <p className="text-sm text-gray-400 mt-1">Updates will appear here as changes are made</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={() => setShowHistoryModal(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SDLCTracker;