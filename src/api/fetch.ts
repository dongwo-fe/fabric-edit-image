import { QF } from '@dm/http_request'

function CreateFetch(prePath:string) {
  return new QF(prePath)
}

export const fetch = CreateFetch('')
export const CreateOpsWebApp = () => CreateFetch('/easyhome-ops-web-application')
const acFetch = CreateFetch('')
acFetch.code = 1
export {acFetch}
