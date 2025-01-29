import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ChatbotScreenProps,
  chatInterface,
  senderType,
} from '../Interface/interface';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {askBot} from '../Service/openAI_Service';
import ChatComponent from '../Components/ChatComponent';

const Chatbot = ({}: ChatbotScreenProps) => {
  const [text, setText] = useState<string>('');
  const [chat, setChat] = useState<chatInterface[]>([]);

  const callBotService = useCallback(async (input: string) => {
    const res: chatInterface = await askBot(input);
    setChat(prevChat => [...prevChat, res]);
  }, []);

  useEffect(() => {
    callBotService('Hello Chef, I can help you search recipee for any food');
  }, [callBotService]);

  const renderItem = (item: chatInterface) => {
    return <ChatComponent item={item} />;
  };

  const listEmptyComponent = () => {
    return <Text>no data found</Text>;
  };

  const onSendText = async () => {
    setChat(prevChat => [
      ...prevChat,
      {sender: senderType.human, message: text, recipee: []},
    ]);
    await callBotService(text);
    setText('');
  };

  return (
    <View>
      <FlatList
        data={chat}
        renderItem={({item}) => renderItem(item)}
        style={styles.flatlist}
        ListEmptyComponent={listEmptyComponent}
        // contentContainerStyle={styles.flatlist2}
      />
      <View style={styles.inputContainer}>
        <View style={styles.textBoxContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask for a recipe..."
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={onSendText}
            disabled={text === ''}>
            <Feather name="send" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={() => {}}>
          <Icon name="microphone" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  textBoxContainer: {
    flex: 1,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    height: 30,
    marginHorizontal: 5,
    borderRadius: 5,
    flexDirection: 'row',
  },
  buttonContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,

    fontSize: 12,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  flatlist: {
    height: '85%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flatlist2: {justifyContent: 'center', alignItems: 'center', flex: 1},
  sendButton: {
    backgroundColor: '#4caf50',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
