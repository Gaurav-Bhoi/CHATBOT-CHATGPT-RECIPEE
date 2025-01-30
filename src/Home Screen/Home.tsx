import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  HomeScreenProps,
  RecipeeObject,
  storageKeys,
} from '../Interface/interface';
import {getRecipees} from '../ChatBot Screen/ChatbotModel';
import RecipeeCard from '../Components/RecipeeCard';
import {useFocusEffect} from '@react-navigation/native';

const Home = ({}: HomeScreenProps) => {
  const [recipees, setRecipees] = useState<RecipeeObject[]>([]);

  const getAllRecipees = useCallback(async () => {
    const allRecipees = await getRecipees(storageKeys.savedRecipeesKey);
    setRecipees(allRecipees);
  }, []);

  useFocusEffect(() => {
    getAllRecipees();
  });

  const renderItem = (item: RecipeeObject) => {
    return <RecipeeCard item={item} isSaveable={false} />;
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
        keyExtractor={item => String(item.id)}
        style={styles.flatlistStyle2}
        contentContainerStyle={[
          styles.flatlistStyle1,
          {flex: recipees.length > 0 ? 0 : 1},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlistStyle1: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlistStyle2: {width: '95%', marginVertical: 5},
});
export default Home;
