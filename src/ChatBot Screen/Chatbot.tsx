/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ChatbotScreenProps,
  chatInterface,
  RecipeeObject,
  senderType,
} from '../Interface/interface';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {askBot, sendAudioToGoogle} from '../Service/openAI_Service';
import ChatComponent from '../Components/ChatComponent';
import WebView from 'react-native-webview';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const Chatbot = ({}: ChatbotScreenProps) => {
  const [text, setText] = useState<string>('');
  const [chat, setChat] = useState<chatInterface[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const flatListRef = useRef<FlatList<chatInterface>>(null);
  const [selected, setSelected] = useState<RecipeeObject | undefined>(
    undefined,
  );
  const audioRecorderPlayer = new AudioRecorderPlayer();
  const [modalVisible, setModalVisible] = useState(false);
  const audioPath = `${RNFS.DocumentDirectoryPath}/voice.wav`;

  const ensureDirectoryExists = async () => {
    const dirPath = RNFS.DocumentDirectoryPath;
    const exists = await RNFS.exists(dirPath);
    if (!exists) {
      await RNFS.mkdir(dirPath);
    }
  };

  const callBotService = useCallback(async (input: string) => {
    setChat(prevChat => {
      const newData = prevChat.filter(ele => ele.message !== 'typing...');
      newData.push({message: 'typing...', recipee: [], sender: senderType.bot});
      return newData;
    });
    const res: chatInterface = await askBot(input);

    setChat(prevChat => {
      const newData = prevChat.filter(ele => ele.message !== 'typing...');
      newData.push(res);
      return newData;
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({animated: true});
  }, []);

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chat, scrollToBottom]);

  useEffect(() => {
    callBotService('Hello Chef, I can help you search recipee for any food');
  }, [callBotService]);

  const onSendText = useCallback(
    async (input: string) => {
      if (input === '') {
        return;
      }
      setChat(prevChat => [
        ...prevChat,
        {sender: senderType.human, message: input, recipee: []},
      ]);
      setText('');
      Keyboard.dismiss();
      await callBotService(input);
    },
    [callBotService],
  );

  const startRecording = async () => {
    await ensureDirectoryExists();
    setIsListening(true);
    setText('');
    await audioRecorderPlayer.startRecorder(audioPath);
  };

  const stopRecording = async () => {
    setIsListening(false);
    await audioRecorderPlayer.stopRecorder();
    const message = await sendAudioToGoogle(audioPath);
    console.log('this is message', message);
    if (message) {
      onSendText(message);
    }
    console.log(message);
  };

  const renderItem = (item: chatInterface) => {
    return (
      <ChatComponent
        item={item}
        selectCallback={selected => {
          setModalVisible(true);
          setSelected(selected);
        }}
      />
    );
  };

  const listEmptyComponent = () => {
    return <Text>no data found</Text>;
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'App needs access to your microphone for speech recognition',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const renderModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={{
                marginTop: 5,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                paddingRight: 20,
              }}
              onPress={() => setModalVisible(!modalVisible)}>
              <MaterialIcons name="cancel" size={30} color="red" />
            </TouchableOpacity>
            {selected?.spoonacularSourceUrl && (
              <WebView
                source={{uri: selected?.spoonacularSourceUrl}}
                style={styles.webview}
                scrollEnabled={true}
              />
            )}
          </View>
        </View>
      </Modal>
    );
  };
  const renderContent = () => {
    return (
      <View style={{flex: 1}}>
        <FlatList
          ref={flatListRef}
          data={chat}
          renderItem={({item}) => renderItem(item)}
          style={styles.flatlist}
          ListEmptyComponent={listEmptyComponent}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
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
              onPress={() => onSendText(text)}
              disabled={text === ''}>
              <Feather name="send" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              {backgroundColor: isListening ? 'red' : '#4caf50'},
            ]}
            onPressIn={startRecording}
            onPressOut={stopRecording}>
            <Icon name="microphone" size={20} color="black" />
          </TouchableOpacity>
        </View>
        {renderModal()}
      </View>
    );
  };

  if (Platform.OS === 'ios') {
    return (
      <KeyboardAvoidingView
        style={{flex: 1}}
        keyboardVerticalOffset={100}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {renderContent()}
      </KeyboardAvoidingView>
    );
  } else {
    return renderContent();
  }
};

export default Chatbot;
const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  webviewContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  webview: {
    flex: 1,
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: height * 0.8,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  textBoxContainer: {
    flex: 1,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    height: 40,
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
    color: 'black',
    fontSize: 12,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  flatlist: {
    // height: '85%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
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
