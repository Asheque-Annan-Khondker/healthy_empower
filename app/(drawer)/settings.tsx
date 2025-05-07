import ScreenTransition from '@/components/screenTransition';
import SlidingToggleButton from '@/components/SlidingToggleButton';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [useMetric, setUseMetric] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();


  return (
    <ScreenTransition type="zoom">
      <View style={styles.container}>
        <Text style={styles.header}>Settings</Text>

        {/* Profile */}
        <TouchableOpacity style={styles.row} onPress={() => Alert.alert('Navigate to Profile')}>
          <View style={styles.rowLeft}>
            <Ionicons name="person-circle-outline" size={20} color="#666" />
            <Text style={styles.label}>Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Notifications */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="notifications-outline" size={20} color="#666" />
            <Text style={styles.label}>Notifications</Text>
          </View>
          <SlidingToggleButton />
        </View>

        {/*Use metric units*/}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="stats-chart-outline" size={20} color="#666" />
            <Text style={styles.label}>Use Metric Units</Text>
          </View>
          <SlidingToggleButton />
        </View>

        {/* Fitness Goals */}
        <TouchableOpacity style={styles.row} onPress={() => router.push('/achievement_screen')}>
          <View style={styles.rowLeft}>
            <Ionicons name="barbell-outline" size={20} color="#666" />
            <Text style={styles.label}>Fitness Goals</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>


        {/* Dark Mode */}
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon-outline" size={20} color="#666" />
            <Text style={styles.label}>Dark Mode</Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert('Dark Mode: Early Access', 'Thank you for testing out dark mode!')
              }
            >
              <Ionicons name="information-circle-outline" size={18} color="#666" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
          <SlidingToggleButton />
        </View>


        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => Alert.alert('You have been logged out')}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // or use marginLeft for icons/text
  },
  
  label: {
    fontSize: 16,
    color: '#333',
    gap: 10,
    marginLeft: 8,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#df4aed',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
