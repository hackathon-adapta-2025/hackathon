import { NextResponse } from 'next/server'

const withCors = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', '*') // ou defina seu domínio
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )
  return response
}

export { withCors }
