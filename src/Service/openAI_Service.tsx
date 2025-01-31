import axios from 'axios';
import {
  askBotInterface,
  keywordExtractorInterface,
  senderType,
} from '../Interface/interface';
import {
  GOOGLE_API_KEY,
  HUGGINGFACE_API_KEY,
  HUGGINGFACE_CHATBOT_MODEL,
  HUGGINGFACE_KEYWORD_MODEL,
} from '../Constants/consts';
import {toast} from '../Utility/toast';
import {getRecipee} from './spoonacular_Service';
import RNFS from 'react-native-fs';

const headers = new axios.AxiosHeaders({
  Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
  'Content-Type': 'application/json',
});

/**
 * @description This function is core for chatbot like functionality. when user sends text first we checkout for keywords related to food if we didnt any keyword hugging api returns normal chatbot response if we find any keyword we call for spoonacular api to get food recipees
 * @param  {{(...args: [string])}} - input
 * @returns {{Promise<chatInterface>}} - sender: string, message: string, recipee: RecipeeObject[];
 */
export const askBot: askBotInterface = async (...args) => {
  const [input] = args;

  try {
    const keywords = await extractKeywords(input);

    if (keywords) {
      const recipeeResult = await getRecipee(keywords);

      return recipeeResult;
    }

    const resp = await axios.post(
      HUGGINGFACE_CHATBOT_MODEL,
      {
        inputs: input,
      },
      {
        headers: headers,
      },
    );

    return {
      sender: senderType.bot,
      message: resp.data[0]?.generated_text,
      recipee: [],
    };
  } catch {
    toast('Looks like chatbot is offline at the time');
    return {
      sender: senderType.bot,
      message: 'Looks like chatbot is offline at the time',
      recipee: [],
    };
  }
};

/**
 * @description This function extracts keyword from input using facehugging chatbot model and returns keyword
 * @param  {{(...args: [string])}} - input
 * @returns {{Promise<string>}} - sender: string, message: string, recipee: RecipeeObject[];
 */
const extractKeywords: keywordExtractorInterface = async (...args) => {
  const [input] = args;

  try {
    const response = await axios.post(
      HUGGINGFACE_KEYWORD_MODEL,
      {inputs: input},
      {
        headers: {Authorization: `Bearer ${HUGGINGFACE_API_KEY}`},
      },
    );

    const keywords = response.data.map((item: {word: string}) => item.word);
    return keywords.slice(0, 3).join(' ');
  } catch {
    return input;
  }
};

/**
 * @description This function accepts path for recorded audio sends to Google Speech to text api and returns transpiled text
 * @param  {{filePath: string}} - path to audio file
 * @returns {{transcript: string}} - transpiled text
 */
export const sendAudioToGoogle = async (filePath: string) => {
  try {
    const audioData = await RNFS.readFile(filePath, 'base64');

    const response = await axios.post(
      `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
      {
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: 'en-US',
        },
        audio: {content: audioData},
      },
    );

    const transcript =
      response.data.results?.[0]?.alternatives?.[0]?.transcript;
    if (transcript) {
      return transcript;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
