import { MoodEntry } from '../types';

const MOODS_STORAGE_KEY = 'pocketTherapistMoods';

/**
 * Loads mood entries for a specific user from localStorage.
 * @param currentUser The email of the logged-in user.
 * @returns An array of MoodEntry objects.
 */
export const loadMoods = (currentUser: string): MoodEntry[] => {
  try {
    const allMoodData = JSON.parse(localStorage.getItem(MOODS_STORAGE_KEY) || '{}');
    return allMoodData[currentUser] || [];
  } catch (error) {
    console.error("Failed to load mood data:", error);
    return [];
  }
};

/**
 * Saves a new mood entry for a specific user to localStorage.
 * @param currentUser The email of the logged-in user.
 * @param newEntry The new MoodEntry to save.
 * @returns The updated array of MoodEntry objects for the user.
 */
export const saveMood = (currentUser: string, newEntry: MoodEntry): MoodEntry[] => {
  try {
    const allMoodData = JSON.parse(localStorage.getItem(MOODS_STORAGE_KEY) || '{}');
    const userMoods = allMoodData[currentUser] || [];
    const updatedUserMoods = [newEntry, ...userMoods];
    const updatedAllMoodData = { ...allMoodData, [currentUser]: updatedUserMoods };
    localStorage.setItem(MOODS_STORAGE_KEY, JSON.stringify(updatedAllMoodData));
    return updatedUserMoods;
  } catch (error) {
    console.error("Failed to save mood data:", error);
    const currentMoods = loadMoods(currentUser);
    return [newEntry, ...currentMoods];
  }
};
