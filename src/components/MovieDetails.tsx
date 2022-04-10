import React from 'react'
import { Text, View } from 'react-native';
import currencyFormatter from 'currency-formatter';


import Icon  from 'react-native-vector-icons/Ionicons';
import { MovieFull } from '../interface/movieInterface';
import { Cast } from '../interface/creditsInterface';

interface Props {
    movieFull: MovieFull;
    cast: Cast[];
}

export const MovieDetails = ({movieFull, cast}: Props) => {
  return (
        /* Detalles */
    <View style={{ marginHorizontal: 20 }}>
        <View style={{ flexDirection: 'row' }}>
            <Icon 
                name='star-outline'
                color='gray'
                size={ 16 }
            />

            <Text> { movieFull.vote_average }</Text>
                
            <Text style={{ marginLeft: 5}}>
                - { movieFull.genres.map( g => g.name).join(', ') }
            </Text>
        </View>

        {/* Historia */}
        <Text style={{ fontSize: 23, marginTop: 10, fontWeight: 'bold', color:'black' }}>
            Historia
        </Text>
        <Text style={{ fontSize: 16 }}>
            { movieFull.overview }
        </Text>

        {/* Historia */}
        <Text style={{ fontSize: 23, marginTop: 10, fontWeight: 'bold', color:'black' }}>
            Presupuesto
        </Text>
        <Text style={{ fontSize: 18 }}>
            { currencyFormatter.format(movieFull.budget, { code:'USD'}) }
        </Text>

    </View>

         /* Casting */
  )
}
