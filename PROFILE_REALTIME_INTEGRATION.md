# Profile Component - Real-time Data Integration

## Overview
The Profile component now uses **real-time data** from Firebase Auth and Firestore instead of mock data. It automatically tracks user statistics, earnings, and study completions.

## Features

### ✅ Real-time Data
- **Firebase Authentication**: Automatically detects logged-in users
- **Firestore Integration**: Real-time user profile updates
- **Live Statistics**: Earnings, completed studies, and points update automatically

### ✅ User Statistics Tracking
- **Total Earnings**: Calculated from completed studies
- **Completed Studies**: Count of finished studies
- **Points System**: 10 points per euro earned
- **User Levels**: Débutant → Avancé → Expert (based on activity)

### ✅ Authentication States
- **Loading State**: Shows skeleton while data loads
- **Logged Out State**: Prompts user to log in
- **Error Handling**: Graceful error management

## Usage

### Basic Integration
```tsx
import { Profile } from './pages/Profile';

// The component automatically handles:
// - User authentication state
// - Real-time data loading
// - Statistics calculation
// - Logout functionality
```

### Tracking Study Completions
```tsx
import { trackStudyCompletion } from '../utils/userStats';

// When a user completes a study:
await trackStudyCompletion(
  userId,        // Firebase user ID
  studyId,       // Study ID
  studyTitle,    // Study title
  reward         // Reward amount in euros
);
```

## Data Structure

### User Profile (Firestore: `users/{userId}`)
```typescript
{
  uid: string;
  username: string;
  email: string;
  createdAt: Date;
  totalEarnings: number;
  completedStudies: number;
  totalPoints: number;
  level: 'Débutant' | 'Avancé' | 'Expert';
  lastUpdated: Date;
}
```

### Study Completions (Firestore: `userStudies`)
```typescript
{
  userId: string;
  studyId: string;
  studyTitle: string;
  reward: number;
  points: number;
  completedAt: Date;
  status: 'completed' | 'pending' | 'cancelled';
}
```

## User Levels

| Level | Requirements |
|-------|-------------|
| **Débutant** | Default level for new users |
| **Avancé** | 10+ studies OR €200+ earnings |
| **Expert** | 20+ studies OR €500+ earnings |

## Real-time Updates

The component uses Firestore's `onSnapshot` listener to automatically update when:
- User profile data changes
- New studies are completed
- Statistics are recalculated

## Error Handling

- **Network Errors**: Graceful fallback to default values
- **Authentication Errors**: Clear login prompts
- **Data Loading Errors**: Loading states with retry options

## Integration Points

### Firebase Auth
- `auth.onAuthStateChanged()` - Detects login/logout
- `signOut()` - Handles logout functionality

### Firestore Collections
- `users/{userId}` - User profile data
- `userStudies` - Study completion records

### Utility Functions
- `getUserStats()` - Calculate current statistics
- `trackStudyCompletion()` - Record study completion
- `calculateUserLevel()` - Determine user level

## Next Steps

1. **Study Integration**: Use `trackStudyCompletion()` when users finish studies
2. **Payment Integration**: Connect earnings to actual payment system
3. **Notifications**: Add real-time notifications for new studies
4. **Analytics**: Track user engagement and study completion rates
