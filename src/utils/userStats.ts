// User statistics tracking utilities
import { db, doc, updateDoc, collection, addDoc, query, where, getDocs } from '../auth/firebase';

export interface StudyCompletion {
  userId: string;
  studyId: string;
  studyTitle: string;
  reward: number;
  points: number;
  completedAt: Date;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface UserStats {
  totalEarnings: number;
  completedStudies: number;
  totalPoints: number;
  level: string;
}

/**
 * Track when a user completes a study
 */
export const trackStudyCompletion = async (
  userId: string,
  studyId: string,
  studyTitle: string,
  reward: number
): Promise<void> => {
  try {
    const points = reward * 10; // 10 points per euro
    
    // Add completion record to userStudies collection
    await addDoc(collection(db, 'userStudies'), {
      userId,
      studyId,
      studyTitle,
      reward,
      points,
      completedAt: new Date(),
      status: 'completed'
    });

    // Update user's total statistics
    await updateUserStats(userId, reward, points);
    
    console.log(`Study completion tracked for user ${userId}: ${studyTitle}`);
  } catch (error) {
    console.error('Error tracking study completion:', error);
    throw error;
  }
};

/**
 * Update user's total statistics
 */
export const updateUserStats = async (
  userId: string,
  additionalEarnings: number,
  additionalPoints: number
): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    // Get current stats
    const currentStats = await getUserStats(userId);
    
    // Update with new values
    await updateDoc(userDocRef, {
      totalEarnings: currentStats.totalEarnings + additionalEarnings,
      completedStudies: currentStats.completedStudies + 1,
      totalPoints: currentStats.totalPoints + additionalPoints,
      level: calculateUserLevel(currentStats.completedStudies + 1, currentStats.totalEarnings + additionalEarnings),
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
};

/**
 * Get user's current statistics
 */
export const getUserStats = async (userId: string): Promise<UserStats> => {
  try {
    // Query completed studies for this user
    const studiesQuery = query(
      collection(db, 'userStudies'),
      where('userId', '==', userId),
      where('status', '==', 'completed')
    );
    
    const querySnapshot = await getDocs(studiesQuery);
    
    let totalEarnings = 0;
    let completedStudies = 0;
    let totalPoints = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalEarnings += data.reward || 0;
      completedStudies += 1;
      totalPoints += data.points || (data.reward || 0) * 10;
    });

    return {
      totalEarnings,
      completedStudies,
      totalPoints,
      level: calculateUserLevel(completedStudies, totalEarnings)
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      totalEarnings: 0,
      completedStudies: 0,
      totalPoints: 0,
      level: 'Débutant'
    };
  }
};

/**
 * Calculate user level based on activity
 */
export const calculateUserLevel = (completedStudies: number, totalEarnings: number): string => {
  if (completedStudies >= 20 || totalEarnings >= 500) return 'Expert';
  if (completedStudies >= 10 || totalEarnings >= 200) return 'Avancé';
  return 'Débutant';
};

/**
 * Get user's study history
 */
export const getUserStudyHistory = async (userId: string): Promise<StudyCompletion[]> => {
  try {
    const studiesQuery = query(
      collection(db, 'userStudies'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(studiesQuery);
    
    const history: StudyCompletion[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      history.push({
        userId: data.userId,
        studyId: data.studyId,
        studyTitle: data.studyTitle,
        reward: data.reward,
        points: data.points,
        completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : new Date(),
        status: data.status
      });
    });

    // Sort by completion date (newest first)
    return history.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  } catch (error) {
    console.error('Error getting user study history:', error);
    return [];
  }
};
