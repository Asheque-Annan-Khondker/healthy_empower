import React from 'react';
import {
  View, Text, StyleSheet, ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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
      <ImageBackground
        source={image}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.row}>
          <MaterialIcons name="location-on" size={14} color="#666" />
          <Text style={styles.address}>{subtext}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.distance}>{leftBottomText}</Text>
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Read More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 180,
    height: 220,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    height: 100,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignSelf: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 3,
    margin: 8,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#444',
  },
  content: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  address: {
    fontSize: 11,
    color: '#555',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  distance: {
    fontSize: 12,
    color: '#777',
  },
  button: {
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 11,
    color: '#2e5fff',
    fontWeight: '500',
  },
});

export default PlaceCard;
