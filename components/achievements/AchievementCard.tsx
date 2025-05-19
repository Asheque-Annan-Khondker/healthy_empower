import { Card, List } from "react-native-paper";
import { Achievement } from "./achievement.types";
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { IonIcon } from "@/utils/getIcon";

interface AchievementProps {
    achievement: Achievement;
    onPress?: () => void;
    highlighted?: boolean;
}

const AchievementCard = (props: AchievementProps) => {
    const { achievement, onPress, highlighted = false } = props;
    
    // Get category-specific icon name
    const getCategoryIcon = (category: string) => {
        switch (category?.toLowerCase()) {
            case 'nutrition':
                return 'restaurant';
            case 'fitness':
                return 'barbell';
            case 'consistency':
                return 'calendar';
            case 'milestone':
                return 'trophy';
            default:
                return 'star';
        }
    };
    
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Card style={[styles.card, highlighted && styles.highlightedCard]}>
                <Card.Content style={styles.content}>
                    <View style={styles.iconContainer}>
                        <View style={[
                            styles.iconBackground, 
                            achievement.completed ? styles.completedIcon : styles.incompleteIcon
                        ]}>
                            <IonIcon 
                                name={getCategoryIcon(achievement.category)} 
                                size={24} 
                                color={achievement.completed ? "#FFFFFF" : "#9B8579"} 
                            />
                        </View>
                    </View>
                    
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{achievement.title}</Text>
                        {achievement.description && (
                            <Text style={styles.description} numberOfLines={2}>
                                {achievement.description}
                            </Text>
                        )}
                        
                        {achievement.completed ? (
                            <Text style={styles.completedText}>✓ Completed</Text>
                        ) : (
                            <Text style={styles.progressText}>
                                {achievement.progress} / {achievement.target_progress}
                            </Text>
                        )}
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        borderRadius: 10,
        overflow: 'hidden',
    },
    highlightedCard: {
        borderWidth: 2,
        borderColor: '#D68D54',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 16,
    },
    iconBackground: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedIcon: {
        backgroundColor: '#D68D54',
    },
    incompleteIcon: {
        backgroundColor: '#E0E0E0',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3A2A1F',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#9B8579',
        marginBottom: 4,
    },
    completedText: {
        fontSize: 14,
        color: '#27AE60',
        fontWeight: '500',
    },
    progressText: {
        fontSize: 14,
        color: '#9B8579',
    },
});

export default AchievementCard;