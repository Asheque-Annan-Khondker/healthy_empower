export interface Achievement {
    id: number;
    title: string;
    description?: string;
    icon?: string;
    category: 'nutrition' | 'fitness' | 'consistency' | 'milestone' | string;
    completed: boolean;
    progress: number;
    target_progress: number;
    completion_date?: string | null;
    xp: number;
}

export const ACHIEVEMENT_CATEGORIES = {
    NUTRITION: 'nutrition',
    FITNESS: 'fitness',
    CONSISTENCY: 'consistency',
    MILESTONE: 'milestone'
};