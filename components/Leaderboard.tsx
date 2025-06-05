import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLeaderboard, LeaderboardEntry, LeaderboardType } from '@/utils/leaderboardService';
import { ProfileAvatar } from './ProfileAvatar';

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = React.useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<LeaderboardType>('currency');
  const [currentUserId, setCurrentUserId] = React.useState<number | null>(null);

  React.useEffect(() => {
    getCurrentUser();
    fetchLeaderboard();
  }, [activeTab]);

  const getCurrentUser = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setCurrentUserId(userData.id);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getLeaderboard(activeTab, 20, true);
      setLeaderboardData(data || []);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const renderPodiumItem = (user: LeaderboardEntry, position: number) => {
    const podiumColors = {
      0: '#FFD700', // Gold for 1st
      1: '#C0C0C0', // Silver for 2nd  
      2: '#CD7F32', // Bronze for 3rd
    };

    const medals = ['🥇', '🥈', '🥉'];

    return (
      <View style={styles.podiumColumn} key={user.id}>
        {/* User Info */}
        <View style={styles.podiumUserInfo}>
          <ProfileAvatar 
            userId={user.id}
            size={position === 0 ? "large" : "medium"}
            borderColor={position === 0 ? "#FFD700" : "#D68D54"}
            borderWidth={position === 0 ? 3 : 2}
          />
          <Text style={[styles.podiumUsername, position === 0 && styles.winnerUsername]}>
            {user.username}
          </Text>
          <Text style={[styles.podiumScore, position === 0 && styles.winnerScore]}>
            {activeTab === 'currency' ? `${user.currency.toLocaleString()} 🌰` : `${user.current_streak} 🔥`}
          </Text>
        </View>
        
        {/* Podium Block */}
        <View style={[
          styles.podiumBlock,
          { backgroundColor: podiumColors[position] },
          position === 0 && styles.firstPlace,
          position === 1 && styles.secondPlace,
          position === 2 && styles.thirdPlace,
        ]}>
          <Text style={styles.podiumNumber}>{user.rank}</Text>
          <Text style={styles.podiumMedal}>{medals[position]}</Text>
        </View>
      </View>
    );
  };

  const renderListItem = ({ item }: { item: LeaderboardEntry }) => {
    const isCurrentUser = item.id === currentUserId;
    const isTopThree = item.rank <= 3;
    
    return (
      <Surface 
        style={[
          styles.listItem, 
          isCurrentUser && styles.currentUserItem,
          isTopThree && styles.topThreeListItem
        ]} 
        elevation={isCurrentUser ? 4 : (isTopThree ? 2 : 1)}
      >
        <View style={styles.listItemContent}>
          <View style={styles.rankContainer}>
            <Text style={[
              styles.rankText, 
              isCurrentUser && styles.currentUserRankText,
              isTopThree && styles.topThreeRankText
            ]}>
              {item.rank}
            </Text>
            {isTopThree && (
              <Text style={styles.rankEmoji}>
                {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}
              </Text>
            )}
          </View>
          
          <ProfileAvatar 
            userId={item.id}
            size="medium"
            borderColor={
              isCurrentUser ? "#4CAF50" : 
              isTopThree ? "#D68D54" : "#E8E8E8"
            }
            borderWidth={isCurrentUser ? 3 : isTopThree ? 2 : 2}
          />
          
          <View style={styles.userInfo}>
            <Text style={[
              styles.usernameText, 
              isCurrentUser && styles.currentUserUsername,
              isTopThree && styles.topThreeUsername
            ]}>
              {item.username} {isCurrentUser && '(You)'}
            </Text>
            <Text style={styles.streakText}>
              {activeTab === 'currency' ? `🔥 ${item.current_streak}` : `${item.currency.toLocaleString()} 🌰`}
            </Text>
          </View>
          
          <View style={styles.valueContainer}>
            <Text style={[
              styles.valueText, 
              isCurrentUser && styles.currentUserValueText,
              isTopThree && styles.topThreeValueText
            ]}>
              {activeTab === 'currency' ? item.currency.toLocaleString() : item.current_streak}
            </Text>
            <Text style={styles.valueIcon}>
              {activeTab === 'currency' ? '🌰' : '🔥'}
            </Text>
          </View>
        </View>
      </Surface>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D68D54" />
        <Text style={styles.loadingText}>Loading podium...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load leaderboard</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchLeaderboard}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const topThree = leaderboardData.slice(0, 3);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'currency' && styles.activeTab]}
            onPress={() => setActiveTab('currency')}
          >
            <Text style={[styles.tabText, activeTab === 'currency' && styles.activeTabText]}>
              💰 Acorns
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'streaks' && styles.activeTab]}
            onPress={() => setActiveTab('streaks')}
          >
            <Text style={[styles.tabText, activeTab === 'streaks' && styles.activeTabText]}>
              🔥 Streaks
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Podium Display */}
      {topThree.length >= 3 && (
        <View style={styles.podiumContainer}>
          <View style={styles.podium}>
            {/* 2nd Place (Left) */}
            {renderPodiumItem(topThree[1], 1)}
            {/* 1st Place (Center) */}
            {renderPodiumItem(topThree[0], 0)}
            {/* 3rd Place (Right) */}
            {renderPodiumItem(topThree[2], 2)}
          </View>
        </View>
      )}

      {/* Divider */}
      {topThree.length >= 3 && leaderboardData.length > 0 && (
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerLine} />
        </View>
      )}

      {/* Full Leaderboard */}
      {leaderboardData.length > 0 && (
        <View style={styles.leaderboardContainer}>
          <FlatList
            data={leaderboardData}
            renderItem={renderListItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {topThree.length < 3 && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Not enough champions yet!</Text>
          <Text style={styles.noDataSubtext}>Keep working out to claim your spot! 💪</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF7F4',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9B8579',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF7F4',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#D68D54',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(214, 141, 84, 0.1)',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#D68D54',
    shadowColor: '#D68D54',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9B8579',
  },
  activeTabText: {
    color: 'white',
  },
  podiumContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    marginTop: -10,
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 180,
    width: '85%',
    marginHorizontal: 20,
  },
  podiumColumn: {
    flex: 1,
    alignItems: 'center',
  },
  podiumUserInfo: {
    alignItems: 'center',
    marginBottom: 10,
  },
  crown: {
    fontSize: 16,
    marginTop: -5,
    marginBottom: 3,
  },
  podiumUsername: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3A2A1F',
    textAlign: 'center',
    marginBottom: 3,
  },
  winnerUsername: {
    fontSize: 15,
    color: '#FFD700',
    fontWeight: '800',
  },
  podiumScore: {
    fontSize: 12,
    color: '#D68D54',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  winnerScore: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '800',
  },
  podiumBlock: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  firstPlace: {
    height: 80,
  },
  secondPlace: {
    height: 60,
  },
  thirdPlace: {
    height: 45,
  },
  podiumNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  podiumMedal: {
    fontSize: 16,
    marginTop: 2,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noDataText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3A2A1F',
    textAlign: 'center',
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 16,
    color: '#9B8579',
    textAlign: 'center',
  },
  // Divider Styles
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginTop: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(214, 141, 84, 0.3)',
  },
  dividerTextContainer: {
    backgroundColor: '#FAF7F4',
    paddingHorizontal: 15,
  },
  dividerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D68D54',
    textAlign: 'center',
  },
  // Leaderboard List Styles
  leaderboardContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  listItem: {
    marginVertical: 3,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  topThreeListItem: {
    borderWidth: 1,
    borderColor: 'rgba(214, 141, 84, 0.3)',
    backgroundColor: '#FFF9F5',
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8E9',
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  rankContainer: {
    width: 35,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D68D54',
  },
  topThreeRankText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#B8651A',
  },
  currentUserRankText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4CAF50',
  },
  rankEmoji: {
    fontSize: 12,
    marginTop: 2,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  usernameText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3A2A1F',
  },
  topThreeUsername: {
    fontSize: 16,
    fontWeight: '800',
    color: '#B8651A',
  },
  currentUserUsername: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4CAF50',
  },
  streakText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D68D54',
    marginRight: 4,
  },
  topThreeValueText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#B8651A',
  },
  currentUserValueText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4CAF50',
  },
  valueIcon: {
    fontSize: 14,
  },
});

export default Leaderboard;