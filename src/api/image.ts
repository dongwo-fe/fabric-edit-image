import { fetch, acFetch } from './fetch'

export const getImageList = (data: { userId?: string, phone?: string }) => {
  return fetch.get('/api_editimg/liststock', data);
}

// 上传图片
export const postUploadImage = (file: any) => {
  const form = new FormData();
  form.append('file', file);
  return acFetch.post_heads('/api_image/upload', form);
}

// add image
export const addImageApi = (data: any) => {
  return fetch.post('/api_editimg/addstock', data);
}

// save
export const saveHistory = (data: any) => {
  return fetch.post('/api_editimg/save', data);
}

// delete
export const delstock = (data: any) => {
  return fetch.get('/api_editimg/delstock', data);
}

export const getDetail = (data:any) => {
  return fetch.get('/api_editimg/detail', data);
}

