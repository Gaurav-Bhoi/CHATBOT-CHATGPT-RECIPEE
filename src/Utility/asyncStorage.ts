import AsyncStorage from '@react-native-async-storage/async-storage';
import {RecipeeObject} from '../Interface/interface';

/**
 * @description This function accepts async storag key and json object. if object is already present in array then it stores array as it is else if pushes object inside array and then stores it.
 * @param  {{key: string, data: <RecipeeObject>}} - async storage key, JSON object
 * @returns {{storageStatus: boolean}} - is storage is successful sends true else false
 */
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

/**
 * @description This function accepts async storag key and json object. if object is already present in array then it stores array as it is else if pushes object inside array and then stores it.
 * @param  {{key: string}} - async storage key
 * @returns {{JSONRecipees: <RecipeeObject[] | []>}} - if gives array of recipee objects if its available in storage else returns empty array
 */
export const _getData = async (key: string) => {
  try {
    const recipees = await AsyncStorage.getItem(key);
    const JSONRecipees = recipees ? JSON.parse(recipees) : [];
    return JSONRecipees;
  } catch {
    return [];
  }
};

/**
 * @description This function accepts async storag key and json object and stores it.
 * @param  {{key: string, data: <RecipeeObject>}} - async storage key, selected recipee object
 * @returns {{status: boolean}} - status for storing data
 */
export const _setSelectedRecipee = async (key: string, data: RecipeeObject) => {
  try {
    const JSONStringify = JSON.stringify(data);
    await AsyncStorage.setItem(key, JSONStringify);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * @description This function returns selected recipee
 * @param  {{key: string}} - async storage key, selected recipee object
 * @returns  {{JSONRecipees: <RecipeeObject | undefined>}} - selected recipee
 */
export const _getSelectedRecipee = async (key: string) => {
  try {
    const selectedRecipee = await AsyncStorage.getItem(key);
    const JSONRecipees = selectedRecipee ? JSON.parse(selectedRecipee) : {};
    return JSONRecipees;
  } catch {
    return {};
  }
};
