import { StackScreenProps } from '@react-navigation/stack';
import React from 'react'
import { View, Image, StyleSheet, Dimensions, StatusBar, ScrollView, Text } from 'react-native';
import { RootStackParams } from '../navigation/Navigation';

import Icon from 'react-native-vector-icons/Ionicons'
import { useMovieDetails } from '../hooks/useMovieDetails';

const {height: screenHeight }= Dimensions.get('screen');

interface Props extends StackScreenProps<RootStackParams, 'DetailScreen'> {}

export const DetailScreen = ( { route }:Props ) => {

  const movie = route.params;
  const uri = `https://image.tmdb.org/t/p/w500${ movie.poster_path }`;

  const { isLoading, cast, movieFull } = useMovieDetails( movie.id );

  return (
   <ScrollView>
     {/* TODO: Degradado Proximamente */}
     {/* <View style={{ backgroundColor:'rgba(0, 0, 0, 0.3)', height: 50, width: 500, position: 'absolute', zIndex: 2,}}/> */}
     <StatusBar translucent barStyle="light-content" backgroundColor="rgba(0, 0, 0, 0.3)" />

      
     <View style={ styles.imageContainer }>
       {/* Me sirve para poner una imagen en el Status Bar  barStyle="light-content"*/}
        <View style={ styles.imageBorder}>
         <Image 
             source={{ uri }}
             style={ styles.posterImage }
         />

        </View>
     </View> 

    <View style={ styles.marginContainer }>
      <Text style={ styles.subTitle }>{ movie.original_title }</Text>
      <Text style={ styles.title }>{ movie.title }</Text>
    </View>

    <View style={ styles.marginContainer }>
      <Icon 
        name='star-outline'
        color='grey'
        size={ 20 }
      />

    </View>


   </ScrollView>
  )
}

const styles = StyleSheet.create({
  imageContainer:{
    // overflow: 'hidden',
    borderBottomLeftRadius: 75,
    width: '100%',
    height: screenHeight * 0.7,
    shadowColor: "#000",
    borderRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.24,
    shadowRadius: 7,

    elevation: 10,
  },
  imageBorder:{
    flex: 1,
    overflow: 'hidden',
    borderBottomLeftRadius: 75,
    // borderBottomRightRadius: 25,
  },
  posterImage:{
    flex: 1,
    
  },
  marginContainer: {
    marginHorizontal: 20,
    marginTop: 20
  },
  subTitle: {
    fontSize: 16,
    opacity: 0.6,
    color: 'black'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  }
});