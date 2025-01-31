import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  HomeScreenProps,
  RecipeeObject,
  storageKeys,
} from '../Interface/interface';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {getRecipees} from '../ChatBot Screen/ChatbotModel';
import RecipeeCard from '../Components/RecipeeCard';
import {useFocusEffect} from '@react-navigation/native';
import WebView from 'react-native-webview';

const Home = ({}: HomeScreenProps) => {
  const [recipees, setRecipees] = useState<RecipeeObject[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<RecipeeObject | undefined>(
    undefined,
  );

  /**
   * @description This function returns all saved recipees in async storage
   * @returns {{JSONRecipees: <RecipeeObject[] | []>}} - if gives array of recipee objects if its available in storage else returns empty array
   */
  const getAllRecipees = useCallback(async () => {
    const allRecipees = await getRecipees(storageKeys.savedRecipeesKey);
    setRecipees(allRecipees);
  }, []);

  useFocusEffect(() => {
    getAllRecipees();
  });
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const renderItem = (item: RecipeeObject) => {
    return (
      <RecipeeCard
        item={item}
        isSaveable={false}
        onSelect={item => {
          setModalVisible(true);
          setSelected(item);
        }}
      />
    );
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

  const listHeaderComponent = () => {
    <Text style={{fontSize: 14, color: 'black', fontWeight: '500'}}>
      Saved Recipees
    </Text>;
  };

  const listEmptyComponent = () => {
    return <Text>No Saved Recipees</Text>;
  };
  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={recipees}
        renderItem={({item}) => renderItem(item)}
        ListEmptyComponent={listEmptyComponent}
        ListHeaderComponent={listHeaderComponent}
        keyExtractor={item => String(item.id)}
        style={styles.flatlistStyle2}
        contentContainerStyle={[
          styles.flatlistStyle1,
          {flex: recipees.length > 0 ? 0 : 1},
        ]}
      />
      {renderModal()}
    </View>
  );
};
const {height} = Dimensions.get('window');
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  flatlistStyle1: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlistStyle2: {width: '95%', marginVertical: 5},
});
export default Home;
