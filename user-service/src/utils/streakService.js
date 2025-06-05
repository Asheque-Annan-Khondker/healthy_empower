const { Op } = require('sequelize');

/**
 * Calculate and update user's workout streak
 * @param {Object} user - User model instance
 * @param {Date} workoutDate - Date of the completed workout (defaults to today)
 * @returns {Object} - Updated streak information
 */
const updateWorkoutStreak = async (user, workoutDate = new Date()) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
  const workoutDateStr = workoutDate.toISOString().split('T')[0];
  
  // Get the last workout date
  const lastWorkoutDate = user.last_workout_date;
  const lastWorkoutDateStr = lastWorkoutDate ? lastWorkoutDate : null;
  
  let newStreak = user.current_streak || 0;
  let newLongestStreak = user.longest_streak || 0;
  let streakBonus = 0;
  
  // If this is the first workout ever
  if (!lastWorkoutDateStr) {
    newStreak = 1;
  }
  // If last workout was yesterday, continue the streak
  else if (isYesterday(lastWorkoutDateStr, workoutDateStr)) {
    newStreak = user.current_streak + 1;
  }
  // If last workout was today, don't change streak (same day completion)
  else if (lastWorkoutDateStr === workoutDateStr) {
    newStreak = user.current_streak;
  }
  // If there's a gap, reset streak
  else {
    newStreak = 1;
  }
  
  // Update longest streak if current streak is higher
  if (newStreak > newLongestStreak) {
    newLongestStreak = newStreak;
  }
  
  // Calculate streak bonus currency
  streakBonus = calculateStreakBonus(newStreak);
  
  // Update user's streak data
  await user.update({
    current_streak: newStreak,
    longest_streak: newLongestStreak,
    last_workout_date: workoutDateStr
  });
  
  return {
    currentStreak: newStreak,
    longestStreak: newLongestStreak,
    streakBonus: streakBonus,
    isNewRecord: newStreak === newLongestStreak && newStreak > 1
  };
};

/**
 * Check if date2 is the day after date1
 * @param {string} date1 - YYYY-MM-DD format
 * @param {string} date2 - YYYY-MM-DD format
 * @returns {boolean}
 */
const isYesterday = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Add one day to date1 and compare
  d1.setDate(d1.getDate() + 1);
  
  return d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];
};

/**
 * Calculate bonus currency based on streak length
 * @param {number} streak - Current streak count
 * @returns {number} - Bonus currency amount
 */
const calculateStreakBonus = (streak) => {
  if (streak < 3) return 0;
  
  // Bonus tiers:
  // 3-6 days: +2 currency
  // 7-13 days: +5 currency  
  // 14-29 days: +10 currency
  // 30+ days: +20 currency
  
  if (streak >= 30) return 20;
  if (streak >= 14) return 10;
  if (streak >= 7) return 5;
  if (streak >= 3) return 2;
  
  return 0;
};

/**
 * Get streak milestones for UI display
 * @param {number} streak - Current streak count
 * @returns {Object} - Milestone information
 */
const getStreakMilestone = (streak) => {
  const milestones = [
    { days: 3, title: "Getting Started", bonus: 2 },
    { days: 7, title: "One Week Warrior", bonus: 5 },
    { days: 14, title: "Two Week Champion", bonus: 10 },
    { days: 30, title: "Monthly Master", bonus: 20 },
    { days: 50, title: "Consistency King", bonus: 30 },
    { days: 100, title: "Century Crusher", bonus: 50 }
  ];
  
  let currentMilestone = null;
  let nextMilestone = milestones[0];
  
  for (let i = 0; i < milestones.length; i++) {
    if (streak >= milestones[i].days) {
      currentMilestone = milestones[i];
      nextMilestone = milestones[i + 1] || null;
    } else {
      break;
    }
  }
  
  return {
    current: currentMilestone,
    next: nextMilestone,
    progress: nextMilestone ? (streak / nextMilestone.days) : 1
  };
};

module.exports = {
  updateWorkoutStreak,
  calculateStreakBonus,
  getStreakMilestone
};