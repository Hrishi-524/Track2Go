import axios from 'axios'

const setupAxiosInterceptors = () => {
    // Set base URL for axios
    axios.defaults.baseURL = 'http://localhost:3000/api'
    console.log(`Base axios URL set : ${axios.defaults.baseURL}`)
  
    // Request interceptor to add token to headers
    axios.interceptors.request.use(
        //onRequestSuccess
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        //onRequestFaliure
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor to handle token expiration
    axios.interceptors.response.use(
        //onResponseSuccess
        (response) => response,
        //onResponseFaliure
        (error) => {
            if (error.response?.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                // Redirect to login page
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
};

export default setupAxiosInterceptors