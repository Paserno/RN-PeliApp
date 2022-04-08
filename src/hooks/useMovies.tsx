import { useEffect, useState } from 'react';
import movieDB from '../api/movieDB';
import { MovieDBNowPlaying, Movie } from '../interface/movieInterface';

export const useMovies = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [peliculasEnCine, setPeliculasEnCine] = useState<Movie[]>([])

    const getMovie = async() => {
        
        const resp = await movieDB.get<MovieDBNowPlaying>('/now_playing');
        setPeliculasEnCine(resp.data.results);
        
        setIsLoading( false );
    }
    
    useEffect(() => {
        //Now_playing
        getMovie();
        
        
      }, [])

  return {
    peliculasEnCine,
    isLoading
  }
}
