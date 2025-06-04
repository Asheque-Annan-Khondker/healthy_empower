import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUser } from '../../../utils/authState';
import { API_URL } from '../../../constants/DBAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Exercise {
  exercise_id: number;
  name: string;
  description?: string;
  muscle_group?: string;
  equipment?: string;
}

interface WorkoutPlan {
  plan_id: number;
  name: string;
  description?: string;
  difficulty?: string;
}

interface WorkoutLogEntry {
  log_id: number;
  user_id: number;
  exercise_id: number;
  workout_plan_id: number | null;
  completed_at: string;
  sets_completed: number | null;
  reps_completed: number | null;
  duration: number | null;
  notes: string | null;
  Exercise: Exercise;
  WorkoutPlan?: WorkoutPlan;
}

export default function WorkoutLogScreen() {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkoutLogs = async () => {
    try {
      const user = await getCurrentUser();
      if (!user || !user.id) {
        Alert.alert('Error', 'Please log in to view your workout history');
        return;
      }

      const apiUrl = await API_URL();
      const token = await AsyncStorage.getItem('authToken');
      
      const response = await fetch(`${apiUrl}/api/users/${user.id}/workout-logs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response URL:', response.url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch workout logs: ${response.status}`);
      }

      const logs = await response.json();
      console.log('Fetched workout logs:', logs);
      console.log('Number of logs:', logs.length);
      if (logs.length > 0) {
        console.log('First log item:', JSON.stringify(logs[0], null, 2));
      }
      setWorkoutLogs(logs);
    } catch (error) {
      console.error('Error fetching workout logs:', error);
      Alert.alert('Error', 'Failed to load workout history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkoutLogs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkoutLogs();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) return 'N/A';
    
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const renderWorkoutLogItem = ({ item }: { item: WorkoutLogEntry }) => (
    <View style={styles.logItem}>
      {item.WorkoutPlan && (
        <View style={styles.workoutPlanBadge}>
          <Ionicons name="barbell" size={14} color="#FFFFFF" />
          <Text style={styles.workoutPlanName}>{item.WorkoutPlan.name}</Text>
        </View>
      )}
      
      <View style={styles.logHeader}>
        <Text style={styles.exerciseName}>{item.Exercise.name}</Text>
        <Text style={styles.date}>{formatDate(item.completed_at)}</Text>
      </View>
      
      <View style={styles.logDetails}>
        {item.sets_completed && (
          <View style={styles.detailItem}>
            <Ionicons name="fitness" size={16} color="#D68D54" />
            <Text style={styles.detailText}>{item.sets_completed} sets</Text>
          </View>
        )}
        
        {item.reps_completed && (
          <View style={styles.detailItem}>
            <Ionicons name="repeat" size={16} color="#D68D54" />
            <Text style={styles.detailText}>{item.reps_completed} reps</Text>
          </View>
        )}
        
        {item.duration && (
          <View style={styles.detailItem}>
            <Ionicons name="time" size={16} color="#D68D54" />
            <Text style={styles.detailText}>{formatDuration(item.duration)}</Text>
          </View>
        )}
      </View>
      
      {item.Exercise.muscle_group && (
        <Text style={styles.muscleGroup}>Target: {item.Exercise.muscle_group}</Text>
      )}
      
      {item.notes && (
        <Text style={styles.notes}>{item.notes}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading workout history...</Text>
      </View>
    );
  }

  if (workoutLogs.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="fitness-outline" size={64} color="#D68D54" />
        <Text style={styles.emptyTitle}>No Workouts Yet</Text>
        <Text style={styles.emptySubtitle}>
          Complete your first workout to see your history here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={workoutLogs}
        renderItem={renderWorkoutLogItem}
        keyExtractor={(item) => item.log_id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#D68D54']}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContainer: {
    padding: 16,
  },
  logItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  logDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  muscleGroup: {
    fontSize: 12,
    color: '#D68D54',
    fontWeight: '500',
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  workoutPlanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D68D54',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  workoutPlanName: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
});