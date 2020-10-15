import { forModalPresentationIOS } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/CardStyleInterpolators'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import OrphanageMap from './pages/OrphanageMap';
import OrphanageDetails from './pages/OrphanageDetails';


const { Navigator, Screen } = createStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <Navigator screenOptions={{headerShown: false}} >
                <Screen
                    name="Orphanage"
                    component={OrphanageMap}
                />

                <Screen
                    name="OrphanageDetails"
                    component={OrphanageDetails}
                />
            </Navigator>
        </NavigationContainer>
    )
}

export default Routes;