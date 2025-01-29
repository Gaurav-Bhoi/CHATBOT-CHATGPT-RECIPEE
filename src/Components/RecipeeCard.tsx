import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {RecipeeCardInterface, storageKeys} from '../Interface/interface';
import {saveRecipee} from '../ChatBot Screen/ChatbotModel';
import {toast} from '../Utility/toast';

const RecipeeCard: React.FC<RecipeeCardInterface> = ({item, isSaveable}) => {
  const {image, title} = item;

  const onSelectRecipee = async () => {
    const resp = await saveRecipee(storageKeys.savedRecipeesKey, item);
    if (resp) {
      toast('I have saved this recipee');
    }
  };

  return (
    <TouchableOpacity
      style={styles.recipeeContainer}
      onPress={onSelectRecipee}
      disabled={!isSaveable}>
      <Image
        source={{uri: image}}
        style={{height: 80, width: 100, marginRight: 5}}
        resizeMode="contain"
      />
      <View style={{flex: 1}}>
        <Text style={{fontSize: 12, color: 'black'}}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RecipeeCard;

const styles = StyleSheet.create({
  recipeeContainer: {
    borderWidth: 1,
    marginBottom: 2,
    borderRadius: 5,
    padding: 2,
    borderColor: '#d3d3d3',
    flexDirection: 'row',
    width: '100%',
  },
});
