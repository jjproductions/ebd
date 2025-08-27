import React, { useState, useMemo } from 'react';
import { Initiative } from '../types';

// Custom SVG Icons as React components
const SearchIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const FilterIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
);

const UserIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const TrendingUpIcon = () => (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const HistoryIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ClockIcon = ({ className = "h-5 w-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MessageIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const CloseIcon = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const TrendingUpTimelineIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const SDLCTracker = () => {
    // Sample data with history - in real app this would come from API
    const [initiatives, setInitiatives] = useState([
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
    const [selectedHistory, setSelectedHistory] = useState(null);

    // Calculate health percentage for an initiative
    const calculateHealth = (scores: number[]) => {
        const total = scores.reduce((sum, score) => sum + score, 0);
        return Math.round((total / 30) * 100);
    };

    // Get health status color and label
    const getHealthStatus = (percentage: number) => {
        if (percentage >= 80) return { color: 'bg-green-500', label: 'Excellent', textColor: 'text-green-700' };
        if (percentage >= 60) return { color: 'bg-blue-500', label: 'Good', textColor: 'text-blue-700' };
        if (percentage >= 40) return { color: 'bg-yellow-500', label: 'At Risk', textColor: 'text-yellow-700' };
        return { color: 'bg-red-500', label: 'Critical', textColor: 'text-red-700' };
    };

    // Get score color
    const getScoreColor = (score: number) => {
        const colors = [
            'bg-red-100 text-red-800 border-red-200',
            'bg-orange-100 text-orange-800 border-orange-200',
            'bg-yellow-100 text-yellow-800 border-yellow-200',
            'bg-green-100 text-green-800 border-green-200'
        ];
        return colors[score];
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
                // Remove any undefined properties to satisfy Record<number, ...[]>
                const cleanedHistory = Object.fromEntries(
                    Object.entries(init.history)
                        .filter(([_, v]) => Array.isArray(v))
                        .map(([k, v]) => [Number(k), v])
                ) as Record<number, Array<{ date: string; user: string; oldScore: number; newScore: number; comment: string }>>;
                const newHistory: Record<number, Array<{ date: string; user: string; oldScore: number; newScore: number; comment: string }>> = { ...cleanedHistory };
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6 border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Initiatives</p>
                            <p className="text-3xl font-bold text-gray-900">{overallStats.totalInitiatives}</p>
                        </div>
                        <TrendingUpIcon />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Average Health</p>
                            <p className="text-3xl font-bold text-gray-900">{overallStats.avgHealth}%</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full ${getHealthStatus(overallStats.avgHealth).color}`}></div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">At Risk</p>
                            <p className="text-3xl font-bold text-red-600">{overallStats.atRiskCount}</p>
                        </div>
                        <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by initiative name or owner..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <FilterIcon />
                        </div>
                        <select
                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                        >
                            <option value="all">All Initiatives</option>
                            <option value="mine">My Initiatives</option>
                            <option value="at-risk">At Risk</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Initiative Cards */}
            <div className="space-y-6">
                {filteredInitiatives.map((initiative) => {
                    const health = calculateHealth(initiative.scores);
                    const healthStatus = getHealthStatus(health);

                    return (
                        <div key={initiative.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            {/* Initiative Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{initiative.name}</h3>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <UserIcon />
                                                <span>{initiative.owner}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon />
                                                <span>Updated {initiative.lastUpdated}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className={`text-2xl font-bold ${healthStatus.textColor}`}>{health}%</div>
                                            <div className={`text-sm font-medium ${healthStatus.textColor}`}>{healthStatus.label}</div>
                                        </div>
                                        <div className="w-16 h-16 relative">
                                            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                                <path
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#E5E7EB"
                                                    strokeWidth="2"
                                                />
                                                <path
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke={healthStatus.color.replace('bg-', '').replace('-500', '') === 'green' ? '#10B981' :
                                                        healthStatus.color.replace('bg-', '').replace('-500', '') === 'blue' ? '#3B82F6' :
                                                            healthStatus.color.replace('bg-', '').replace('-500', '') === 'yellow' ? '#F59E0B' : '#EF4444'}
                                                    strokeWidth="2"
                                                    strokeDasharray={`${health}, 100`}
                                                    className="transition-all duration-500"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-xs font-medium text-gray-600">{health}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Milestones Grid */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                    {milestones.map((milestone, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-medium text-gray-700 leading-tight">
                                                    {milestone}
                                                </div>
                                                {initiative.history[index] && initiative.history[index].length > 0 && (
                                                    <button
                                                        onClick={() => showMilestoneHistory(initiative, index)}
                                                        className="text-gray-400 hover:text-blue-500 transition-colors"
                                                        title="View history"
                                                    >
                                                        <HistoryIcon />
                                                    </button>
                                                )}
                                            </div>
                                            <select
                                                value={initiative.scores[index]}
                                                onChange={(e) => updateScore(initiative.id, index, parseInt(e.target.value))}
                                                className={`w-full px-3 py-2 text-sm border rounded-md font-medium ${getScoreColor(initiative.scores[index])} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                            >
                                                <option value={0}>0 - Not Started</option>
                                                <option value={1}>1 - In Progress</option>
                                                <option value={2}>2 - Nearly Complete</option>
                                                <option value={3}>3 - Complete</option>
                                            </select>
                                        </div>
                                    ))}
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                                        <span className="text-sm text-gray-600">{initiative.scores.reduce((sum, score) => sum + score, 0)}/30 points</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-500 ${healthStatus.color}`}
                                            style={{ width: `${health}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredInitiatives.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">No initiatives found</div>
                    <div className="text-gray-500">Try adjusting your search or filter criteria</div>
                </div>
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
                                <CloseIcon />
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
                                                        <div className="text-white">
                                                            <TrendingUpTimelineIcon />
                                                        </div>
                                                    ) : (
                                                        <div className="text-white">
                                                            <ClockIcon />
                                                        </div>
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