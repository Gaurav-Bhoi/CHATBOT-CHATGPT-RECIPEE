import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

export type TabInterface = {
  Home: undefined;
  Chatbot: undefined;
};

export interface HomeScreenProps {
  navigation: BottomTabNavigationProp<TabInterface, 'Home'>;
}

export interface ChatbotScreenProps {
  navigation: BottomTabNavigationProp<TabInterface, 'Chatbot'>;
}

export enum huggingface_consts {
  max_new_tokens = 100,
  temperature = 1,
}

export interface chatInterface {
  sender: string;
  message: string;
  recipee: RecipeeObject[];
}

export interface askBotInterface {
  (...args: [string]): Promise<chatInterface>;
}

export interface toastInterface {
  (message: string): void;
}

export enum senderType {
  bot = 'bot',
  human = 'human',
}

export enum storageKeys {
  savedRecipeesKey = '@savedrecipees',
}

export interface ChatComponentInterface {
  item: chatInterface;
}

export interface getRecipeeInterface {
  (...args: [string]): Promise<chatInterface>;
}

export interface RecipeeObject {
  id: number;
  image: string;
  imageType: string;
  title: string;
}

export interface RecipeeCardInterface {
  item: RecipeeObject;
  isSaveable: boolean;
}

export interface saveRecipeeInterFace {
  (...args: [string, RecipeeObject]): Promise<boolean>;
}

export interface getRecipeesInterFace {
  (...args: [string]): Promise<RecipeeObject[]>;
}

export interface keywordExtractorInterface {
  (...args: [string]): Promise<string>;
}
