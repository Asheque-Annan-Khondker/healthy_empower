import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface WorkoutCompletionModalProps {
  visible: boolean;
  onClose: () => void;
  workoutName: string;
  rewardEarned: number;
  newBalance: number;
}

export const WorkoutCompletionModal: React.FC<WorkoutCompletionModalProps> = ({
  visible,
  onClose,
  workoutName,
  rewardEarned,
  newBalance
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['#D68D54', '#B25B28']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="trophy" size={60} color="white" />
            </View>
            
            <Text style={styles.congratsText}>Congratulations!</Text>
            <Text style={styles.workoutText}>You completed</Text>
            <Text style={styles.workoutName}>{workoutName}</Text>
            
            <View style={styles.rewardContainer}>
              <Text style={styles.rewardText}>You earned</Text>
              <View style={styles.currencyContainer}>
                <Text style={styles.rewardAmount}>+{rewardEarned}</Text>
                <Text style={styles.chestnutIcon}>🌰</Text>
              </View>
            </View>
            
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceText}>New Balance: {newBalance} 🌰</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>Awesome!</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    padding: 30,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  workoutText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 5,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 30,
  },
  rewardContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rewardText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  rewardAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  chestnutIcon: {
    fontSize: 28,
  },
  balanceContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 25,
  },
  balanceText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#B25B28',
    fontSize: 18,
    fontWeight: 'bold',
  },
});