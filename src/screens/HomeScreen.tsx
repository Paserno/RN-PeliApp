// import { CommonActions, useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Carousel from 'react-native-snap-carousel';

import { useMovies } from '../hooks/useMovies';
import { MoviePoster } from '../components/MoviePoster';

// Sacar las Dimenciones de la pantalla, luego desestructuramos el ancho de esta.
const { width: windowWidth } = Dimensions.get('window');

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
    <View style={{ marginTop: top + 10 }}>

      <View style={{ height: 440}}>
        <Carousel 
          data={ peliculasEnCine }
          renderItem={ ({ item }: any) => <MoviePoster movie={ item }/> }
          sliderWidth={ windowWidth }
          itemWidth={ 300 }
        />

      </View>

    </View>
  )
}
