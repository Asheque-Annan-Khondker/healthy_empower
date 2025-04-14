/**
 * Validation utilities for the signup form
 */

// Validate email format
export const validateEmail = (email: string, setErrorMessage: (message: string) => void): boolean => {
    if (!email.trim()) {
      setErrorMessage('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    
    setErrorMessage('');
    return true;
  };
  
  // Validate username
  export const validateUsername = (username: string, setErrorMessage: (message: string) => void): boolean => {
    if (!username.trim()) {
      setErrorMessage('Username is required');
      return false;
    }
    
    if (username.length < 3) {
      setErrorMessage('Username must be at least 3 characters');
      return false;
    }
    
    setErrorMessage('');
    return true;
  };
  
  // Validate password strength
  export const validatePassword = (password: string, setErrorMessage: (message: string) => void): boolean => {
    if (!password.trim()) {
      setErrorMessage('Password is required');
      return false;
    }
    
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return false;
    }
    
    setErrorMessage('');
    return true;
  };
  
  // Validate password confirmation
  export const validateConfirmPassword = (
    password: string, 
    confirmPassword: string, 
    setErrorMessage: (message: string) => void
  ): boolean => {
    if (!confirmPassword.trim()) {
      setErrorMessage('Please confirm your password');
      return false;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }
    
    setErrorMessage('');
    return true;
  };
  
  // Validate gender selection
  export const validateGender = (gender: string, setErrorMessage: (message: string) => void): boolean => {
    if (!gender) {
      setErrorMessage('Please select your gender');
      return false;
    }
    
    setErrorMessage('');
    return true;
  };
  
  // Validate date of birth
  export const validateDOB = (
    day: string, 
    month: string, 
    year: string, 
    setErrorMessage: (message: string) => void
  ): boolean => {
    if (!day || !month || !year) {
      setErrorMessage('Please enter your complete date of birth');
      return false;
    }
    
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
      setErrorMessage('Please enter valid numbers');
      return false;
    }
    
    if (dayNum < 1 || dayNum > 31) {
      setErrorMessage('Day must be between 1 and 31');
      return false;
    }
    
    if (monthNum < 1 || monthNum > 12) {
      setErrorMessage('Month must be between 1 and 12');
      return false;
    }
    
    const currentYear = new Date().getFullYear();
    if (yearNum < 1900 || yearNum > currentYear) {
      setErrorMessage(`Year must be between 1900 and ${currentYear}`);
      return false;
    }
    
    // Basic date validation
    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1) {
      setErrorMessage('Invalid date');
      return false;
    }
    
    setErrorMessage('');
    return true;
  };
  
  // Validate timezone selection
  export const validateTimezone = (timezone: string, setErrorMessage: (message: string) => void): boolean => {
    if (!timezone) {
      setErrorMessage('Please select your timezone');
      return false;
    }
    
    setErrorMessage('');
    return true;
  };
  
  // Validate height input
  export const validateHeight = (
    height: string, 
    heightUnit: string, 
    setErrorMessage: (message: string) => void
  ): boolean => {
    if (!height) {
      setErrorMessage('Please enter your height');
      return false;
    }
    
    const heightValue = parseFloat(height);
    if (isNaN(heightValue) || heightValue <= 0) {
      setErrorMessage('Please enter a valid height');
      return false;
    }
    
    // Reasonable height range validation
    if (heightUnit === 'cm') {
      if (heightValue < 50 || heightValue > 250) {
        setErrorMessage('Height should be between 50 and 250 cm');
        return false;
      }
    } else {
      // For feet (assuming format like 5.9 for 5'9")
      const feet = parseInt(height);
      const inches = Math.round((parseFloat(height) - feet) * 10);
      
      if (feet < 1 || feet > 8 || isNaN(inches) || inches < 0 || inches > 11) {
        setErrorMessage('Please enter a valid height (e.g., 5.9 for 5\'9")');
        return false;
      }
    }
    
    setErrorMessage('');
    return true;
  };
  
  // Validate weight input
  export const validateWeight = (
    weight: string, 
    weightUnit: string, 
    setErrorMessage: (message: string) => void
  ): boolean => {
    if (!weight) {
      setErrorMessage('Please enter your weight');
      return false;
    }
    
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setErrorMessage('Please enter a valid weight');
      return false;
    }
    
    // Reasonable weight range validation
    if (weightUnit === 'kg') {
      if (weightValue < 20 || weightValue > 250) {
        setErrorMessage('Weight should be between 20 and 250 kg');
        return false;
      }
    } else {
      // For pounds
      if (weightValue < 45 || weightValue > 550) {
        setErrorMessage('Weight should be between 45 and 550 lb');
        return false;
      }
    }
    
    setErrorMessage('');
    return true;
  };