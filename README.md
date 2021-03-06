> __Elemento Anterior 馃憖:__ __[Navigation App](https://github.com/Paserno/RN-Navigation)__
# PeliApp

Esta es una aplicaci贸n hecha con React Native, que consume una __API__, para mostrar pel铆culas populares, pr贸ximas, etc.

Elementos Utilizados:
* __[The Movie DB](https://www.themoviedb.org)__ API a consumir.
* __[React Navigation](https://reactnavigation.org/docs/getting-started)__
  * __[Stack Navigation](https://reactnavigation.org/docs/stack-navigator)__
* __[Axios](https://yarnpkg.com/package/axios)__
* __[RN Snap Carousel](https://github.com/meliorence/react-native-snap-carousel)__
* __[Currency Formatter](https://github.com/smirzaei/currency-formatter#readme)__

* __[Gradiante Lineal](https://github.com/react-native-linear-gradient/react-native-linear-gradient)__
* __[Colores de Imagen](https://github.com/osamaqarem/react-native-image-colors)__


----
Recordar que si se desea ejecutar esta aplicaci贸n, deben de reconstruir los m贸dulos de node as铆:
````
npm install
````
En el caso de tener Android Studio con un dispositivo virtual montado para ejecutar es:
````
npx react-native run-android
````
> __Elemento Posterior 馃憖:__ __[...](https://github.com/Paserno/RN-Calculadora)__
----
### 1.- Navegaci贸n entre Pantallas
En este punto se realizar谩 la configuraci贸n de __[React Navigation](https://reactnavigation.org/docs/getting-started)__, para luego utilizarlo.

Pasos a Seguir:
* Seguir las instalaci贸nes de la documentaci贸n de __[React Navigation](https://reactnavigation.org/docs/getting-started)__. (_No olvidar implementar el c贸digo de Android de la documentaci贸n_)
* Crear 2 componentes screens __HomeScreen__ y __DetailScreen__ para implementarlo en la configuraci贸n de Stack Navigation.
* Instalar __[Stack Navigation](https://reactnavigation.org/docs/stack-navigator)__, para luego configurarlo en `navigation/Navigation.tsx`.
* Implementar Stack Navigation en App.tsx.
* Crear un bot贸n en el componente screen __HomeScreen__ que haga la navegaci贸n al componente screen __DetailScreen__.


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
* Se importa React, lo que viene en la documentaci贸n y finalmente importamos los 2 componentes recien creados.
````
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
````
* Sacamos la configuraci贸n de la documentaci贸n oficial de Stack Navigation.
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
* Importamos e implementamos segun la documentaci贸n `<NavigationContainer>`.
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
* Implementamos el bot贸n, con la navegaci贸n hacia el otro componente screen.
````
<Button 
  title='ir detalle'
  onPress={ () => navigation.dispatch(CommonActions.navigate({name: 'DetailScreen'})) }
/>
````
----
### 2.- Obtener p茅liculas - Tipado
En este punto se instalar谩 __axios__ para utilizar la API, una vez hecha la configuraci贸n, se hara el tipado de lo que se reciba.

Pasos a Seguir: 
* Instalamos __Axios__, para luego realizar la configuraci贸n en `api/movieDB.tsx`.
* Creamos el tipado con la extenci贸n __Paste JSON as Conde__ o con __[Quick Type](https://quicktype.io)__.
* Implementamos un __useEffect__ en `screen/DetailScreen.tsx`.

En `api/movieDB.tsx`
* Una vez instalado __Axios__, se importa.
* Para luego crear la configuraci贸n de enviando como __baseURL__ la API que ser谩 consumida, ademas de algunos parametros como `api_key` que es entregada al momento de registrar una aplicaci贸n en __The Movie DB__, y el lenguaje que queremos recibir las respuestas.
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
* Una vez hecho lo pegamos, y nos crear谩 una interface con todos los elementos de la petici贸n. 
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
* Creamos el `.get` con la interface, le entregamos la ruta y recibimos respuesta a traves de la impresi贸n por pantalla.
````
useEffect(() => {
    movieDB.get<MovieDBNowPlaying>('/now_playing').then( resp => {
            console.log(resp.data.results[0].title)
          })
  }, [])
````
----
### 3.- CustomHook - useMovies
En este punto se extraer谩 lo que se tiene en el componente __DetailScreen__ espec铆ficamente el useEffect y convertirlo en un CustomHook.

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
* Implementamos el primer __useState__ que se encargar谩 de informar si la petici贸n a la API esta lista o no.
* El segundo hook recibir谩 la informaci贸n de las peticiones relacionada a las pleiculas, le establecemos una interface que nos ayudar谩 con el tipado.
* Creamos una funci贸n as铆ncrona, que recibir谩 la respuesta de la API, ademas de cambiar el estado del primer __useState__ cuando la funci贸n termine.
* Implementamos un useEffect que llamar谩 la funci贸n reci茅n mencionada, cada vez que es renderizado el componente ser谩 llamado el useEffect con su funci贸n.
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
* Creamos una condici贸n, en el caso de tener `isLoading` en true, saldra un indicador de carga circular, que le aplicamos algunos estilos `ActivityIndicator`.
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
### 4.- Mostrar Poster de Pel铆culas
En este punto se har谩 la construcci贸n de un componente nuevo que recibir谩 la pel铆cula y la mostrar谩 como una imagen.

Pasos a Seguir:
* Creaci贸n de nuevo componente que mostrar谩 el poster en `components/MoviePoster.tsx`.
* Modificamos __HomeScreen__ para entregar la pelicula que desamos ver en el poster del nuevo componente.

En `components/MoviePoster.tsx`
* Importamos diferentes elementos como React, elementos de React Native y `Movie` que es una interface para el tipado.
````
import React from 'react'
import { View, Image, StyleSheet } from 'react-native';
import { Movie } from '../interface/movieInterface';
````
* Creamos una interface que recibir谩 nuestro nuevo componente.
````
interface Props {
  movie: Movie
}
````
* Se crea el componente __MoviePoster__ que recibe por parametros `movie`.
* Extraemos el path que nos recomienda la [documentaci贸n](https://developers.themoviedb.org/3/getting-started/images) para mostrar las imagenes.
  * Creamos una constante que recibe el path, ademas le pasamos el valor `movie.poster_path` que viene de la API.
* rentornamos 2 `View` y un `Image` que se mostrar谩 la imagen.
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
* En el return agregamos un margen, ademas de implementar el componente que reci茅n mostramos y le enviamos una propiedad llamada `movie`
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
* Se importa `Dimensions`, para luego desestructurar la dimensi贸n del dispositivo, espec铆ficamente el ancho.
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
### 6.- FlatList de Pel铆culas
En este punto se mostrar谩 un listado de pel铆culas populares.

Pasos a Seguir:
* Se le agregan propiedades que recibir谩 el componente __MoviePoster__.
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
* Encerramos en un `View` con algunos estilos para identificar el tama帽o y agregamos un texto.
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
En este punto se crear谩 un componente que ser谩 llamado por __HomeScreen__, para mostrar los carruseles peque帽os.

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
* Creamos una nueva interface de las Props que recibir谩 nuestro nuevo componente.
````
interface Props{
  title?: string;
  movies: Movie[];
}
````
* Creamos nuestra componente __HorizontalSlider__, que rec铆be por parametros `title` y `movies` le pasamos la interface.
* En el return del componente tenemos el `View` con un estilo con condici贸n, en el caso de recibir el `title` se ver谩 en un tama帽o de 260 en el caso que no 220.
* Creamos otra condici贸n por si viene el titulo mostrarlo, esto lo hacemos con l贸gica booleana.
* Copiamos el mismo `<FlatList />` de la paso anterior, con la diferencia que le pasaremos en `data` la propiedad que rec铆be el componente `movies`.
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
* Finalmente invocamos el componente __HorizontalSlider__ para pasarle por argumento el `title` y `movies` de esta manera se encapsular el c贸digo que antes se tenia en un componente y luego invocarlo cuantas veces sea necesario. 
````
<HorizontalSlider title="En cine" movies={ peliculasEnCine } />
````
----
### 8.- M煤ltiples Peticiones Simultaneas
En este punto se crea varias peticiones a la API __The MovieDB__, para mostrar diferentes carruseles con las pel铆culas.

Paso a Seguir: 
* Se modifica el CustomHook __useMovies__, para realizar multiples peticiones hacia la API, y luego mandar la informaci贸n en un state.
* Se arregla la implementaci贸n de __useMovies__ en el componente __HomeScreen__.

En `hooks/useMovies.tsx`
* Se implemento una nueva interface para el useState nuevo que se usar谩.
````
interface MoviesState {
  nowPlaying: Movie[];
  popular: Movie[];
  topRated: Movie[];
  upcoming: Movie[];
}
````
* Se eliminan los anteriores useState, para agregar un nuevo state que maneje el contenido de la API.
* Se le asigna valores como un arreglo vac铆o para no tener problemas con el tipado.
````
const [moviesState, setMoviesState] = useState<MoviesState>({
  nowPlaying: [],
  popular: [],
  topRated: [],
  upcoming: [],
});
````
* Realizamos diferentes peticiones a la funci贸n `movieDB` que se conecta con la API, y le pasamos la ruta que se necesita.
* Para luego realizar un `Propise.all()` que traiga multiples promesas en un arreglo, esto dando un resultado as铆ncrono con todas las peticiones.
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
<HorizontalSlider title="M谩s Votados" movies={ topRated } />
<HorizontalSlider title="Pr贸ximamente" movies={ upcoming } />
````
----
### 9.- Navegar Pantalla Detalle
En este punto se crea el bot贸n que har谩 la navegaci贸n hacia el componente __DetailScreen__ y pasarle las propiedades.

Pasos a Seguir: 
* Agregamos tipado a la navegaci贸n hacia cada componente screen en __Navigation__.
* Se modifico el componente __MoviePoster__ para establecerlo como un bot贸n que realizar谩 la navegaci贸n hacia el componente __DetailScreen__ y pasarle los argumentos.
* Preparamos el componente para recibir las propiedades en __DetailScreen__.

En `navigation/Navigation.tsx`
* Agregue el tipado que recibir谩 los componentes screens.
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
* Cambiamos el return del componente por un `<TouchableOpacity>` y le agregamos las propiedades que se tenian anteriormente en el `View`, ademas de un `activeOpacity` y un `onPress` que har谩 la navegaci贸n hacia el otro componente __DetailScreen__, mandandole argumentos.
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
* Creamos una interface que nos ayudar谩 con el tipado en el componente.
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
### 10.- Dise帽o inicial de Detalles
En este punto se creo el dise帽o inicial que contar谩 el componente __DetailScreen__, iniciando con la imagen y su dise帽o.

Paso a Seguir:
* Ya que se tiene las propiedades necesarias para armar el componente, ahora comenzaremos aplicar dise帽o en `screens/DetailScreen.tsx`.

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
### 10,5.- Animaci贸n en Stack Navigation
Se le agrega una animaciones al momento de abrir el componente __DetailScreen__.

Pasos a Seguir:
* Se le agrega algunas propiedades adicionales al Stack Navigation en `navigation/Navigation.tsx`.

En `navigation/Navigation.tsx`
* En el stack navigation le agregamos algunas propiedades nuevas.
  * `gestureEnabled` esta propiedad por defecto android la tiene en false, esta vez la activamos para poder cerrar el stack de otra forma. (_Arrastrando el dedo de una esquina de la pantalla_)
  * `gestureDirection` en `vertical` permite cerrar el stack arrastrando el dedo por la esquina superior de la pantalla.
  * `cardStyleInterpolator` con este elemento podemos agregar animaciones, no olvidar importar `CardStyleInterpolators`, para tener las diferentes animaciones disponibles. (_[Animaciones aqu铆](https://reactnavigation.org/docs/stack-navigator/#cardstyleinterpolators)_)
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
En este punto se realizar谩 la implementaci贸n de un nuevo Custom Hook para mostrar el manejo del contenido que se mostrar谩 en el componente __DetialScreen__

Pasos a Seguir:
* Se implementa una nueva interface graicas a __[Quick Type](https://quicktype.io)__, extrayendo el contenido de la API y transformandola en una nueva interface que nos ayudar谩 con el tipado.
* Se crea el CustomHook __useMovieDetails__.

En `hooks/useMovieDetails.tsx`
* Se importan diferentes elementos como los hooks de react, `moveDB` para extraer el contenido de la API y `MovieFull` la nueva interface que se utilizar谩 para ayudar en el tipado.
````
import { useState, useEffect } from 'react';
import movieDB from '../api/movieDB';
import { MovieFull } from '../interface/movieInterface';
````
* Creamos una interface que tendr谩 el CustomHook.
````
interface MovieDetails {
    isLoading: boolean;
    movieFull: MovieFull;
    cast: any[];
}
````
* Se crea el CustomHook llamado __useMovieDetails__ que recibe por parametros `movieId`.
* Creamos un __useState__ que le agregamos la interface.
* Creamos la funci贸n `getMovieDetails` as铆ncrona, que recibir谩 el contenido de la API.
* Agregamos un __useEffect__ que disparar谩 la funci贸n reci茅n mencionada.
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
### 12.- Cargar Informaci贸n para DetailScreen
En este punto se realizar谩 la carga de informaci贸n necesaria para proximamente utilizarlo en el componente screen.

Pasos a Seguir:
* Se implementa una nueva interface del casting de los actores, para mostrar informaci贸n adicional, utilizando nuevamente __[Quick Type](https://quicktype.io)__ para la generaci贸n de tipado.
* Se crearon las diferentes promesas para la toma de informaci贸n necesaria para luego mostrarlo en el componente __DetailScreen__.
* Implementaci贸n del CustomHook __useMovieDetails__ en el componente __DetailScreen__.

En `hook/useMovieSceen.tsx`
* Modificamos la interface.
````
interface MovieDetails {
    isLoading: boolean;
    movieFull?: MovieFull;
    cast: Cast[];
}
````
* Inicializamos los valores del useState.
````
const [state, setState] = useState<MovieDetails>({
        isLoading: true,
        movieFull: undefined,
        cast: []
    });
````
* Modificamos la funci贸n `getMovieDetials`, para obtener 2 promesas agregandole el tipado correspondiente. (_interfaces_)
* Con `Promise.all()` obtenemos las 2 promesas a la vez y se lo entregamos al arreglo que creamos.
* Para luego entregar al useState los valores.
````
const getMovieDetials = async() => {

  const movieDetailsPromise = movieDB.get<MovieFull>(`/${ movieId }`);
  const castPromise = movieDB.get<CreditsResponse>(`/${ movieId }/credits`);

  const [ movieDetailsResp, castResp ] = await Promise.all([ movieDetailsPromise, castPromise]);

  setState({
      isLoading: false,
      movieFull: movieDetailsResp.data,
      cast: castResp.data.cast
  })
}
````
* Utilizamos el operador spread para retornar todos los elementos del state.
````
return {
  ...state
}
````
En `screens/DetailScreen.tsx`
* Ahora desestructuramos los valores que viene del CustomHook, ademas de entregarle por argumento el `movie.id`.
````
const { isLoading, cast, movieFull } = useMovieDetails( movie.id );
````
----
### 13.- Detalle de Pel铆culas
En este punto nos encontramos en la constucci贸n del dise帽o de como se mostrar谩n los elementos en el componente __DetailScreen__.

Pasos a Seguir: 
* Instalamos un formateador de numeros __[Currency Formatter](https://github.com/smirzaei/currency-formatter#readme)__
* Se construye un componente nuevo llamado __MovieDetails__ que mostrar谩 el contenido del componente screen __DetailScreen__.
* Le pasamos los argumentos que necesita __MovieDetails__.

En `components/MovieDetails.tsx`
* Importamos diferens elementos React, React Native, `currencyFormatter` para formatear los numeros, `Icon` para mostrar iconos y 2 elementos de tipado.
````
import React from 'react'
import { Text, View } from 'react-native';
import currencyFormatter from 'currency-formatter';


import Icon  from 'react-native-vector-icons/Ionicons';
import { MovieFull } from '../interface/movieInterface';
import { Cast } from '../interface/creditsInterface';
````
* Creamos la interface para las propiedades que recibir谩 el componente.
````
interface Props {
  movieFull: MovieFull;
  cast: Cast[];
}
````
* Creamos el componente llamado __MovieDetails__ que rec铆be 2 propiedades `movieFull` y `cast`.
````
export const MovieDetails = ({movieFull, cast}: Props) => {...}
````
* Se realiza la carpinteria de lo que se va a mostrar con los diferentes `View`.
  * Agregamos un icono con el `Text` de las votaciones, ademas realizamos un `.map()` para extraer todos los generos y mostrarlos.
  * Mostramos un titulo con la historia.
  * Finalmente mostramos el presupuesto con el formateo, gracias a `currencyFormatter`.
````
return (
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

      <Text style={{ fontSize: 23, marginTop: 10, fontWeight: 'bold', color:'black' }}>
          Historia
      </Text>
      <Text style={{ fontSize: 16 }}>
          { movieFull.overview }
      </Text>

      <Text style={{ fontSize: 23, marginTop: 10, fontWeight: 'bold', color:'black' }}>
          Presupuesto
      </Text>
      <Text style={{ fontSize: 18 }}>
          { currencyFormatter.format(movieFull.budget, { code:'USD'}) }
      </Text>

  </View>
)
````
En `screens/DetailScreen.tsx`
* Creamos una condici贸n, en el caso que `isLoading` se true mostrar谩 `<ActivityIndicator />` que es un indicador de carga, en el caso que este en false `isLoading` se mostrar谩 el contenido.
* El contenido se muestra gracias al nuevo componente agregado __MovieDetails__, el cual se le pasan los parametros que necesita.
````
{
  (isLoading) 
      ? <ActivityIndicator size={ 35 } color='grey' style={{ marginTop: 20 }}/>
      : <MovieDetails movieFull={ movieFull! } cast={ cast }/>
}
````
----
### 14.- Lista de Actores
En este punto se crear谩 una lista de actores que participaron en la pel铆cula, ademas de un bot贸n adicional.

Pasos a Seguir:
* Creamos un nuevo componente __CastItem__ que manejar谩 cada item que se mostrar谩.
* El componente __MovieDetails__ tendra que mostrar el componente __CastItem__ como una lista con `FlatList`.
* En el componente __DetailScreen__ agregamos una flecha para volver al antiguo componente.

En `components/CastItem.tsx`
* Importamos React, `Cast` para el tipado y elementos de __React Native__.
````
import React from 'react';
import { Cast } from '../interface/creditsInterface';
import { Text, View, Image, StyleSheet } from 'react-native';
````
* Creamos una interface que ser谩 para las propiedades del componente.
````
interface Props{
  actor: Cast;
}
````
* Se crea el componente __CastItem__ que recibe la propiedad `actor` con ayuda de la interface que rec铆en se creo para el tipado.
* Usamos el path para mostrar las imagenes de los actores. 
````
export const CastItem = ({ actor }: Props) => {

  const uri = `https://image.tmdb.org/t/p/w500${ actor.profile_path }`;
  ...
}
````
* Realizamos la construcci贸n del componente, creamos una condici贸n en el caso que `actor.profile_path` venga se mostrara la imagen.
* Mostramos el nombre del actor, ademas del personaje que interpreta con algunos estilos.
````
return (
  <View style={ styles.container }>
      {
          actor.profile_path && (
              <Image 
                  source={{ uri }}
                  style={{ width: 50, height: 50, borderRadius: 10}}
              />
          )
      }
      

      <View style={ styles.actorInfo }>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black'}}>
              { actor.name }
          </Text>
          <Text style={{ fontSize: 16, opacity: 0.5 , color: 'black'}}>
              { actor.character }
          </Text>
      </View>
  </View>
)
````
* Se agregaron algunos estilos con sombra y algunos margenes.
````
const styles = StyleSheet.create({
  container: {
      flexDirection: 'row',
      backgroundColor: 'white',
      borderRadius: 10,
      height: 50,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.24,
      shadowRadius: 7,

      elevation: 10,
      marginLeft: 20,
      paddingRight: 15,
  },
  actorInfo: {
      marginLeft: 10,
      marginTop: 3
  }
});
````
En `components/MovieDetails.tsx`
* Se le agrega un `View` dedicado a los actores, mostramos el texto y con el contenido con `<FlatList />`.
* Con el `<FlatList />` lo mostramos horizontalmente para que no emita un error ya que no tenemos un `<ScrollView>`, ademas de unos estilos y con el contenido que viene del componente __CastlItem__.
````
<View style={{ marginTop: 10, marginBottom: 100}}>
  <Text style={{ fontSize: 23, marginTop: 10, fontWeight: 'bold', color:'black', marginHorizontal: 20 }}>
      Actores
  </Text>

  <FlatList 
    data={ cast }
    keyExtractor={ (item) => item.id.toString() }
    renderItem={ ({ item }) => <CastItem actor={ item } />}
    horizontal={ true }
    showsHorizontalScrollIndicator={ false }
    style={{ marginTop: 10, height: 70 }}
  />
</View>
````
En `screen/DetailScreen.tsx`
* Se crea una flecha blanca que retorna al anterior componente.
````
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
````
----
### 15.- Gradiente Animado - ContextAPI
En este punto se usar谩n dos librerias una para el gradiente del color y otra para interpretar colores de una imagen.

Pasos a Seguir: 
* Instalar un __[Gradiante Lineal](https://github.com/react-native-linear-gradient/react-native-linear-gradient)__.
* Instalar un interpretador de __[Colores de Imagen](https://github.com/osamaqarem/react-native-image-colors)__.
* Crear CustomHook para manejar la animaci贸n y agregarle fundiones que aumenta y disminuyen la opacidad en `hooks/useFade.tsx`.
* Creamos un contexto para luego manejar dos estado globales de colores en la aplicaci贸n en `context/GradientContext.tsx`.
* Se aplica en el componente mas alto de la aplicaci贸n el contexto nuevo, para manejarlo en toda la aplicaci贸n `App.tsx`.
* Se crea un helper, que gracias a la instalaci贸n de una libreria, obtener colores en base una imagen.
* Se crea un componente nuevo que realiza el gradiente segun lo que reciba en el contexto global, este se aloja en `components/GradientBackground.tsx`.
* En el componente __HomeScreen__ creamos una nueva funci贸n que manda el URI de la imagen que esta seleccionada en el carrusel.

En `hooks/useFade.tsx`
* Importamos el useRef de react y Animated de react native.
````
import { useRef } from 'react'
import { Animated } from 'react-native';
````
* Creamos el CustomHook llamado __useFade__.
* Utilizamos useRef para crear un nuevo valor para la animaci贸n, en este caso manejaremos el valor de opacidad en 0.
* Creamos una funci贸n llamada `fadeIn` que puede recibir un `callback` en las propiedades, y maneja la opacidad.
  * Con `Animated.timing` creamos una animaci贸n, que su valor sera 1, con duraci贸n y sera acelarado por hardware con `useNativeDriver`.
  * Lo iniciamos con `start()` que tambien puede recibir un `callback` en sus argumentos o null.
* Se crea una funci贸n llamada `fadeOut` que puede recibir una propiedad llamada `duration` que su valor por defecto es de 300 y maneja la opacidad.
  * Su valor es 0, la duraci贸n puede ser recibida por las propiedades y aceleraci贸n por hardware.
  * Esta es iniciada cuando es llamada la funci贸n, graicas a `.start()`.
* Finalmente retornamos la `opacity` y las dos funci贸nes.
````
export const useFade = () => {

    const opacity = useRef( new Animated.Value(0) ).current;

    const fadeIn = ( callback?: Function ) => {
  
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }
      ).start( () => callback ? callback() : null );
    }
  
    const fadeOut = ( duration: number = 300) => {
      Animated.timing(
        opacity,
        {
          toValue: 0,
          duration,
          useNativeDriver: true
        }
      ).start();
    }

  return {
    opacity, 
    fadeIn,
    fadeOut
  }
}
````
En `context/GradientContext.tsx`
* Se importa react, la creaci贸n del context y un useState.
````
import React, { createContext, useState } from 'react';
````
* Se crea la primera interface que seran los valores que manejaran los __useState__.
````
interface ImageColors {
  primary: string;
  secondary: string;
}
````
* La segunda interface es del context, el cual retornar谩 los dos estados y ademas 2 funciones.
````
interface ContextProps {
  colors: ImageColors;
  prevColors: ImageColors;
  setMainColors: (colors: ImageColors) => void;
  setPrevMainColors: (colors: ImageColors) => void;
}
````
* Creamos el context y le agregamos el tipado de la interface.
````
export const GradientContext = createContext({} as ContextProps);
````
* Creamos el componente proveedor llamado __GradientProvider__ que por propiedad tendra los `children`.
* El primer __useState__ con los valores `[colors, setColors]` manejar谩 la animaci贸n en la aplicaci贸n, recibiran los colores y luego se le aplicar谩 una opacidad.
* El segundo __useState__ ser谩 el color que se demorar谩 en aparecer pero se mantendra permanentemente, sin ninguna opacidad.
* Se crean 2 funci贸nes que modifican los dos estados reci茅n mencionados.
* Finalmente se retorna el context con sus valores que fueron tipados con la segunda interface mostrada, ademas de retornar los `{ children }` para que se muestren los elementos hijos.
````
export const GradientProvider = ({ children }:any) => {

    const [colors, setColors] = useState<ImageColors>({
        primary: 'transparent',
        secondary: 'transparent'
    });

    const [prevColors, setPrevColors] = useState<ImageColors>({
        primary: 'transparent',
        secondary: 'transparent'
    });

    const setMainColors = (colors: ImageColors) => {
        setColors( colors );
    }

    const setPrevMainColors = (colors: ImageColors) => {
        setPrevColors( colors );
    }

    return(
        <GradientContext.Provider value={{
            colors,
            prevColors,
            setMainColors,
            setPrevMainColors
        }}>
            { children }
        </GradientContext.Provider>
    )
}
````
En `App.tsx`
* Importamos el componente proveedor __GradientProvider__.
````
...
import { GradientProvider } from './src/context/GradientContext';
````
* Se crea un componente llamado __AppState__ que tiene en las propiedades `{ children }`.
* Este componente retornar谩 el componente proveedor con su `children`.
````
const AppState = ({ children }: any) => {

  return (
    <GradientProvider>
      { children }
    </GradientProvider>
  )
} 
````
* Finalmente en el componente mas alto agregamos el __AppState__ que envolvera toda la aplicaci贸n, de esta manera tener un context global.
````
const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <Navigation />
      </AppState>
    </NavigationContainer>
  )
}
````
En `helpers/getColores.tsx`
* Gracias a la instalaci贸n de una libreria que nos permite obtener los colores de una imagen, la importamos esta vez `ImageColors`.
````
import ImageColors from 'react-native-image-colors';
````
* Segun la documentaci贸n creamos una funci贸n as铆ncrona que recibir谩 el `uri` a traves de las propiedades.
* Utilizamos `ImageColors.getColors()` con el `await` para mandarle el `uri` de las propiedades y un objeto vac铆o, para almacenar esto en una constante.
* Creamos 2 variables.
* Luego sacamos el switch de la libreria, que detecta que dispositivo se esta corriendo la aplicaci贸n, para luego extraer los colores y los almacenamos en las variables creadas.
* Finalmente retornamos esas dos variables como un arreglo.
````
export const getImageColores = async( uri: string ) => {

 const colors = await ImageColors.getColors(uri, {});

  let primary;
  let secondary;

  switch (colors.platform) {
    case 'android':
      primary = colors.dominant;
      secondary = colors.average;
      break
    
    case 'ios':
      primary = colors.primary;
      secondary = colors.secondary;
      break

    default:
      throw new Error('Unexpected platform key')
  }

  return [primary, secondary]
}
````
En `components/GradientBackground.tsx`
* Importamos multiples elementos que se utilizaran.
  * React y 2 hooks.
  * Animated para realizar la animaci贸n y otros elementos de react native.
  * `LinearGradient` de la libreria para realizar gradientes.
  * `GradientContext` importamos el contexto.
  * CustomHook que se creo para las animaciones __useFade__.
````
import React, { useContext, useEffect } from 'react'
import { Animated, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GradientContext } from '../context/GradientContext';
import { useFade } from '../hooks/useFade';
````
* Creamos una interface para el componente.
````
interface Props{
  children: JSX.Element | JSX.Element[]
}
````
* Creamos el componente __GradientBackground__ que por las propiedades tiene sus `{ children }` y se utiliza la interface que se menciono anteriormente.
````
export const GradientBackground = ({ children }: Props) => { ... }
````
* Se implementa el useContext para utilizar el contexto `GradientContext` que recibiremos algunos elementos de este.
* Implementamos el CustomHook __useFade__ recibiendo 2 de sus funciones y `opacity`.
* Implementamos un __useEffect__ que tiene la funci贸n `fadeIn()` que le pasamos por argumento un `callback` que se activar谩, pasandole al `setPrevMainColors()` el `colors` que ten铆a un color y esto hace que adquiera el mismo color el estado `prevColors`, para luego activar la funci贸n `fadeOut(0)` que es agregar la opacidad en 0 ms.
* Finalmente el useEffect tiene una dependencia que es el `colors`.
````
const { colors, prevColors, setPrevMainColors } = useContext(GradientContext);
const { opacity, fadeIn, fadeOut } = useFade();

useEffect(() => {
  fadeIn( () => {
    setPrevMainColors( colors );
    fadeOut(0);
  })

}, [ colors ])
````
* En el return del componente tenemos un View que abarca todo gracias a `flex` en 1.
* Tenemos un `<LinearGradient />` que es el color que se agrega despues del que esta en `<Animated.View>` pero permanece permanentemente hasta que se cambie.
* Se crea un `<Animated.View>` que realizar谩 la animaci贸n, con el valor de la opacidad para agregar y desagregar opacidad con las funciones `fadeIn` y `fadeOut`.
* Encerrado dentro de la animacion esta otro `<LinearGradient />` que mostrar谩 primero los colores cada vez que los detecte y gracias a la animaci贸n se vera de una forma mas agradable apareciendo el color.
* Finalmente mostramos en el componente los `{ children }`.
````
return (
  <View style={{ flex:1 }}>
      <LinearGradient 
          colors={[ prevColors.primary , prevColors.secondary ,'white' ]}
          style={{...StyleSheet.absoluteFillObject}}
          start={{ x: 0.1, y:0.1 }}
          end={{ x: 0.5, y: 0.7}}
      />

      <Animated.View
        style= {{
          ...StyleSheet.absoluteFillObject,
          opacity
        }}
      >
        <LinearGradient 
          colors={[ colors.primary , colors.secondary ,'white' ]}
          style={{...StyleSheet.absoluteFillObject}}
          start={{ x: 0.1, y:0.1 }}
          end={{ x: 0.5, y: 0.7}}
      />
      </Animated.View>

      { children }
  </View>
)
````
En `screens/HomeScreen.tsx`
* Se importa el contexto ademas del hook, para establecer el context y traer la funci贸n `setMainColors`.
````
const { setMainColors } = useContext(GradientContext);
````
* Creamos la funci贸n `getPosterColors` as铆ncrona, recibiendo por parametros `index` (_esta funci贸n sera ejecutanda en el carrusel_).
* Conseguimos la posici贸n de la pel铆cula que esta activa en el carrusel y la almacenamos en la constante `movie`.
* Luego en el path le agregamos `movie.poster_path` para sacar el __uri__ exacta de la imagen y almacenarla en una constante.
* Una vez importada la funci贸n `getImageColores` que obtiene el color de las imagenes, le mandamos por argumento el `uri` con un await, esperando el valor del arreglo que retorna `[primary, secondary]`.
* Finalmente se los pasamos a la funci贸n que modifica el estado del context `setMainColors()`.
````
const getPosterColors = async( index: number ) => {
  const movie = nowPlaying[index];
  const uri = `https://image.tmdb.org/t/p/w500${ movie.poster_path }`;

  const [primary = 'transparent', secondary = 'transparent'] = await getImageColores( uri );
  setMainColors({ primary, secondary})
}
````
* Importamos el useEffect para utilizarlo, que tiene como dependencia los cambios de `nowPlaying`.
* Realizamos una condici贸n si el largo de `nowPlaying` es mayor a 0, se ejecuta la funci贸n `getPosterColors()` en la posici贸n 0, esto quiere decir el primer poster del carrusel.
````
useEffect(() => {
  if( nowPlaying.length > 0){
    getPosterColors(0)
  }

}, [ nowPlaying ])
````
* Encerramos todo el contenido del componente __HomeScreen__ en el componente __GradientBackground__ que se importo y realiza el gradiente.
````
return (
  <GradientBackground> 
  ...
  </GradientBackground> 
)
````
* Finalmente dentro del return del componente __HomeScreen__ espec铆ficamente en el `<Carousel>` se implementa `onSnapToItem` esto da la posici贸n del carrusel ejecutando la funci贸n `getPosterColors()` cada vez que el carrusel se mueve a un nuevo poster.
````
<Carousel 
  data={ nowPlaying }
  renderItem={ ({ item }: any) => <MoviePoster movie={ item }/> }
  sliderWidth={ windowWidth }
  itemWidth={ 300 }
  inactiveSlideOpacity={ 0.9 }
  onSnapToItem={ index => getPosterColors( index ) }
/>
````
----