import { QF } from '@dm/http_request';

function CreateFetch(prePath:string) {
  return new QF(prePath);
}

export const fetch = CreateFetch('')
