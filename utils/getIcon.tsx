import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
// Type definitions for icon families
export type FAIconName = keyof typeof FontAwesome.glyphMap;
export type MaterialIconName = keyof typeof MaterialIcons.glyphMap;
export type IonIconName = keyof typeof Ionicons.glyphMap;

export const FAIcon = ({ name, color, size = 28 }: { name: FAIconName, color: string, size?: number }) => (
  <FontAwesome size={size} name={name} color={color} />
);

export const MatIcon = ({ name, color, size = 28 }: { name: MaterialIconName, color: string, size?: number }) => (
  <MaterialIcons size={size} name={name} color={color} />
);

export const IonIcon = ({ name, color, size = 28 }: { name: IonIconName, color: string, size?: number }) => (
  <Ionicons size={size} name={name} color={color} />
);