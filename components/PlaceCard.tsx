import React from 'react';
import {
  View, Text, StyleSheet, ImageBackground,
  TouchableOpacity, Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


const { width: screenWidth } = Dimensions.get('window');


const COLORS = {
  primary: '#E67D34',      
  primaryLight: '#FFE8D6', 
  text: '#3A2A1F',         
  textSecondary: '#6B5C53', 
  textLight: '#9B8579',    
  background: '#FAF7F4',   
  white: '#FFFFFF',        
  shadow: 'rgba(214, 134, 48, 0.15)' // Shadow with orange tint
};

interface PlaceCardProps {
  title: string;
  subtext: string;
  leftBottomText: string;
  tag: string;
  image: any;
  onPress?: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  title,
  subtext,
  leftBottomText,
  tag,
  image,
  onPress
}) => {
  return (
    <View style={styles.card}>
      {/* Left side - Image */}
      <View style={styles.imageContainer}>
        <ImageBackground
          source={image}
          style={styles.image}
          imageStyle={styles.imageStyle}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)']}
            style={styles.imageOverlay}
          />
          <View style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Right side - Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        
        <View style={styles.row}>
          <MaterialIcons name="location-on" size={16} color={COLORS.textSecondary} />
          <Text style={styles.address} numberOfLines={2} ellipsizeMode="tail">
            {subtext}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.durationContainer}>
            <MaterialIcons name="access-time" size={14} color={COLORS.textLight} />
            <Text style={styles.distance}>{leftBottomText}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={onPress}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Read More</Text>
            <MaterialIcons 
              name="chevron-right" 
              size={12} 
              color={COLORS.white} 
              style={styles.buttonIcon} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Subtle shadow effect */}
      <View style={styles.cardShadow} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: screenWidth - 32,
    height: 155, // Increased from 140 to 155
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  imageContainer: {
    width: 120,
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 8,
  },
  imageStyle: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    borderBottomLeftRadius: 16,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  address: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 6,
    lineHeight: 20,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 9,
    paddingVertical: 4, 
    borderRadius: 4, 
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 10, 
    color: COLORS.white,
    fontWeight: '500', 
  },
  buttonIcon: {
    marginLeft: 2, 
  },
  cardShadow: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    height: 6,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    zIndex: -1,
  },
});

export default PlaceCard;