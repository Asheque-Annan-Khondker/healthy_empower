import { Achievement } from "@/components/achievements/achievement.types";
import { getDatabase } from "./database";
import { Title } from "react-native-paper";

export async function getAchievements(): Promise<Achievement[]>{
    const db = await getDatabase()
    const results = await db.getAllAsync(`
        select * from achievements
        order by completed asc, progress desc;
        `)
    //map results to achievement type
    return results.map(row=>({
    id: row.id,
    title: row.title,
    desc: row.description,
    icon: row.icon,
    category: row.category,
    completed: row.completed,
    progress: row.progress,
    completion_date: row.completion_date,
    xp: row.xp
    }))

}

export async function updateAchievementProgress(id:Number, progress:Number): Promise<void>{
    const db = await getDatabase()
    //check completion
    const achievement = await db.execAsync(`
        select * from achievements where id = ?
        `, [id]);
    
        //determine if its completed
        let completed = false
        let completionDate = null
    if(achievement?.target_progress && progress>=achievement.target_progress){
        completed = true
        completionDate = new Date().toISOString().split('T')[0]
    }
    // Update the Achievement
    await db.execAsync(`
        update achievements
        set progress = ?,
        completed = case
            when ? >= target_progress then TRUE
            else completed
        end,
        completion_date = case
            when ? >= target_progress and completion_date is null then ?
            else completion_date
        end
        where id = ?;
        `,[progress, progress, progress, completionDate, id])

        
    
}