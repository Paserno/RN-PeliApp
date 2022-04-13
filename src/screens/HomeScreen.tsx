// import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react'
import { View, ActivityIndicator, Dimensions, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Carousel from 'react-native-snap-carousel';

import { useMovies } from '../hooks/useMovies';
import { MoviePoster } from '../components/MoviePoster';
import { HorizontalSlider } from '../components/HorizontalSlider';
import { GradientBackground } from '../components/GradientBackground';
import { getImageColores } from '../helpers/getColores';
import { GradientContext } from '../context/GradientContext';
import { useEffect } from 'react';

// Sacar las Dimenciones de la pantalla, luego desestructuramos el ancho de esta.
const { width: windowWidth } = Dimensions.get('window');

export const HomeScreen = () => {

  const { nowPlaying, popular, topRated, upcoming, isLoading } = useMovies();
  const { top } = useSafeAreaInsets();
  const { setMainColors } = useContext(GradientContext);

  const getPosterColors = async( index: number ) => {
    const movie = nowPlaying[index];
    const uri = `https://image.tmdb.org/t/p/w500${ movie.poster_path }`;

    const [primary = 'transparent', secondary = 'transparent'] = await getImageColores( uri );
    setMainColors({ primary, secondary})
  }

  useEffect(() => {
    if( nowPlaying.length > 0){
      getPosterColors(0)
    }

  }, [ nowPlaying ])
  

  if ( isLoading ){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color="purple" size={ 100 }/>
      </View>
    )
  }

  return (
    <GradientBackground> 
     <StatusBar  translucent barStyle="light-content" backgroundColor="transparent" />


      <ScrollView>
        <View style={{ marginTop: top + 10 }}>

          {/* Carrusel Principal */}
          <View style={{ height: 440}}>
            <Carousel 
              data={ nowPlaying }
              renderItem={ ({ item }: any) => <MoviePoster movie={ item }/> }
              sliderWidth={ windowWidth }
              itemWidth={ 300 }
              inactiveSlideOpacity={ 0.9 }
              onSnapToItem={ index => getPosterColors( index ) }
            />
          </View>
          {/* Películas Populares */}
          <HorizontalSlider title="Populares" movies={ popular } />
          <HorizontalSlider title="Más Votados" movies={ topRated } />
          <HorizontalSlider title="Próximamente" movies={ upcoming } />

        </View>
      </ScrollView>
    </GradientBackground>

  )
}
