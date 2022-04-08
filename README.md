> __Elemento Anterior 👀:__ __[Navigation App](https://github.com/Paserno/RN-Navigation)__
# PeliApp

Esta es una aplicación hecha con React Native, que consume una __API__, para mostrar películas populares, próximas, etc.

Elementos Utilizados:
* __[The Movie DB](https://www.themoviedb.org)__ API a consumir.
* __[React Navigation](https://reactnavigation.org/docs/getting-started)__
  * __[Stack Navigation](https://reactnavigation.org/docs/stack-navigator)__
* __[Axios](https://yarnpkg.com/package/axios)__




----
Recordar que si se desea ejecutar esta aplicación, deben de reconstruir los módulos de node así:
````
npm install
````
En el caso de tener Android Studio con un dispositivo virtual montado para ejecutar es:
````
npx react-native run-android
````
> __Elemento Posterior 👀:__ __[...](https://github.com/Paserno/RN-Calculadora)__
----
### 1.- Navegación entre Pantallas
En este punto se realizará la configuración de __[React Navigation](https://reactnavigation.org/docs/getting-started)__, para luego utilizarlo.

Pasos a Seguir:
* Seguir las instalaciónes de la documentación de __[React Navigation](https://reactnavigation.org/docs/getting-started)__. (_No olvidar implementar el código de Android de la documentación_)
* Crear 2 componentes screens __HomeScreen__ y __DetailScreen__ para implementarlo en la configuración de Stack Navigation.
* Instalar __[Stack Navigation](https://reactnavigation.org/docs/stack-navigator)__, para luego configurarlo en `navigation/Navigation.tsx`.
* Implementar Stack Navigation en App.tsx.
* Crear un botón en el componente screen __HomeScreen__ que haga la navegación al componente screen __DetailScreen__.


En `screens/DetailScreen.tsx`
* Se crean componentes basicos en `DetailScreen` y `HomeScreen`.
````
import React from 'react'
import { View, Text } from 'react-native';

export const DetailScreen = () => {
  return (
    <View>
        <Text>DetailScreen</Text>
    </View>
  )
}
````
En `navigation/Navigation.tsx`
* Se importa React, lo que viene en la documentación y finalmente importamos los 2 componentes recien creados.
````
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
````
* Sacamos la configuración de la documentación oficial de Stack Navigation.
* Agregamos algunos estilos basicos con la propiedad `screenOptions`, ocultando el header y coloriando de blanco el fondo.
* Finalmente implementamos los componentes screen en los stacks.
````
const Stack = createStackNavigator();

export const Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle:{
          backgroundColor: 'white'
        }
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} />
    </Stack.Navigator>
  );
}
````
En `App.tsx`
* Importamos e implementamos segun la documentación `<NavigationContainer>`.
* Para luego implementar el componente que creamos `<Navigation />` _(No olvidar importar)_.
````
const App = () => {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  )
}
````
En `screens/HomeScreen.tsx`
* Importamos el Custom Hook de React Navigation `useNavigation` y `CommonActions`.
````
import { CommonActions, useNavigation } from '@react-navigation/native';
...
````
* Implementamos el botón, con la navegación hacia el otro componente screen.
````
<Button 
  title='ir detalle'
  onPress={ () => navigation.dispatch(CommonActions.navigate({name: 'DetailScreen'})) }
/>
````
----
### 2.- Obtener péliculas - Tipado
En este punto se instalará __axios__ para utilizar la API, una vez hecha la configuración, se hara el tipado de lo que se reciba.

Pasos a Seguir: 
* Instalamos __Axios__, para luego realizar la configuración en `api/movieDB.tsx`.
* Creamos el tipado con la extención __Paste JSON as Conde__ o con __[Quick Type](https://quicktype.io)__.
* Implementamos un __useEffect__ en `screen/DetailScreen.tsx`.

En `api/movieDB.tsx`
* Una vez instalado __Axios__, se importa.
* Para luego crear la configuración de enviando como __baseURL__ la API que será consumida, ademas de algunos parametros como `api_key` que es entregada al momento de registrar una aplicación en __The Movie DB__, y el lenguaje que queremos recibir las respuestas.
* Finalmente lo exportamos por defecto.
````
import axios from 'axios';

const movieDB = axios.create({
    baseURL: 'https://api.themoviedb.org/3/movie',
    params: {
        api_key: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
        language: 'es-ES',
    }
})

export default movieDB;
````
En `interface/movieInterface.tsx`
* Realizamos la consutla en __Postman__ luego copiamos los resultados para pegarlos en __[Quick Type](https://quicktype.io)__, definimos que lo queremos en __TypeScript__.
* Una vez hecho lo pegamos, y nos creará una interface con todos los elementos de la petición. 
````
export interface MovieDBNowPlaying {
    dates:         Dates;
    page:          number;
    results:       Movie[];
    total_pages:   number;
    total_results: number;
}
````
En ``
* Importamos 3 nuevos elementos en el componente, el __useEffect__, la API `movieDB` y la interface para tener ayuda de tipeo.
````
import React, { useEffect } from 'react'
import movieDB from '../api/movieDB';
import { MovieDBNowPlaying } from '../interface/movieInterface';
...
````
* Implementamos el useEffect.
* Creamos el `.get` con la interface, le entregamos la ruta y recibimos respuesta a traves de la impresión por pantalla.
````
useEffect(() => {
    movieDB.get<MovieDBNowPlaying>('/now_playing').then( resp => {
            console.log(resp.data.results[0].title)
          })
  }, [])
````
----
### 3.- CustomHook - useMovies
En este punto se extraerá lo que se tiene en el componente __DetailScreen__ específicamente el useEffect y convertirlo en un CustomHook.

Paso a Seguir:
* Extraer useEffect de __DetailScreen__ y crear un nuevo customHook en `hooks/useMovies.tsx`.
* Implementar el CustomHook __useMovie__ en el componente __HomeScreen__.

En `hooks/useMovies.tsx`
* Importamos hooks de React, la api movieBD y el interface de la api.
````
import { useEffect, useState } from 'react';
import movieDB from '../api/movieDB';
import { MovieDBNowPlaying, Movie } from '../interface/movieInterface';
````
* Creamos el Custom Hook llamado useMovies.
* Implementamos el primer __useState__ que se encargará de informar si la petición a la API esta lista o no.
* El segundo hook recibirá la información de las peticiones relacionada a las pleiculas, le establecemos una interface que nos ayudará con el tipado.
* Creamos una función asíncrona, que recibirá la respuesta de la API, ademas de cambiar el estado del primer __useState__ cuando la función termine.
* Implementamos un useEffect que llamará la función recién mencionada, cada vez que es renderizado el componente será llamado el useEffect con su función.
* Finalmenete retornamos los dos useState.
````
export const useMovies = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [peliculasEnCine, setPeliculasEnCine] = useState<Movie[]>([])

    const getMovie = async() => {
        const resp = await movieDB.get<MovieDBNowPlaying>('/now_playing');
        setPeliculasEnCine(resp.data.results);
        
        setIsLoading( false );
    }
    
    useEffect(() => {
        getMovie();        
      }, [])

  return {
    peliculasEnCine,
    isLoading
  }
}
````
En `screens/HomeScreen.tsx`
* Importamos 2 elementos nuevos `ActivityIndicator` un componente UI de React Native y useMovie el customHook creado.
````
...
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useMovies } from '../hooks/useMovies';
````
* Implementamos el CustomHook y desestructuramos los elementos del Hook.
* Creamos una condición, en el caso de tener `isLoading` en true, saldra un indicador de carga circular, que le aplicamos algunos estilos `ActivityIndicator`.
````
 const { peliculasEnCine, isLoading } = useMovies();

if ( isLoading ){
   return (
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
       <ActivityIndicator color="purple" size={ 100 }/>
     </View>
   )
}
````
* En el return del componente mostramos el titulo de una pelicula.
````
<Text>{ peliculasEnCine[4]?.title }</Text>
````
----