import {
  getRecipeesInterFace,
  getSelectedRecipeesInterFace,
  saveRecipeeInterFace,
} from '../Interface/interface';
import {_getData, _storeData} from '../Utility/asyncStorage';

export const saveRecipee: saveRecipeeInterFace = async (...args) => {
  const [storageKey, selectedRecipee] = args;
  const response = await _storeData(storageKey, selectedRecipee);
  return response;
};

export const getRecipees: getRecipeesInterFace = async (...args) => {
  const [storageKey] = args;
  const response = await _getData(storageKey);

  return response;
};

export const saveSelectedRecipee: saveRecipeeInterFace = async (...args) => {
  const [storageKey, selectedRecipee] = args;
  const response = await _storeData(storageKey, selectedRecipee);
  return response;
};

export const getSelectedRecipees: getSelectedRecipeesInterFace = async (
  ...args
) => {
  const [storageKey] = args;
  const response = await _getData(storageKey);

  return response;
};
