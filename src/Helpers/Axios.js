import axios from 'axios';

const instance = axios.create({baseURL: "http://atulbibackend.herokuapp.com/"});
instance.defaults.headers.common['Authorization'] = "BEARER " + process.env.REACT_APP_SECRET_KEY;

export default instance;