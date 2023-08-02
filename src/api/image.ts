import { fetch } from './fetch'

export const getImageList = (data: { userId?: string, phone?: string }) => {
  return fetch.get('/api_editimg/liststock', data);
}
