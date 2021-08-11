import axios from 'axios';
import { CONSTANTS } from './constants';
// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONSTANTS.serverURL });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
