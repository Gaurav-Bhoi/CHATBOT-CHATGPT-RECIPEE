import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {RecipeeCardInterface, storageKeys} from '../Interface/interface';
import {saveRecipee} from '../ChatBot Screen/ChatbotModel';
import {toast} from '../Utility/toast';

const RecipeeCard: React.FC<RecipeeCardInterface> = ({
  item,
  isSaveable,
  onSelect,
}) => {
  const {image, title, servings, pricePerServing, license} = item;

  const onSelectRecipee = async () => {
    onSelect(item);
    if (isSaveable) {
      const resp = await saveRecipee(storageKeys.savedRecipeesKey, item);
      if (resp) {
        toast('I have saved this recipee');
      }
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.recipeeContainer}
        onPress={onSelectRecipee}>
        <Image
          source={{uri: image}}
          style={{height: 80, width: 100, marginRight: 5}}
          resizeMode="contain"
        />
        <View style={{flex: 1}}>
          <Text
            style={{fontSize: 14, color: 'black', fontWeight: '500'}}
            numberOfLines={2}>
            {title}
          </Text>
          <Text style={{fontSize: 12, color: '#808080', marginTop: 5}}>
            servings: {servings}
          </Text>
          <Text style={{fontSize: 12, color: '#808080'}}>
            pricePerServing: {pricePerServing}
          </Text>
          <Text style={{fontSize: 12, color: '#808080'}}>
            license: {license}
          </Text>
        </View>
      </TouchableOpacity>
    </>
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
