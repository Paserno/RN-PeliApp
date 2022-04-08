import { CommonActions, useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, ActivityIndicator } from 'react-native';
import { useMovies } from '../hooks/useMovies';
import { MoviePoster } from '../components/MoviePoster';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HomeScreen = () => {

  const { peliculasEnCine, isLoading } = useMovies();
  const { top } = useSafeAreaInsets();

  if ( isLoading ){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color="purple" size={ 100 }/>
      </View>
    )
  }

  return (
    <View style={{ marginTop: top + 20 }}>
        <MoviePoster
          movie={ peliculasEnCine[5] }
        />
    </View>
  )
}
