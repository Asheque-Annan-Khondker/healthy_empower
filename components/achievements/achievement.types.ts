export type AchievementCategories = 'nutrition'|'fitness'|'consistency'|'milestone'

export interface Achievement{
    id: number
    title: string
    desc: string
    icon: string
    category: AchievementCategories
    completed: boolean | number
    progress: number
    completion_date: string | null
    xp: number
}


export const ACHIEVEMENT_CATEGORIES = {
    NUTRITION:  'nutrition',
    FITNESS: 'fitness',
    CONSISTENCY: 'consistency',
    MILESTONE: 'milestone' 
}