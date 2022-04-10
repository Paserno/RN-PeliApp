import { useState, useEffect } from 'react';
import movieDB from '../api/movieDB';
import { MovieFull } from '../interface/movieInterface';
import { CreditsResponse, Cast } from '../interface/creditsInterface';

interface MovieDetails {
    isLoading: boolean;
    movieFull?: MovieFull;
    cast: Cast[];
}

export const useMovieDetails = ( movieId: number ) => {
  
    const [state, setState] = useState<MovieDetails>({
        isLoading: true,
        movieFull: undefined,
        cast: []
    });

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

    useEffect(() => {
      
        getMovieDetials();

    }, [])
    
    return {
        ...state
    }
}
