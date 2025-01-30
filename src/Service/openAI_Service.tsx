import axios from 'axios';
import {
  askBotInterface,
  keywordExtractorInterface,
  senderType,
} from '../Interface/interface';
import {
  HUGGINGFACE_API_KEY,
  HUGGINGFACE_CHATBOT_MODEL,
  HUGGINGFACE_KEYWORD_MODEL,
} from '../Constants/consts';
import {toast} from '../Utility/toast';
import {getRecipee} from './spoonacular_Service';

const headers = new axios.AxiosHeaders({
  Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
  'Content-Type': 'application/json',
});

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
