import { CommonActions, useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useMovies } from '../hooks/useMovies';

export const HomeScreen = () => {

  const navigation = useNavigation();
  const { peliculasEnCine, isLoading } = useMovies();

  if ( isLoading ){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color="purple" size={ 100 }/>
      </View>
    )
  }

  return (
    <View>
        <Text>HomeScreen</Text>
        <Text>{peliculasEnCine[4]?.title}</Text>

        <Button 
          title='ir detalle'
          onPress={ () => navigation.dispatch(CommonActions.navigate({name: 'DetailScreen'})) }
        />
    </View>
  )
}
