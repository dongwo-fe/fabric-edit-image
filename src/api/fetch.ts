import axios from 'axios';

const request = axios.create({
  baseURL: ''
})


request.interceptors.response.use((response) => {
  if (response.data.code === '200') {
    return response.data.data;
  }
  return response;
}, error => {
  console.log(error);
})

export const fetch = {
  get: (url: string, params: any) => {
    return request.get(url, {params});
  },
  post: (url: string, data: any) => {
    return request.post(url, data)
  }
}
