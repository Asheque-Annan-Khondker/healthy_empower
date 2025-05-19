import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Surface } from 'react-native-paper';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Mock data with more normal names
const mockData = [
  { id: '1', username: 'Ashe', streakDays: 142, acorns: 10200, avatar: require('../assets/images/squirrel_flex.png') },
  { id: '2', username: 'Safal', streakDays: 138, acorns: 9800, avatar: require('../assets/images/squirrel_flex.png') },
  { id: '3', username: 'Jon', streakDays: 135, acorns: 8600, avatar: require('../assets/images/squirrel_flex.png') },
  { id: '4', username: 'Khang', streakDays: 130, acorns: 8100, avatar: require('../assets/images/squirrel_flex.png') },
  { id: '5', username: 'Syed', streakDays: 128, acorns: 7800, avatar: require('../assets/images/squirrel_flex.png') },
  { id: '6', username: 'Emma', streakDays: 125, acorns: 7500, avatar: require('../assets/images/squirrel_flex.png') },
  { id: '7', username: 'Liam', streakDays: 120, acorns: 7200, avatar: require('../assets/images/squirrel_flex.png') },
  { id: '8', username: 'Olivia', streakDays: 115, acorns: 6900, avatar: require('../assets/images/squirrel_flex.png') },
  { id: '9', username: 'Noah', streakDays: 110, acorns: 6500, avatar: require('../assets/images/squirrel_flex.png') },
  { id: '10', username: 'Sophia', streakDays: 105, acorns: 6100, avatar: require('../assets/images/squirrel_flex.png') },
];

// Current user
const currentUser = {
  id: '5',
  username: 'Syed',
  streakDays: 128,
  acorns: 7800,
  avatar: require('../assets/images/squirrel_flex.png')
};

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('acorns'); // Default to acorns tab to match the mockup
  
  // Sort data based on active tab
  const sortedData = [...mockData].sort((a, b) => {
    if (activeTab === 'streaks') {
      return b.streakDays - a.streakDays;
    } else {
      return b.acorns - a.acorns;
    }
  });
  
  // Top 3 users for podium
  const topThree = sortedData.slice(0, 3);
  
  // Remaining users for the list (starting from 4th position)
  const remainingUsers = sortedData.slice(3);
  
  // Render regular list item
  const renderItem = ({ item, index }) => {
    const rank = index + 4; // +4 because we're starting from 4th position
    const isCurrentUser = item.id === currentUser.id;
    
    return (
      <Surface style={[styles.itemCard, isCurrentUser && styles.currentUserCard]}>
        <View style={styles.cardContent}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>{rank}</Text>
          </View>
          <Image source={item.avatar} style={styles.avatarSmall} />
          <Text style={styles.username}>{item.username}</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>
              {activeTab === 'streaks' ? item.streakDays : item.acorns}
            </Text>
            <Text style={styles.scoreUnit}>🌰</Text>
          </View>
        </View>
      </Surface>
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'streaks' && styles.activeTab]}
          onPress={() => setActiveTab('streaks')}
        >
          <FontAwesome 
            name="fire" 
            size={18} 
            color={activeTab === 'streaks' ? '#D68D54' : '#9B8579'} 
          />
          <Text style={[styles.tabText, activeTab === 'streaks' && styles.activeTabText]}>
            Streaks
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'acorns' && styles.activeTab]}
          onPress={() => setActiveTab('acorns')}
        >
          <Text style={{ fontSize: 18, marginRight: 6 }}>🌰</Text>
          <Text style={[styles.tabText, activeTab === 'acorns' && styles.activeTabText]}>
            Acorns
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Podium section */}
      <View style={styles.podiumSection}>
        {/* Podium layout */}
        <View style={styles.podiumLayout}>
          {/* Users on podium */}
          <View style={styles.usersRow}>
            {/* Second place */}
            <View style={styles.userPodiumItem}>
              <View style={styles.userAvatarContainer}>
                <Image source={topThree[1]?.avatar} style={styles.avatarMedium} />
                <View style={styles.medalBadge}>
                  <Text style={{ fontSize: 14 }}>🥈</Text>
                </View>
              </View>
              <Text style={styles.podiumUsername}>{topThree[1]?.username}</Text>
              <Text style={styles.podiumScore}>
                {activeTab === 'streaks' ? topThree[1]?.streakDays : topThree[1]?.acorns}
                <Text style={{ fontSize: 14 }}>🌰</Text>
              </Text>
            </View>
            
            {/* First place */}
            <View style={styles.userPodiumItem}>
              <View style={styles.crownContainer}>
                <Text style={{ fontSize: 20 }}>👑</Text>
              </View>
              <View style={[styles.userAvatarContainer, styles.firstPlaceAvatar]}>
                <Image source={topThree[0]?.avatar} style={styles.avatarLarge} />
                <View style={[styles.medalBadge, styles.firstPlaceMedal]}>
                  <Text style={{ fontSize: 14 }}>🏆</Text>
                </View>
              </View>
              <Text style={[styles.podiumUsername, styles.firstPlaceUsername]}>{topThree[0]?.username}</Text>
              <Text style={[styles.podiumScore, styles.firstPlaceScore]}>
                {activeTab === 'streaks' ? topThree[0]?.streakDays : topThree[0]?.acorns}
                <Text style={{ fontSize: 14 }}>🌰</Text>
              </Text>
            </View>
            
            {/* Third place */}
            <View style={styles.userPodiumItem}>
              <View style={styles.userAvatarContainer}>
                <Image source={topThree[2]?.avatar} style={styles.avatarMedium} />
                <View style={styles.medalBadge}>
                  <Text style={{ fontSize: 14 }}>🥉</Text>
                </View>
              </View>
              <Text style={styles.podiumUsername}>{topThree[2]?.username}</Text>
              <Text style={styles.podiumScore}>
                {activeTab === 'streaks' ? topThree[2]?.streakDays : topThree[2]?.acorns}
                <Text style={{ fontSize: 14 }}>🌰</Text>
              </Text>
            </View>
          </View>
          
          {/* Podium stands */}
          <View style={styles.podiumStands}>
            <View style={[styles.podiumStand, styles.secondPlaceStand]}>
              <Text style={styles.podiumRank}>2</Text>
            </View>
            <View style={[styles.podiumStand, styles.firstPlaceStand]}>
              <Text style={styles.podiumRank}>1</Text>
            </View>
            <View style={[styles.podiumStand, styles.thirdPlaceStand]}>
              <Text style={styles.podiumRank}>3</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Rankings list */}
      <View style={styles.rankingsList}>
        <Text style={styles.rankingsHeaderText}>Rankings</Text>
        <FlatList
          data={remainingUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4f0',
  },
  tabs: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'rgba(214, 141, 84, 0.1)',
  },
  tabText: {
    fontWeight: '600',
    color: '#9B8579',
    marginLeft: 6,
    fontSize: 15,
  },
  activeTabText: {
    color: '#D68D54',
  },
  podiumSection: {
    margin: 16,
    backgroundColor: '#f2e7de',
    borderRadius: 12,
    padding: 16,
    paddingTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  podiumLayout: {
    alignItems: 'center',
  },
  usersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 10,
  },
  userPodiumItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    position: 'relative',
  },
  userAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 8,
  },
  firstPlaceAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  avatarMedium: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  avatarLarge: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  medalBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: 'white',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  firstPlaceMedal: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  crownContainer: {
    position: 'absolute',
    top: -20,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  podiumUsername: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3A2A1F',
    marginBottom: 4,
    textAlign: 'center',
  },
  firstPlaceUsername: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D68D54',
  },
  podiumScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 8,
  },
  firstPlaceScore: {
    fontSize: 18,
    color: '#D68D54',
  },
  podiumStands: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
  },
  podiumStand: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  firstPlaceStand: {
    height: 50,
    backgroundColor: '#D68D54',
    elevation: 3,
  },
  secondPlaceStand: {
    height: 35,
    backgroundColor: '#c0c0c0',
    elevation: 2,
  },
  thirdPlaceStand: {
    height: 25,
    backgroundColor: '#cd7f32',
    elevation: 1,
  },
  podiumRank: {
    color: 'white',
    fontWeight: 'bold',
  },
  rankingsList: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: 6,
  },
  rankingsHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 12,
    marginLeft: 4,
  },
  list: {
    paddingBottom: 20,
  },
  itemCard: {
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#f8f4f0',
    overflow: 'hidden',
  },
  currentUserCard: {
    borderWidth: 1,
    borderColor: '#D68D54',
    backgroundColor: 'rgba(214, 141, 84, 0.05)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f2e7de',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontWeight: 'bold',
    color: '#3A2A1F',
    fontSize: 14,
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  username: {
    flex: 1,
    fontWeight: '500',
    color: '#3A2A1F',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreValue: {
    fontWeight: 'bold',
    color: '#D68D54',
    fontSize: 16,
    marginRight: 4,
  },
  scoreUnit: {
    fontSize: 14,
  },
});

export default Leaderboard;