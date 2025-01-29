/* eslint-disable react-native/no-inline-styles */

import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  ChatComponentInterface,
  RecipeeObject,
  senderType,
} from '../Interface/interface';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RecipeeCard from './RecipeeCard';

const ChatComponent: React.FC<ChatComponentInterface> = ({item}) => {
  const {sender, message, recipee} = item;

  const showRecippes = () => {
    if (recipee.length < 1) {
      return;
    }

    const renderItem = (item: RecipeeObject) => {
      return <RecipeeCard item={item} isSaveable={true} />;
    };

    return (
      <FlatList
        data={recipee}
        renderItem={({item}) => renderItem(item)}
        contentContainerStyle={styles.flatlistContainer}
      />
    );
  };

  return (
    <View
      style={[
        styles.mainContainer,
        {flexDirection: sender === senderType.bot ? 'row' : 'row-reverse'},
      ]}>
      <View
        style={[
          styles.userIconContainer,
          {
            marginRight: sender === senderType.bot ? 5 : 0,
            marginLeft: sender === senderType.human ? 5 : 0,
            backgroundColor:
              sender === senderType.human ? '#85E084' : '#A8D1DF',
          },
        ]}>
        <MaterialCommunityIcons
          name={sender === senderType.human ? 'chef-hat' : 'robot'}
          size={25}
          color="black"
        />
      </View>

      <View style={styles.chatContainer}>
        <Text>{message}</Text>
        {showRecippes()}
      </View>
    </View>
  );
};

export default ChatComponent;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'flex-start',
    marginVertical: 10,
    marginHorizontal: 5,
  },
  flatlistContainer: {width: '100%', maxHeight: 300, backgroundColor: 'red'},
  userIconContainer: {
    height: 40,
    width: 40,

    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
    minHeight: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
});
