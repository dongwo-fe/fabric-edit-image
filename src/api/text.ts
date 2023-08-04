import { acFetch } from './fetch'

export const dynamicModify = () => {
  return acFetch.post('/api_font/api/fontConfig/dynamicModify');
}

export const getFontManage = () => {
  return acFetch.get('/api_font/api/fontManage/all');
}
