import AsyncStorage from '@react-native-async-storage/async-storage';
import {RecipeeObject} from '../Interface/interface';

export const _storeData = async (key: string, data: RecipeeObject) => {
  try {
    let recipees = await _getData(key);

    if (!recipees.some((item: RecipeeObject) => item.id === data.id)) {
      recipees.push(data);
    }
    const JSONStringify = JSON.stringify(recipees);
    await AsyncStorage.setItem(key, JSONStringify);
    return true;
  } catch (e) {
    return false;
  }
};

export const _getData = async (key: string) => {
  try {
    const recipees = await AsyncStorage.getItem(key);
    const JSONRecipees = recipees ? JSON.parse(recipees) : [];
    return JSONRecipees;
  } catch {
    return [];
  }
};

export const _setSelectedRecipee = async (key: string, data: RecipeeObject) => {
  try {
    const JSONStringify = JSON.stringify(data);
    await AsyncStorage.setItem(key, JSONStringify);
    return true;
  } catch (e) {
    return false;
  }
};

export const _getSelectedRecipee = async (key: string) => {
  try {
    const selectedRecipee = await AsyncStorage.getItem(key);
    const JSONRecipees = selectedRecipee ? JSON.parse(selectedRecipee) : {};
    return JSONRecipees;
  } catch {
    return [];
  }
};
