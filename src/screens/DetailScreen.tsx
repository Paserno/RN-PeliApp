import React, { useEffect } from 'react'
import { View, Text } from 'react-native';
import movieDB from '../api/movieDB';
import { MovieDBNowPlaying } from '../interface/movieInterface';


export const DetailScreen = () => {

  useEffect(() => {
    
    movieDB.get<MovieDBNowPlaying>('/now_playing').then( resp => {
            console.log(resp.data.results[0].title)
          })
    
  }, [])

  return (
    <View>
        <Text>DetailScreen</Text>
    </View>
  )
}
