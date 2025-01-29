import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TabInterface} from '../Interface/interface';
import Home from '../Home Screen/Home';
import Chatbot from '../ChatBot Screen/Chatbot';

const Tab = createBottomTabNavigator<TabInterface>();

export const Tabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Chatbot" component={Chatbot} />
  </Tab.Navigator>
);
