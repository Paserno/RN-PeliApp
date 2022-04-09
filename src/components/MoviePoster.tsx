import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Movie } from '../interface/movieInterface';
import { useNavigation, CommonActions } from '@react-navigation/native';

interface Props {
    movie: Movie;
    height?: number;
    width?: number;
}

export const MoviePoster = ({ movie, height = 420, width = 300 }: Props) => {

    const uri = `https://image.tmdb.org/t/p/w500${ movie.poster_path }`;

    const navigation = useNavigation();
     

  return (
    <TouchableOpacity 
        onPress={ () => navigation.dispatch(
            CommonActions.navigate({
                name: 'DetailScreen',  
                params: movie,
            })
        ) }
        activeOpacity={ 0.8}
        style={{
            width,
            height,
            marginHorizontal: 8
        }}
    >
        <View style={ styles.imageContainer }>
            <Image 
                source={{ uri }}
                style={ styles.image }
            />

        </View>
    </TouchableOpacity>

  )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        borderRadius: 18,
    },
    imageContainer:{
        flex: 1,
        shadowColor: "#000",
        borderRadius: 18,
        shadowOffset: {
        	width: 0,
        	height: 10,
        },
        shadowOpacity: 0.24,
        shadowRadius: 7,

        elevation: 10,
    }
});