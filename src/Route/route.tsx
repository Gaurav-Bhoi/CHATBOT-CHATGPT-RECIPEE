import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TabInterface} from '../Interface/interface';
import Home from '../Home Screen/Home';
import Chatbot from '../ChatBot Screen/Chatbot';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator<TabInterface>();

export const Tabs = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: () => <AntDesign name="home" color="black" size={25} />,
      }}
    />
    <Tab.Screen
      name="Chatbot"
      component={Chatbot}
      options={{
        tabBarLabel: 'Chatbot',
        tabBarIcon: () => (
          <MaterialCommunityIcons name={'robot'} size={25} color="black" />
        ),
      }}
    />
  </Tab.Navigator>
);
