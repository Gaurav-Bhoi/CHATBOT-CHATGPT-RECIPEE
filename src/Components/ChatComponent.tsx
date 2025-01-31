/* eslint-disable react-native/no-inline-styles */

import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  ChatComponentInterface,
  RecipeeObject,
  senderType,
} from '../Interface/interface';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RecipeeCard from './RecipeeCard';

const ChatComponent: React.FC<ChatComponentInterface> = ({
  item,
  selectCallback,
}) => {
  const {sender, message, recipee} = item;

  const [recipees, setRecipees] = useState<RecipeeObject[] | []>(recipee);

  useEffect(() => {
    setRecipees(recipee);
  }, [recipee]);

  const [selectedRecipee, setSelectedRecipee] = useState<
    RecipeeObject | undefined
  >(undefined);

  const onSelectItem = (selected: RecipeeObject) => {
    setSelectedRecipee(selected);
    selectCallback(selected);
    setRecipees([]);
  };

  const renderItem = (item: RecipeeObject) => {
    return (
      <RecipeeCard
        item={item}
        isSaveable={true}
        onSelect={() => onSelectItem(item)}
      />
    );
  };

  const showRecippes = () => {
    if (recipees.length < 1) {
      return;
    }

    return (
      <FlatList
        data={recipees}
        renderItem={({item}) => renderItem(item)}
        contentContainerStyle={styles.flatlistContainer}
        style={{marginTop: 20}}
      />
    );
  };

  const showSelectedRecipee = () => {
    if (selectedRecipee) {
      return renderItem(selectedRecipee);
    }
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
        <Text style={{color: 'black'}}>{message}</Text>
        {showSelectedRecipee()}
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
  flatlistContainer: {width: '100%', maxHeight: 300},
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
    justifyContent: 'center',
  },
});
