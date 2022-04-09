import { StackScreenProps } from '@react-navigation/stack';
import React from 'react'
import { View, Text } from 'react-native';
// import { Movie } from '../interface/movieInterface';
import { RootStackParams } from '../navigation/Navigation';

interface Props extends StackScreenProps<RootStackParams, 'DetailScreen'> {}

export const DetailScreen = ( { route }:Props ) => {

  const movies = route.params;
  

  return (
    <View>
        <Text>DetailScreen</Text>
    </View>
  )
}
