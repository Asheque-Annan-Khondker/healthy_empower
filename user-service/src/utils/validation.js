function validateHealthData(healthData) {
  const { height, weight } = healthData;
  
  const HAS_MISSING_FIELDS = !height || !weight; 
  const HAS_INVALID_VALUES = height <= 0 || weight <= 0; 

  if (HAS_MISSING_FIELDS) {
    return { isValid: false, error: 'Missing required fields' }; 
  }

  if (HAS_INVALID_VALUES) {
    return { isValid: false, error: 'Invalid Height or Weight Values' }; 
  } 

  return { isValid: true };  
}


function validateGoalData(goalData, hasHealthProfile) {
  const { type, target_value, timeline, description } = goalData;

  const HAS_MISSING_FIELDS = !type || !target_value || !timeline || !description;
  const HAS_NO_HEALTH_PROFILE = !hasHealthProfile; 
  const INVALID_GOAL_TYPES = !['weight', 'activity', 'xpgoal', 'stepgoal'].includes(type);
  const HAS_NEGATIVE_TARGET = target_value <= 0;
  const TIMELINE_DATE = new Date(timeline);
  const CURRENT_DATE = new Date();
  const IS_PAST_OR_PRESENT_DATE = TIMELINE_DATE <= CURRENT_DATE; 

  if (HAS_MISSING_FIELDS) {
    return { isValid: false, error: 'Missing required fields'}
  }

  if (HAS_NO_HEALTH_PROFILE) {
    return { isValid: false, error: 'Health profile required before setting goals'}
  }

  if (INVALID_GOAL_TYPES) {
    return { isValid: false, error: 'Invalid goal type. Goal must be: weight, activity, xpgoal, or stepgoal'}; 
  }

  if (HAS_NEGATIVE_TARGET) {
    return { isValid: false, error: 'Invalid goal value'};
  }

  if (IS_PAST_OR_PRESENT_DATE) {
    return { isValid: false, error: 'Timeline must be a future date'}; 
  }

  return { isValid: true }; 
}

function validateExerciseData(exerciseData) {
  const { name, type, measurement_type } = exerciseData;

  const REQUIRED_FIELDS_MISSING = !name || !type || !measurement_type;
  if (REQUIRED_FIELDS_MISSING) {
    return { isValid: false, error: 'Name, type, and measurement type are required' }; 
  }

  const VALID_TYPES = ['strength', 'cardio', 'flexibility', 'balance', 'sport'];
  const VALID_MEASUREMENT_TYPES = ['reps', 'duration', 'distance', 'weight'];

  const INVALID_TYPE = !VALID_TYPES.includes(type); 

  if (INVALID_TYPE) {
    return { isValid: false, error: 'Invalid exercise type' }; 
  }

  const INVALID_MEASUREMENT = !VALID_MEASUREMENT_TYPES.includes(measurement_type);
  if (INVALID_MEASUREMENT) {
    return { isValid: false, error: 'Invalid measurement type' }; 
  }

  return { isValid: true }; 
}


function hasRequiredFields(userData) { 
    const { username, email, password, date_of_birth, gender, timezone } = userData; 
    return username && email && password && date_of_birth && gender && timezone; 
}

const isEmailAlreadyRegistered = (email, users) => {
  const existingUsers = Array.from(users.values());
  return existingUsers.some(user => user.email === email);
} 



module.exports = { 
  validateGoalData, 
  validateHealthData, 
  hasRequiredFields, 
  isEmailAlreadyRegistered, 
  validateExerciseData 
};
