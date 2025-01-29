import axios from 'axios';
import {getRecipeeInterface, senderType} from '../Interface/interface';
import {SPOONACULAR_API_KEY, SPOONACULAR_URL} from '../Constants/consts';

export const getRecipee: getRecipeeInterface = async (...args) => {
  try {
    const [input] = args;

    const resp = await axios.get(
      `${SPOONACULAR_URL}?query=${input}&apiKey=${SPOONACULAR_API_KEY}&number=5&addRecipeInformation=true`,
    );

    const recipees = resp?.data?.results;
    if (!!recipees && recipees.length > 0) {
      return {
        sender: senderType.bot,
        message: 'are you looking for these ?',
        recipee: recipees,
      };
    } else {
      return {
        sender: senderType.bot,
        message: 'I am trying to look but not getting anything !',
        recipee: [],
      };
    }
  } catch {
    return {
      sender: senderType.bot,
      message: "something went wrong and i couldn't get your recipee !",
      recipee: [],
    };
  }
};
