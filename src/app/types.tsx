
// Types
export interface Initiative {
    id: number;
    name: string;
    owner: string;
    lastUpdated: string;
    scores: number[];
    history: Record<number, Array<{
        date: string;
        user: string;
        oldScore: number;
        newScore: number;
        comment: string;
    }>>;
}

export interface SelectedHistory {
    initiative: string;
    milestone: string;
    milestoneIndex: number;
    history: Array<{
        date: string;
        user: string;
        oldScore: number;
        newScore: number;
        comment: string;
    }>;
    currentScore: number;
}