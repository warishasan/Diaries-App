import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';


const http: AxiosInstance = axios.create({
  baseURL: 'https://diaries.app',
});

http.defaults.headers.post['Content-Type'] = 'application/json';

http.interceptors.response.use(
  async (response: AxiosResponse) => {
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
  },
  (error: AxiosError) => {
    

    //if (response) {
      /*
      if (response.status >= 400 && response.status < 500) {
        showAlert(response.data?.data?.message, 'error');
        
      }
    } else if (request) {
      showAlert('Request failed. Please try again.', 'error');
    }
    */
    return Promise.reject(error);
   
  }
);

export default http;