import { Dimensions, ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const screenHeight: number = Dimensions.get("screen").height;
const screenWidth: number = Dimensions.get("screen").width;

type GuideCardProps = {
  img: ImageSourcePropType;
  title: string;
  description: string;
  link: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  duration?: string;
};

function GuideCard(
  img: ImageSourcePropType,
  title: string,
  description: string,
  link: string,
  difficulty: "beginner" | "intermediate" | "advanced" = "beginner",
  duration: string = "30 min"
) {
  const onPress = () => {
    return router.navigate(link);
  };

  // Define difficulty badge color
  const difficultyColors = {
    beginner: { bg: "#4CAF50", text: "#FFFFFF" },
    intermediate: { bg: "#FF9800", text: "#FFFFFF" },
    advanced: { bg: "#F44336", text: "#FFFFFF" }
  };

  const badgeColor = difficultyColors[difficulty] || difficultyColors.beginner;

  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.cardWrapper,
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
      ]}
    >
      <View style={styles.card}>
        {/* Card image with overlay gradient */}
        <View style={styles.imageContainer}>
          <Image 
            source={img} 
            style={styles.img}
            contentFit="cover"
            transition={200}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          
          {/* Difficulty badge */}
          <View style={[styles.difficultyBadge, { backgroundColor: badgeColor.bg }]}>
            <Text style={[styles.difficultyText, { color: badgeColor.text }]}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          </View>
        </View>
        
        {/* Card content */}
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          
          <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
            {description}
          </Text>
          
          {/* Footer with duration and action */}
          <View style={styles.cardFooter}>
            <View style={styles.durationContainer}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.durationText}>{duration}</Text>
            </View>
            
            <View style={styles.readButton}>
              <Text style={styles.readButtonText}>Details</Text>
              <Ionicons name="chevron-forward" size={14} color="#D68D54" />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

type CardListProps = {
  cards: GuideCardProps[];
};

// Implement scrollable list of cards
const GuideCardList: React.FC<CardListProps> = ({ cards }) => {
  const offset = useSharedValue(16);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      offset.value = event.contentOffset.x;
    },
  });

  return (
    <Animated.FlatList
      renderItem={({ item }) => {
        return GuideCard(
          item.img, 
          item.title, 
          item.description, 
          item.link,
          item.difficulty,
          item.duration
        );
      }}
      scrollEnabled={true}
      style={styles.cardContainer}
      contentContainerStyle={styles.listContent}
      data={cards}
      pagingEnabled={false}
      scrollEventThrottle={16}
      onScroll={scrollHandler}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      snapToInterval={screenWidth * 0.7 + 20}
      decelerationRate="fast"
    />
  );
};

export default GuideCardList;
export { GuideCard };

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  cardWrapper: {
    width: screenWidth * 0.7,
    marginRight: 20,
    height: screenHeight * 0.28,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
  },
  imageContainer: {
    height: "50%",
    position: "relative",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    zIndex: 1,
  },
  difficultyBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 2,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3A2A1F",
    marginBottom: 6,
  },
  text: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  readButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(214, 141, 84, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  readButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#D68D54",
    marginRight: 2,
  },
});