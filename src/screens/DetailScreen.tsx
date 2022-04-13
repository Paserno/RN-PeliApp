import React from 'react'
import { 
  View,
  Image, 
  StyleSheet, 
  Dimensions, 
  StatusBar, 
  ScrollView, 
  Text, 
  ActivityIndicator } from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';

import { RootStackParams } from '../navigation/Navigation';

import { useMovieDetails } from '../hooks/useMovieDetails';
import { MovieDetails } from '../components/MovieDetails';
import Icon  from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const {height: screenHeight }= Dimensions.get('screen');

interface Props extends StackScreenProps<RootStackParams, 'DetailScreen'> {}

export const DetailScreen = ( { route, navigation }:Props ) => {

  const movie = route.params;
  const uri = `https://image.tmdb.org/t/p/w500${ movie.poster_path }`;

  const { isLoading, cast, movieFull } = useMovieDetails( movie.id );

  
     {/* TODO: Degradado Proximamente */}
     {/* <View style={{ 
       backgroundColor:'rgba(0, 0, 0, 0.3)',
       height: 50,
       width: 500,
       position: 'absolute',
       zIndex: 2}}/>  */}

      //  <LinearGradient 
      //       colors={[ 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.3)', 'transparent' ]}
      //       style={{...StyleSheet.absoluteFillObject}}
      //   />
  return (
   <ScrollView>
     <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      
      <View
      style={{ 
        height: 150,
        width: 500,
        position: 'absolute',
        zIndex: 2}}
        >
        <LinearGradient 
            colors={[  'rgba(0, 0, 0, 0.9)','rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.3)', 'transparent', 'transparent' ]}
            style={{...StyleSheet.absoluteFillObject}}
        />

      </View>
       

      
     <View style={ styles.imageContainer }>
       {/* Me sirve para poner una imagen en el Status Bar  barStyle="light-content" */}
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


      {
        isLoading 
            ? <ActivityIndicator size={ 35 } color='grey' style={{ marginTop: 20 }}/>
            : <MovieDetails movieFull={ movieFull! } cast={ cast }/>
      }

      <TouchableOpacity 
        style={ styles.backBotton }
        onPress={ () => navigation.goBack()}
      >
       <Icon 
        name='arrow-back-outline'
        color='white'
        size={ 60 }
        
      /> 
      </TouchableOpacity>


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
  },
  backBotton: {
    position: 'absolute',
    zIndex: 2,
    elevation: 5,
    top: 30,
    left: 5
  }
});