> __Elemento Anterior 👀:__ __[Navigation App](https://github.com/Paserno/RN-Navigation)__
# PeliApp

Esta es una aplicación hecha con React Native, que consume una __API__, para mostrar películas populares, próximas, etc.

Elementos Utilizados:
* __[The Movie DB](https://www.themoviedb.org)__ API a consumir.
* __[React Navigation](https://reactnavigation.org/docs/getting-started)__
  * __[Stack Navigation](https://reactnavigation.org/docs/stack-navigator)__
* __[Axios](https://yarnpkg.com/package/axios)__
* __[RN Snap Carousel](https://github.com/meliorence/react-native-snap-carousel)__



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
### 4.- Mostrar Poster de Películas
En este punto se hará la construcción de un componente nuevo que recibirá la película y la mostrará como una imagen.

Pasos a Seguir:
* Creación de nuevo componente que mostrará el poster en `components/MoviePoster.tsx`.
* Modificamos __HomeScreen__ para entregar la pelicula que desamos ver en el poster del nuevo componente.

En `components/MoviePoster.tsx`
* Importamos diferentes elementos como React, elementos de React Native y `Movie` que es una interface para el tipado.
````
import React from 'react'
import { View, Image, StyleSheet } from 'react-native';
import { Movie } from '../interface/movieInterface';
````
* Creamos una interface que recibirá nuestro nuevo componente.
````
interface Props {
  movie: Movie
}
````
* Se crea el componente __MoviePoster__ que recibe por parametros `movie`.
* Extraemos el path que nos recomienda la [documentación](https://developers.themoviedb.org/3/getting-started/images) para mostrar las imagenes.
  * Creamos una constante que recibe el path, ademas le pasamos el valor `movie.poster_path` que viene de la API.
* rentornamos 2 `View` y un `Image` que se mostrará la imagen.
````
export const MoviePoster = ({ movie }: Props) => {

    const uri = `https://image.tmdb.org/t/p/w500${ movie.poster_path }`

  return (
    <View style={{
        width: 300,
        height: 420,
    }}>
        <View style={ styles.imageContainer }>
            <Image 
                source={{ uri }}
                style={ styles.image }
            />
        </View>
    </View>
  )
}
````
* Creamos un `StyleSheet` para estilizar el componente.
  * Dedicamos un estilo personal a la imagen con bordes.
  * Gracias a [Generador de Sombras en RN](https://ethercreative.github.io/react-native-shadow-generator/) agregamos unas sombras al contenedor de la imagen, para darle un toque estetico, ademas de unos bordes redondeados.
````
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
````
En `screens/HomeScreen.tsx`
* Importamos el Hook `useSafeAreaInsets`, para luego implementarlo, desestructurando el `top`.
````
const { top } = useSafeAreaInsets();
````
* En el return agregamos un margen, ademas de implementar el componente que recién mostramos y le enviamos una propiedad llamada `movie`
````
return (
  <View style={{ marginTop: top + 20 }}>
      <MoviePoster
        movie={ peliculasEnCine[5] }
      />
  </View>
)
````
----
### 5.- Carrusel de Tarjeta
En este punto se instala un carrusel para mostrar las tarjetas dinamicamente.

Pasos a Seguir:
* Importar __[RN Snap Carousel](https://github.com/meliorence/react-native-snap-carousel)__
* Modificamos el componente HomeScreen para mostrar el carrusel.

En `screens/HomeScreen.tsx`
* Se importa `Dimensions`, para luego desestructurar la dimensión del dispositivo, específicamente el ancho.
````
const { width: windowWidth } = Dimensions.get('window');
````
* Creamos un nuevo `View` para el carrusel dandole una altura mayor.
* El carrusel lo importamos, para luego darle algunas propiedades.
  * `data` le pasamos `peliculasEnCine`.
  * `renderItem` Le pasamos el componente que creamos para mostrar los poster, pasandole la propiedad `item`.
  * `sliderWidth` le pasamos el ancho del dispositivo.
  * `itemWidth` le pasamos unos 300 para que se vea bien.
````
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
````
----
### 6.- FlatList de Películas
En este punto se mostrará un listado de películas populares.

Pasos a Seguir:
* Se le agregan propiedades que recibirá el componente __MoviePoster__.
* Implementar `FlatList` con las peliculas en __HomeScreen__.

En `components/MoviePoster.tsx`
* Adaptamos la interface del componente __MoviePoster__.
````
interface Props {
    movie: Movie;
    height?: number;
    width?: number;
}
````
* Agregamos propiedades nuevas y ademas dejamos valores por defecto.
````
export const MoviePoster = ({ movie, height = 420, width = 300 }: Props) => {...}
````
* Modificamos el estilo del primer `View`, agregandole 8 de margen horizontal.
````
<View style={{
  width,
  height,
  marginHorizontal: 8
}}>
````
En `screens/HomeScreen.tsx`
* Encrerramos todo el contenido del __HomeScreen__ en un `<ScrollView>`. (_no olvidar importarlo_)
````
return (
  <ScrollView>
    ...
  </ScrollView>
````
* Encerramos en un `View` con algunos estilos para identificar el tamaño y agregamos un texto.
* Creamos el Primer `<FlatList />` y le agregamos algunas propiedades muy similar al `<Carousel />`.
  * `data` al igual que el carrusel, `renderItem` con la unica diferencia que mandamos propiedades de `height` y `width`.
  * Agregamos una propiedad nueva `keyExtractor` para identificar el componente renderizado.
  * Agregamos la propiedad `horizontal` para que la lista se vea horizontalmente y eliminamos el scroll.
````
<View style={{ backgroundColor: 'red', height: 260}}>
  <Text style={{ fontSize: 30, fontWeight: 'bold'}}>En Cine</Text>

  <FlatList 
    data={ peliculasEnCine }
    renderItem={ ({ item }: any) => (
      <MoviePoster movie={ item } height={ 200 } width={ 140 } />
    )}
    keyExtractor={ (item) => item.id.toString() }
    horizontal={ true }
    showsHorizontalScrollIndicator={ false }
  />
</View>
````
----
### 7.- Componente HorizontalSlider
En este punto se creará un componente que será llamado por __HomeScreen__, para mostrar los carruseles pequeños.

Pasos a seguir: 
* Copiar `View` que tiene el `Text` y `FlatList` que esta en __HomeScreen__ para crear un componente totalmente nuevo, para luego llamarlo por el mismo componente que se extrajo.
* Mandar argumentos necesarios a __HorizontalSlider__ en __HomeScreen__. 

En `components/HorizontalSlider.tsx`
* Se importa React, elementos de React Native, `Movie` que viene de la interface de API y __MoviePoster__ que tiene el componente Poster.
````
import React from 'react'
import { View, Text, FlatList } from 'react-native';
import { Movie } from '../interface/movieInterface';

import { MoviePoster } from './MoviePoster';
````
* Creamos una nueva interface de las Props que recibirá nuestro nuevo componente.
````
interface Props{
  title?: string;
  movies: Movie[];
}
````
* Creamos nuestra componente __HorizontalSlider__, que recíbe por parametros `title` y `movies` le pasamos la interface.
* En el return del componente tenemos el `View` con un estilo con condición, en el caso de recibir el `title` se verá en un tamaño de 260 en el caso que no 220.
* Creamos otra condición por si viene el titulo mostrarlo, esto lo hacemos con lógica booleana.
* Copiamos el mismo `<FlatList />` de la paso anterior, con la diferencia que le pasaremos en `data` la propiedad que recíbe el componente `movies`.
````
export const HorizontalSlider = ({ title, movies}: Props) => {
  return (
    <View style={{
        height: ( title ) ? 260 : 220
    }}>

        {
            title && <Text style={{ fontSize: 30, fontWeight: 'bold', marginLeft: 10}}>{ title }</Text>
        }
        
        <FlatList 
          data={ movies }
          renderItem={ ({ item }: any) => (
            <MoviePoster movie={ item } height={ 200 } width={ 140 } />
          )}
          keyExtractor={ (item) => item.id.toString() }
          horizontal={ true }
          showsHorizontalScrollIndicator={ false }
        />
    </View>
  )
}
````
* Importamos el componente __HorizontalSlider__.
````
...
import { HorizontalSlider } from '../components/HorizontalSlider';
````
* Finalmente invocamos el componente __HorizontalSlider__ para pasarle por argumento el `title` y `movies` de esta manera se encapsular el código que antes se tenia en un componente y luego invocarlo cuantas veces sea necesario. 
````
<HorizontalSlider title="En cine" movies={ peliculasEnCine } />
````
----
### 8.- Múltiples Peticiones Simultaneas
En este punto se crea varias peticiones a la API __The MovieDB__, para mostrar diferentes carruseles con las películas.

Paso a Seguir: 
* Se modifica el CustomHook __useMovies__, para realizar multiples peticiones hacia la API, y luego mandar la información en un state.
* Se arregla la implementación de __useMovies__ en el componente __HomeScreen__.

En `hooks/useMovies.tsx`
* Se implemento una nueva interface para el useState nuevo que se usará.
````
interface MoviesState {
  nowPlaying: Movie[];
  popular: Movie[];
  topRated: Movie[];
  upcoming: Movie[];
}
````
* Se eliminan los anteriores useState, para agregar un nuevo state que maneje el contenido de la API.
* Se le asigna valores como un arreglo vacío para no tener problemas con el tipado.
````
const [moviesState, setMoviesState] = useState<MoviesState>({
  nowPlaying: [],
  popular: [],
  topRated: [],
  upcoming: [],
});
````
* Realizamos diferentes peticiones a la función `movieDB` que se conecta con la API, y le pasamos la ruta que se necesita.
* Para luego realizar un `Propise.all()` que traiga multiples promesas en un arreglo, esto dando un resultado asíncrono con todas las peticiones.
* Finalmente asignando estos valores al __useState__.
````
const getMovie = async() => {
    
    const nowPlayingPromise = movieDB.get<MovieDBResponse>('/now_playing');
    const popularPromise    = movieDB.get<MovieDBResponse>('/popular');
    const topRatedPromise   = movieDB.get<MovieDBResponse>('/top_rated');
    const upcomingPromise   = movieDB.get<MovieDBResponse>('/upcoming');

    const resps = await Promise.all([
      nowPlayingPromise,
      popularPromise,
      topRatedPromise,
      upcomingPromise
    ]);

    setMoviesState({
      nowPlaying: resps[0].data.results,
      popular: resps[1].data.results,
      topRated: resps[2].data.results,
      upcoming: resps[3].data.results,
  })
    
    setIsLoading( false );
}
````
* En el return del Hook utilizamos el operador spread para enviar todos los valores de `...moviesState`.
````
return {
  ...moviesState,
  isLoading,
}
````
En `screens/HomeScreen.tsx`
* Modificamos lo que desestructuramos del __useMovies__, para tener todos los elementos.
````
const { nowPlaying, popular, topRated, upcoming, isLoading } = useMovies();
````
* Finalmente mandamos la `data` en el carrusel y en nuestro componente __HorizontalSlider__ enviamos la movie del contenido del CustomHook __useMovies__.
````
<View style={{ height: 440}}>
  <Carousel 
    data={ nowPlaying }
    renderItem={ ({ item }: any) => <MoviePoster movie={ item }/> }
    sliderWidth={ windowWidth }
    itemWidth={ 300 }
    inactiveSlideOpacity={ 0.9 }
  />
</View>

<HorizontalSlider title="Populares" movies={ popular } />
<HorizontalSlider title="Más Votados" movies={ topRated } />
<HorizontalSlider title="Próximamente" movies={ upcoming } />
````
----
### 9.- Navegar Pantalla Detalle
En este punto se crea el botón que hará la navegación hacia el componente __DetailScreen__ y pasarle las propiedades.

Pasos a Seguir: 
* Agregamos tipado a la navegación hacia cada componente screen en __Navigation__.
* Se modifico el componente __MoviePoster__ para establecerlo como un botón que realizará la navegación hacia el componente __DetailScreen__ y pasarle los argumentos.
* Preparamos el componente para recibir las propiedades en __DetailScreen__.

En `navigation/Navigation.tsx`
* Agregue el tipado que recibirá los componentes screens.
* Ademas de implementarlo en el Stack.
````
export type RootStackParams = {
  HomeScreen: undefined;
  DetailScreen: Movie;
}

const Stack = createStackNavigator<RootStackParams>();
````
En `components/MoviePoster.tsx`
* Importamos useNavigation, para luego implementarlo.
````
const navigation = useNavigation();
````
* Cambiamos el return del componente por un `<TouchableOpacity>` y le agregamos las propiedades que se tenian anteriormente en el `View`, ademas de un `activeOpacity` y un `onPress` que hará la navegación hacia el otro componente __DetailScreen__, mandandole argumentos.
````
return (
  <TouchableOpacity 
      onPress={ () => navigation.dispatch(
          CommonActions.navigate({
              name: 'DetailScreen',  
              params: movie,
          })
      ) }
      activeOpacity={ 0.8 }
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
````
En `screen/DetailScreen.tsx`
* Creamos una interface que nos ayudará con el tipado en el componente.
````
interface Props extends StackScreenProps<RootStackParams, 'DetailScreen'> {}
````
* Recibimos por las propiedades `{ route }`.
````
export const DetailScreen = ( { route }:Props ) => { ... }
````
* Recibimos los params que fueron enviados por el componente __MoviePoster__ y lo almacenamos en una constante, para finalmente imprimir por consola.
````
const movies = route.params;

console.log(movies);
````
----
### 10.- Diseño inicial de Detalles
En este punto se creo el diseño inicial que contará el componente __DetailScreen__, iniciando con la imagen y su diseño.

Paso a Seguir:
* Ya que se tiene las propiedades necesarias para armar el componente, ahora comenzaremos aplicar diseño en `screens/DetailScreen.tsx`.

En `screens/DetailScreen.tsx`
* Se encerro el contenido del componente en un `<ScrollView>`, ademas de establecer un `<StatusBar />` con la propiedad `translucent` para que la imagen que pongamos llegue hasta el Barra de estado y le agregamos una transparencia.
* Agregamos `View` que serviran como contenedores, uno para la imagen y otro para el texto con sus estilos. 
````
return (
   <ScrollView>
     <StatusBar translucent barStyle="light-content" backgroundColor="rgba(0, 0, 0, 0.3)" />
     <View style={ styles.imageContainer }>
  
         <Image 
             source={{ uri }}
             style={ styles.posterImage }
         />
     </View> 

    <View style={ styles.marginContainer }>
      <Text style={ styles.subTitle }>{ movie.original_title }</Text>
      <Text style={ styles.title }>{ movie.title }</Text>
    </View>

   </ScrollView>
  )
````
* Se agregan los estilos, para que la imagen se vea un 70% de la pantalla, y con bordes redondeados, ademas de algunos estilos adicionales. 
````
const styles = StyleSheet.create({
  imageContainer:{
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
  posterImage:{
    flex: 1,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
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
````
----
### 10,5.- Animación en Stack Navigation
Se le agrega una animaciones al momento de abrir el componente __DetailScreen__.

Pasos a Seguir:
* Se le agrega algunas propiedades adicionales al Stack Navigation en `navigation/Navigation.tsx`.

En `navigation/Navigation.tsx`
* En el stack navigation le agregamos algunas propiedades nuevas.
  * `gestureEnabled` esta propiedad por defecto android la tiene en false, esta vez la activamos para poder cerrar el stack de otra forma. (_Arrastrando el dedo de una esquina de la pantalla_)
  * `gestureDirection` en `vertical` permite cerrar el stack arrastrando el dedo por la esquina superior de la pantalla.
  * `cardStyleInterpolator` con este elemento podemos agregar animaciones, no olvidar importar `CardStyleInterpolators`, para tener las diferentes animaciones disponibles. (_[Animaciones aquí](https://reactnavigation.org/docs/stack-navigator/#cardstyleinterpolators)_)
````
<Stack.Navigator
  screenOptions={{
    headerShown: false,
    gestureEnabled: true,
    gestureDirection: 'vertical',
    cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid,
    cardStyle:{
      backgroundColor: 'white'
    }
  }}
>
````
----
### 11.- CustomHook - useMovieDetails
En este punto se realizará la implementación de un nuevo Custom Hook para mostrar el manejo del contenido que se mostrará en el componente __DetialScreen__

Pasos a Seguir:
* Se implementa una nueva interface graicas a __[Quick Type](https://quicktype.io)__, extrayendo el contenido de la API y transformandola en una nueva interface que nos ayudará con el tipado.
* Se crea el CustomHook __useMovieDetails__.

En `hooks/useMovieDetails.tsx`
* Se importan diferentes elementos como los hooks de react, `moveDB` para extraer el contenido de la API y `MovieFull` la nueva interface que se utilizará para ayudar en el tipado.
````
import { useState, useEffect } from 'react';
import movieDB from '../api/movieDB';
import { MovieFull } from '../interface/movieInterface';
````
* Creamos una interface que tendrá el CustomHook.
````
interface MovieDetails {
    isLoading: boolean;
    movieFull: MovieFull;
    cast: any[];
}
````
* Se crea el CustomHook llamado __useMovieDetails__ que recibe por parametros `movieId`.
* Creamos un __useState__ que le agregamos la interface.
* Creamos la función `getMovieDetails` asíncrona, que recibirá el contenido de la API.
* Agregamos un __useEffect__ que disparará la función recién mencionada.
* Finalmente retornando el estado.
````
export const useMovieDetails = ( movieId: number ) => {
  
    const [state, setState] = useState<MovieDetails>();

    const getMovieDetials = async() => {
        const resp = await movieDB.get<MovieFull>(`/${ movieId }`);

        console.log(resp.data.overview);
    }

    useEffect(() => {      
        getMovieDetials();

    }, [])
    
    return {
        state,
    }
}
````
----