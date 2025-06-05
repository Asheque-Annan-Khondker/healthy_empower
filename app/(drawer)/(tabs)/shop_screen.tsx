import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, 
        Button, Alert, Dimensions } from 'react-native';
import { PaperProvider as Provider, Dialog, Portal} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import TestSquare from '@/components/anime_square';
import Modal from 'react-native-modal';
import UnifiedFAB from '@/components/UnifiedFAB';

const { height, width } = Dimensions.get('window');

// Shop screen with header similar to Achievements screen
export default function ShopScreen() {
  const [balance, setBalance] = useState(3810);
  const [streakFreezeCount, setStreakFreezeCount] = useState(5);
  const [timerBoostQuantity, setTimerBoostQuantity] = useState(0);
  const [doubleXPQuantity, setDoubleXPQuantity] = useState(0);

  // Shop items grouped by category
  // Shop items grouped by category
  const shopSections = [
    {
      id: 'streak',
      title: 'Streak',
      items: [
        {
          id: 1,
          name: 'Streak Freeze',
          price: 150,
          description: 'Protect your streak if you miss a day of practice.',
          iconName: 'snow-outline',
          status: `${streakFreezeCount}/5 EQUIPPED`,
          isEquipped: true
        }
      ]
    },
    {
      id: 'powerups',
      title: 'Power-Ups',
      items: [
        {
          id: 2,
          name: 'Timer Boost',
          price: 450,
          description: 'Add extra time and beat the clock on timed challenges!',
          iconName: 'timer-outline',
          quantity: timerBoostQuantity
        },
        {
          id: 3,
          name: 'Double XP',
          price: 600,
          description: 'Earn twice as much XP for completed workouts.',
          iconName: 'flash-outline',
          quantity: doubleXPQuantity
        }
      ]
    },
    {
      id: 'promo',
      title: 'Promo Code',
      items: [
        {
          id: 4,
          name: 'Redeem a promo code',
          description: 'Enter a promo code to earn rewards',
          iconName: 'ticket-outline',
          isPromo: true
        }
      ]
    }
  ];

  const buyPowerUp = (item, balance) => {
    
    // set balance
    if (balance-item.price < 0) {
      // NEED TO EXPAND THIS
      Alert.alert("You have insufficient acorns!");
      return;
    } else {
      setBalance(balance-item.price)
      // show quantity owned
      if (item.name === "Timer Boost") {
        setTimerBoostQuantity(item.quantity+1)
      } else if (item.name === "Double XP") {
        setDoubleXPQuantity(item.quantity+1)
      }
    }
    
  }
  
  // Removed streak banner as requested

  // Render shop item
  const renderShopItem = (item) => {
    // For promo code item that has a REDEEM button
    if (item.isPromo) {
      return (
        <View key={item.id} style={styles.itemCard}>
          <View style={styles.itemContent}>
            <View style={styles.itemIconContainer}>
              <View style={[styles.itemIcon, { backgroundColor: 'rgba(214, 141, 84, 0.15)' }]}>
                <Ionicons name={item.iconName} size={30} color="#D68D54" />
              </View>
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.redeemButton}>
            <Text style={styles.redeemButtonText}>REDEEM</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // For equipped items with status indicator
    if (item.isEquipped) {
      return (
        <View key={item.id} style={styles.itemCard}>
          <View style={styles.itemContent}>
            <View style={styles.itemIconContainer}>
              <View style={[styles.itemIcon, { backgroundColor: 'rgba(214, 141, 84, 0.15)' }]}>
                <Ionicons name={item.iconName} size={30} color="#D68D54" />
              </View>
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <View style={styles.itemStatusContainer}>
                <Text style={styles.itemStatusText}>{item.status}</Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

    // For regular items with price
    return (
      <View key={item.id} style={styles.itemCard}>

        <View style={styles.itemContent}>

          <View style={styles.itemIconContainer}>
            <View style={[styles.itemIcon, { backgroundColor: 'rgba(214, 141, 84, 0.15)' }]}>
              <Ionicons name={item.iconName} size={30} color="#D68D54" />
            </View>
          </View>

          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>

        </View>

        <View style={styles.itemQuantityContainer}>
          <Text style={styles.itemQuantityText} >{item.quantity} x</Text>
        </View>

        <View style={styles.itemPriceContainer}>
          {/**
          <Button onPress={() => buyPowerUp(item, balance)} color='#D68D54' title={String(item.price)+ " 🌰"} />
           */}
          <Button onPress={() => buyPowerUp(item, balance)} color='#D68D54' title={String(item.price)+ " 🌰"} />
        </View>

      </View>
    );
  };

  // Render shop section with title and items
  const renderShopSection = (section) => (
    <View key={section.id} style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.items.map(renderShopItem)}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/** Main scroll view  */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {shopSections.map(renderShopSection)}
      </ScrollView>
      
      {/* Unified FAB System */}
      <UnifiedFAB 
        screenType="shop"
        onFoodAdded={() => console.log('Food added from shop screen')}
        onMealAdded={() => console.log('Meal added from shop screen')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  streakBanner: {
    // Styles kept for reference but not used as streak banner has been removed
    backgroundColor: 'rgba(214, 141, 84, 0.15)',
    marginHorizontal: 30,
    marginVertical: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D68D54',
    display: 'none', // Hide the banner
  },
  streakText: {
    color: '#D68D54',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionContainer: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3A2A1F', // Dark brown text
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(214, 141, 84, 0.2)', // Light orange border
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIconContainer: {
    marginRight: 16,
  },
  itemIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(214, 141, 84, 0.3)',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A2A1F', // Dark brown text
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#9B8579', // Medium brown/gray text
    marginBottom: 8,
  },
  itemStatusContainer: {
    backgroundColor: 'rgba(214, 141, 84, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#D68D54',
  },
  itemStatusText: {
    color: '#D68D54',
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
    backgroundColor: 'rgba(214, 141, 84, 0.1)', 
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  itemQuantityContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    left: 16,
    bottom: 16,
    justifyContent: 'flex-start',
    marginTop: 12,
    backgroundColor: 'rgba(214, 141, 84, 0.1)', 
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16
  },
  itemQuantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D68D54' // Orange brand color
  },
  redeemButton: {
    backgroundColor: '#D68D54',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  redeemButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  }
});