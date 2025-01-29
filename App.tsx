import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Tabs} from './src/Route/route';

const createStaticNavigation = (Navigator: React.ComponentType) => () =>
  (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );

const Navigation = createStaticNavigation(Tabs);

const App = () => {
  return <Navigation />;
};

export default App;
