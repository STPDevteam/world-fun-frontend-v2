export const request = (url: string, config: any) => {
  return fetch(url, { ...config, headers: {...config.headers} })
    .then((res: any) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
      }

      return res.json()
    })
    .then((resJson: any) => {
      return resJson
    })
    .catch((error: any) => {
      console.error('internal')
    })
}


export const get = (url: string, config?: any) => {
  return request(url, config ? {...config, Address: localStorage.getItem('Address')} :{ method: 'GET' })
}

export const getWithPrams = (url: string, data?:any ) => {
  return request(url, { 
    headers: data,
    method: 'GET' 
  })
}

export const post = (url: string, data: any) => {
  return request(url, {
    body: data instanceof FormData ? data : JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST'
  })
}

export const put = (url: string, data: any) => {
  return request(url, {
    body: data instanceof FormData ? data : JSON.stringify(data),
    headers: {
    },
    method: 'PUT'
  })
}
