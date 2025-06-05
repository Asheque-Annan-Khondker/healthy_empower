import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, 
        Button, Alert, Dimensions, Image } from 'react-native';
import { PaperProvider as Provider, Dialog, Portal} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import TestSquare from '@/components/anime_square';
import Modal from 'react-native-modal';
import CurrencyStreakIndicator from '@/components/CurrencyStreakIndicator';
import { getUserCurrency, subtractCurrency } from '@/utils/currencyService';
import { getCostumeImage, purchaseCostume, updateUserCostume } from '@/utils/costumeService';
import { 
  regular_squirrel, 
  fitness_squirrel, 
  tennis_squirrel, 
  construction_squirrel, 
  doctor_squirrel 
} from '@/assets/images';

const { height, width } = Dimensions.get('window');

// Shop screen with header similar to Achievements screen
export default function ShopScreen() {
  const [balance, setBalance] = useState(0);
  const [streakFreezeCount, setStreakFreezeCount] = useState(5);
  const [doubleAcornCount, setDoubleAcornCount] = useState(0);
  const [currencyRefreshKey, setCurrencyRefreshKey] = useState(0);
  const [activeSection, setActiveSection] = useState('powerups'); // 'powerups' or 'costumes'

  useEffect(() => {
    loadUserCurrency();
  }, []);

  const loadUserCurrency = async () => {
    try {
      const currency = await getUserCurrency();
      setBalance(currency);
    } catch (error) {
      console.error('Failed to load user currency:', error);
    }
  };

  // Powerups sections
  const powerupSections = [
    {
      id: 'streak',
      title: 'Streak Protection',
      items: [
        {
          id: 1,
          name: 'Streak Freeze',
          price: 150,
          description: 'Keep your streak alive even if you miss a day! Each freeze protects you from losing your progress.',
          iconName: 'snow-outline',
          quantity: streakFreezeCount,
          maxQuantity: 5
        }
      ]
    },
    {
      id: 'buffs',
      title: 'Power Buffs',
      items: [
        {
          id: 2,
          name: 'Double Acorn Buff',
          price: 300,
          description: 'Activate to earn double acorns from all activities for 24 hours! Stack multiple buffs for extended duration.',
          iconName: 'flash',
          quantity: doubleAcornCount,
          isDoubleAcorn: true
        }
      ]
    }
  ];

  // Costume sections
  const costumeSections = [
    {
      id: 'character',
      title: 'Character Outfits',
      items: [
        {
          id: 3,
          name: 'Regular',
          price: 100,
          description: 'The classic look! Simple, natural, and always in style. Perfect for squirrels who love the basics.',
          isCostume: true,
          rarity: 'common',
          isEquipped: true
        },
        {
          id: 4,
          name: 'Fitness',
          price: 350,
          description: 'Get pumped with this athletic outfit! Complete with workout gear and motivational energy.',
          isCostume: true,
          rarity: 'common'
        },
        {
          id: 5,
          name: 'Tennis',
          price: 1200,
          description: 'Serve up some style! This ultra-rare tennis outfit includes a racket, visor, and championship attitude. Court royalty!',
          isCostume: true,
          rarity: 'legendary'
        },
        {
          id: 6,
          name: 'Construction',
          price: 600,
          description: 'Build your way to fitness! This hardworking outfit features a hard hat, tool belt, and construction expertise.',
          isCostume: true,
          rarity: 'epic'
        },
        {
          id: 7,
          name: 'Doctor',
          price: 800,
          description: 'Prescribe yourself some health! This professional medical outfit includes stethoscope and healing wisdom.',
          isCostume: true,
          rarity: 'rare'
        }
      ]
    }
  ];

  // Get current sections based on active tab
  const getCurrentSections = () => {
    return activeSection === 'powerups' ? powerupSections : costumeSections;
  };

  const buyPowerUp = async (item, balance) => {
    
    // set balance
    if (balance-item.price < 0) {
      // NEED TO EXPAND THIS
      Alert.alert("You have insufficient acorns!");
      return;
    } else {
      try {
        if (item.isCostume) {
          // Purchase and equip costume
          await purchaseCostume(item.name, item.price);
          Alert.alert("Costume Equipped!", `You are now wearing the ${item.name} costume!`);
        } else {
          // Update currency on backend for powerups
          const newBalance = await subtractCurrency(item.price);
          setBalance(newBalance);
          
          // Update item counts
          if (item.name === "Streak Freeze") {
            setStreakFreezeCount(prev => prev + 1);
          } else if (item.name === "Double Acorn Buff") {
            setDoubleAcornCount(prev => prev + 1);
          }
        }
        
        // Trigger currency refresh in the indicator
        setCurrencyRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Failed to purchase item:', error);
        Alert.alert("Purchase failed. Please try again.");
      }
    }
    
  }
  
  // Removed streak banner as requested

  // Render shop item
  const renderShopItem = (item) => {
    // For streak freeze item with enhanced design
    if (item.name === 'Streak Freeze') {
      const isMaxed = item.quantity >= item.maxQuantity;
      
      return (
        <View key={item.id} style={styles.streakFreezeCard}>
          <View style={styles.streakFreezeHeader}>
            <View style={styles.streakFreezeIconContainer}>
              <View style={styles.streakFreezeIcon}>
                <Ionicons name="snow" size={40} color="#6BB6FF" />
              </View>
            </View>
            <View style={styles.streakFreezeTextContainer}>
              <Text style={styles.streakFreezeTitle}>{item.name}</Text>
              <Text style={styles.streakFreezeDescription}>{item.description}</Text>
            </View>
          </View>
          
          <View style={styles.streakFreezeFooter}>
            <View style={styles.streakFreezeQuantitySection}>
              <Text style={styles.quantityLabel}>Owned:</Text>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <Text style={styles.quantityMax}>/{item.maxQuantity}</Text>
              </View>
            </View>
            
            {isMaxed ? (
              <View style={styles.maxedOutButton}>
                <Text style={styles.maxedOutText}>MAX</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.buyButton}
                onPress={() => buyPowerUp(item, balance)}
                activeOpacity={0.8}
              >
                <View style={styles.buyButtonContent}>
                  <Text style={styles.buyButtonPrice}>{item.price}</Text>
                  <Text style={styles.buyButtonCurrency}>🌰</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }

    // For double acorn buff with unique golden design
    if (item.isDoubleAcorn) {
      return (
        <View key={item.id} style={styles.doubleAcornCard}>
          {/* Animated sparkle effects background */}
          <View style={styles.sparkleContainer}>
            <Text style={styles.sparkle1}>✨</Text>
            <Text style={styles.sparkle2}>⭐</Text>
            <Text style={styles.sparkle3}>✨</Text>
          </View>
          
          <View style={styles.doubleAcornHeader}>
            <View style={styles.doubleAcornIconContainer}>
              <View style={styles.doubleAcornIcon}>
                <View style={styles.acornPair}>
                  <Text style={styles.acornEmoji}>🌰</Text>
                  <Text style={styles.acornEmoji}>🌰</Text>
                </View>
                <Ionicons name="flash" size={20} color="#FFD700" style={styles.flashIcon} />
              </View>
            </View>
            <View style={styles.doubleAcornTextContainer}>
              <Text style={styles.doubleAcornTitle}>{item.name}</Text>
              <Text style={styles.doubleAcornDescription}>{item.description}</Text>
            </View>
          </View>
          
          <View style={styles.doubleAcornFooter}>
            <View style={styles.doubleAcornQuantitySection}>
              <Text style={styles.buffQuantityLabel}>Active Buffs:</Text>
              <View style={styles.buffQuantityDisplay}>
                <Text style={styles.buffQuantityText}>{item.quantity}</Text>
                <Text style={styles.buffDuration}>x 24h</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.goldenBuyButton}
              onPress={() => buyPowerUp(item, balance)}
              activeOpacity={0.8}
            >
              <View style={styles.goldenBuyButtonContent}>
                <Text style={styles.goldenBuyButtonPrice}>{item.price}</Text>
                <Text style={styles.goldenBuyButtonCurrency}>🌰</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // For costume items with unique designs
    if (item.isCostume) {
      const rarityColors = {
        common: { bg: '#E8F5E8', border: '#4CAF50', text: '#2E7D32' },
        rare: { bg: '#E3F2FD', border: '#2196F3', text: '#1565C0' },
        epic: { bg: '#F3E5F5', border: '#9C27B0', text: '#7B1FA2' },
        legendary: { bg: '#FFF3E0', border: '#FF9800', text: '#F57C00' }
      };
      
      const rarity = rarityColors[item.rarity] || rarityColors.common;
      
      return (
        <View key={item.id} style={[styles.costumeCard, { borderColor: rarity.border }]}>
          {item.isEquipped && (
            <View style={styles.equippedBanner}>
              <Text style={styles.equippedText}>EQUIPPED</Text>
            </View>
          )}
          
          <View style={styles.costumeHeader}>
            <View style={styles.costumeIconContainer}>
              <View style={[styles.costumeImageContainer, { borderColor: rarity.border }]}>
                <Image 
                  source={getCostumeImage(item.name)}
                  style={styles.costumeImage}
                  resizeMode="contain"
                />
                {item.isEquipped && (
                  <View style={styles.equippedIcon}>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  </View>
                )}
              </View>
              <View style={[styles.rarityBadge, { backgroundColor: rarity.border }]}>
                <Text style={styles.rarityText}>{item.rarity.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.costumeTextContainer}>
              <Text style={styles.costumeTitle}>{item.name}</Text>
              <Text style={styles.costumeDescription}>{item.description}</Text>
            </View>
          </View>
          
          <View style={styles.costumeFooter}>
            {item.isEquipped ? (
              <View style={styles.equippedButton}>
                <Text style={styles.equippedButtonText}>EQUIPPED</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.costumeBuyButton, { backgroundColor: rarity.border }]}
                onPress={() => buyPowerUp(item, balance)}
                activeOpacity={0.8}
              >
                <View style={styles.costumeBuyButtonContent}>
                  <Text style={styles.costumeBuyButtonPrice}>{item.price}</Text>
                  <Text style={styles.costumeBuyButtonCurrency}>🌰</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }

    // Fallback for other items
    return null;
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
      {/* Currency indicator like home page */}
      <CurrencyStreakIndicator refreshKey={currencyRefreshKey} />
      
      {/* Shop Header */}
      <View style={styles.shopHeader}>
        <View style={styles.shopHeaderContent}>
          <Text style={styles.shopHeaderTitle}>🛒 Shop</Text>
          <Text style={styles.shopHeaderSubtitle}>Enhance your fitness journey with powerful items</Text>
        </View>
        <View style={styles.shopHeaderDecoration}>
          <Ionicons name="storefront" size={40} color="#D68D54" />
        </View>
      </View>

      {/* Section Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[
            styles.toggleButton, 
            activeSection === 'powerups' && styles.activeToggleButton
          ]}
          onPress={() => setActiveSection('powerups')}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="flash" 
            size={20} 
            color={activeSection === 'powerups' ? '#FFFFFF' : '#D68D54'} 
          />
          <Text style={[
            styles.toggleButtonText,
            activeSection === 'powerups' && styles.activeToggleButtonText
          ]}>
            Powerups
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.toggleButton, 
            activeSection === 'costumes' && styles.activeToggleButton
          ]}
          onPress={() => setActiveSection('costumes')}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="shirt" 
            size={20} 
            color={activeSection === 'costumes' ? '#FFFFFF' : '#D68D54'} 
          />
          <Text style={[
            styles.toggleButtonText,
            activeSection === 'costumes' && styles.activeToggleButtonText
          ]}>
            Costumes
          </Text>
        </TouchableOpacity>
      </View>
      
      {/** Main scroll view  */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {getCurrentSections().map(renderShopSection)}
      </ScrollView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F4',
  },
  shopHeader: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(214, 141, 84, 0.2)',
  },
  shopHeaderContent: {
    flex: 1,
  },
  shopHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 4,
  },
  shopHeaderSubtitle: {
    fontSize: 14,
    color: '#9B8579',
    lineHeight: 18,
  },
  shopHeaderDecoration: {
    backgroundColor: 'rgba(214, 141, 84, 0.1)',
    padding: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(214, 141, 84, 0.3)',
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
  // Streak Freeze specific styles
  streakFreezeCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#6BB6FF',
    elevation: 4,
    shadowColor: '#6BB6FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  streakFreezeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  streakFreezeIconContainer: {
    marginRight: 16,
  },
  streakFreezeIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(107, 182, 255, 0.15)',
    borderWidth: 2,
    borderColor: '#6BB6FF',
  },
  streakFreezeTextContainer: {
    flex: 1,
    paddingTop: 5,
  },
  streakFreezeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 8,
  },
  streakFreezeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  streakFreezeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(107, 182, 255, 0.2)',
  },
  streakFreezeQuantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  quantityDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(107, 182, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#6BB6FF',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6BB6FF',
  },
  quantityMax: {
    fontSize: 14,
    color: '#6BB6FF',
    opacity: 0.7,
  },
  buyButton: {
    backgroundColor: '#D68D54',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#D68D54',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  buyButtonCurrency: {
    fontSize: 16,
  },
  maxedOutButton: {
    backgroundColor: '#E8E8E8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  maxedOutText: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Double Acorn Buff specific styles
  doubleAcornCard: {
    backgroundColor: '#FFF8E1',
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFD700',
    elevation: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    position: 'relative',
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  sparkle1: {
    position: 'absolute',
    top: 15,
    right: 20,
    fontSize: 16,
    opacity: 0.7,
  },
  sparkle2: {
    position: 'absolute',
    top: 40,
    left: 15,
    fontSize: 12,
    opacity: 0.6,
  },
  sparkle3: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    fontSize: 14,
    opacity: 0.5,
  },
  doubleAcornHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  doubleAcornIconContainer: {
    marginRight: 16,
  },
  doubleAcornIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 2,
    borderColor: '#FFD700',
    position: 'relative',
  },
  acornPair: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acornEmoji: {
    fontSize: 18,
    marginHorizontal: 2,
  },
  flashIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 2,
  },
  doubleAcornTextContainer: {
    flex: 1,
    paddingTop: 5,
  },
  doubleAcornTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B8860B',
    marginBottom: 8,
  },
  doubleAcornDescription: {
    fontSize: 14,
    color: '#8B7355',
    lineHeight: 20,
  },
  doubleAcornFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.3)',
  },
  doubleAcornQuantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buffQuantityLabel: {
    fontSize: 14,
    color: '#8B7355',
    marginRight: 8,
  },
  buffQuantityDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  buffQuantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B8860B',
    marginRight: 4,
  },
  buffDuration: {
    fontSize: 12,
    color: '#B8860B',
    opacity: 0.8,
  },
  goldenBuyButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  goldenBuyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldenBuyButtonPrice: {
    color: '#8B4513',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  goldenBuyButtonCurrency: {
    fontSize: 16,
  },
  // Toggle button styles
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  activeToggleButton: {
    backgroundColor: '#D68D54',
    elevation: 1,
    shadowColor: '#D68D54',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D68D54',
    marginLeft: 8,
  },
  activeToggleButtonText: {
    color: '#FFFFFF',
  },
  // Costume card styles
  costumeCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  costumeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  costumeIconContainer: {
    marginRight: 16,
    position: 'relative',
  },
  costumeImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  costumeImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  rarityBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    elevation: 2,
  },
  rarityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  costumeTextContainer: {
    flex: 1,
    paddingTop: 5,
  },
  costumeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A2A1F',
    marginBottom: 6,
  },
  costumeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  costumeFooter: {
    alignItems: 'flex-end',
  },
  costumeBuyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  costumeBuyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  costumeBuyButtonPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  costumeBuyButtonCurrency: {
    fontSize: 16,
  },
  // Equipped costume styles
  equippedBanner: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
    elevation: 3,
  },
  equippedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  equippedIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
  },
  equippedButton: {
    backgroundColor: '#E8F5E8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  equippedButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});