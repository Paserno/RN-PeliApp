import axios from 'axios';

const movieDB = axios.create({
    baseURL: 'https://api.themoviedb.org/3/movie',
    params: {
        api_key: '62468e296a9bc7506aff416d967718a7',
        language: 'es-ES',
    }
})


export default movieDB;