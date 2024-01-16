import type { NextApiRequest, NextApiResponse } from 'next'

export type User = {
  id: number | null
  fullName: string
  profile: string
  email: string
}
 
type ResponseData = {
  data: User
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({
    data: {
      id: 1,
      fullName: 'Dwight Schrute',
      profile: 'https://pbs.twimg.com/media/DT3UWsDWkAEX7DM.jpg',
      email: 'assistant2themanager@dundermifflin.co'
    }
  })
}
