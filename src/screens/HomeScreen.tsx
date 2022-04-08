import { CommonActions, useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, Text, Button } from 'react-native';

export const HomeScreen = () => {

  const navigation = useNavigation();

  return (
    <View>
        <Text>HomeScreen</Text>

        <Button 
          title='ir detalle'
          onPress={ () => navigation.dispatch(CommonActions.navigate({name: 'DetailScreen'})) }
        />
    </View>
  )
}
