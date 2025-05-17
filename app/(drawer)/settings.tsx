// app/(drawer)/settings.tsx
import ScreenTransition from '@/components/screenTransition';
import SlidingToggleButton from '@/components/SlidingToggleButton';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { logout } from '@/components/utils/authUtils';

// Setting item with toggle
const ToggleSetting = ({ icon, iconColor, label, description, isEnabled }) => (
  <View style={styles.settingItem}>
    <View style={styles.settingIconContainer}>
      {icon}
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingLabel}>{label}</Text>
      {description && <Text style={styles.settingDescription}>{description}</Text>}
    </View>
    <SlidingToggleButton />
  </View>
);

// Setting item with chevron (navigable)
const NavigableSetting = ({ icon, iconColor, label, description, onPress }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingIconContainer}>
      {icon}
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingLabel}>{label}</Text>
      {description && <Text style={styles.settingDescription}>{description}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={22} color="#D68D54" />
  </TouchableOpacity>
);

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [useMetric, setUseMetric] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes, Logout",
          onPress: async () => {
            // Call your actual logout function here
            await logout();
          }
        }
      ]
    );
  };

  return (
    <ScreenTransition type="fade">
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* We removed the custom header since we're using the navigation header now */}
        
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <NavigableSetting
            icon={<Ionicons name="person-circle-outline" size={24} color="#D68D54" />}
            label="Profile"
            description="Edit your personal information"
            onPress={() => Alert.alert('Navigate to Profile')}
          />
          
          <View style={styles.divider} />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <ToggleSetting
            icon={<Ionicons name="notifications-outline" size={24} color="#D68D54" />}
            label="Notifications"
            description="Receive reminders and updates"
            isEnabled={notificationsEnabled}
          />
          
          <View style={styles.separatorLine} />
          
          <ToggleSetting
            icon={<MaterialCommunityIcons name="ruler" size={24} color="#D68D54" />}
            label="Use Metric Units"
            description="Display measurements in metric (cm, kg)"
            isEnabled={useMetric}
          />
          
          <View style={styles.separatorLine} />
          
          <NavigableSetting
            icon={<Ionicons name="barbell-outline" size={24} color="#D68D54" />}
            label="Fitness Goals"
            description="Set and track your fitness objectives"
            onPress={() => router.push('/achievement_screen')}
          />
          
          <View style={styles.separatorLine} />
          
          <ToggleSetting
            icon={<Ionicons name="moon-outline" size={24} color="#D68D54" />}
            label="Dark Mode"
            description="Enable for better viewing in low light"
            isEnabled={darkMode}
          />
          
          <View style={styles.divider} />
        </View>

        {/* Help & Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          
          <NavigableSetting
            icon={<Ionicons name="help-circle-outline" size={24} color="#D68D54" />}
            label="FAQ"
            description="Frequently asked questions"
            onPress={() => Alert.alert('FAQ', 'Navigate to FAQ screen')}
          />
          
          <View style={styles.separatorLine} />
          
          <NavigableSetting
            icon={<Ionicons name="mail-outline" size={24} color="#D68D54" />}
            label="Contact Support"
            description="Get help with any issues"
            onPress={() => Alert.alert('Contact Support', 'Navigate to support screen')}
          />
          
          <View style={styles.separatorLine} />
          
          <NavigableSetting
            icon={<Ionicons name="document-text-outline" size={24} color="#D68D54" />}
            label="Terms of Service"
            onPress={() => Alert.alert('Terms of Service', 'Navigate to terms screen')}
          />
          
          <View style={styles.separatorLine} />
          
          <NavigableSetting
            icon={<Ionicons name="shield-outline" size={24} color="#D68D54" />}
            label="Privacy Policy"
            onPress={() => Alert.alert('Privacy Policy', 'Navigate to privacy screen')}
          />
          
          <View style={styles.divider} />
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutContainer}>
            <Image 
              source={require('@/assets/images/squirrel_flex.png')} 
              style={styles.appIcon}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Healthy Empower</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
          </View>
          
          <View style={styles.divider} />
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F4',
  },
  contentContainer: {
    paddingTop: 20, // Add some padding at the top
    paddingBottom: 40,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  settingIconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3A2A1F',
  },
  settingDescription: {
    fontSize: 14,
    color: '#9B8579',
    marginTop: 2,
  },
  separatorLine: {
    height: 1,
    backgroundColor: 'rgba(214, 141, 84, 0.1)',
    marginLeft: 60,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(214, 141, 84, 0.2)',
    marginTop: 8,
  },
  aboutContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  appIcon: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#9B8579',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D68D54',
    margin: 16,
    padding: 14,
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});