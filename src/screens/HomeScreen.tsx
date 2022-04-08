// import { CommonActions, useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, ActivityIndicator, Dimensions, FlatList, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Carousel from 'react-native-snap-carousel';

import { useMovies } from '../hooks/useMovies';
import { MoviePoster } from '../components/MoviePoster';
import { HorizontalSlider } from '../components/HorizontalSlider';

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
    <ScrollView>
      <View style={{ marginTop: top + 10 }}>

        {/* Carrusel Principal */}
        <View style={{ height: 440}}>
          <Carousel 
            data={ peliculasEnCine }
            renderItem={ ({ item }: any) => <MoviePoster movie={ item }/> }
            sliderWidth={ windowWidth }
            itemWidth={ 300 }
            inactiveSlideOpacity={ 0.9 }
          />
        </View>
        {/* Películas Populares */}
        <HorizontalSlider title="En cine" movies={ peliculasEnCine } />

       

      </View>
    </ScrollView>
  )
}
