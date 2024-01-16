import { NextApiRequest, NextApiResponse } from 'next';

export type Beet = {
    id: number;
    name: string;
}

export default function handler (req: NextApiRequest, res: NextApiResponse<{ beets: Beet[] }>) {
  res.status(200).json({
    beets: [
      { id: 1, name: 'Red Beet' },
      { id: 2, name: 'Golden Beet' },
      { id: 3, name: 'Chioggia Beet' },
      { id: 4, name: 'Cylindra Beet' },
      { id: 5, name: 'White Beet' }
    ]
  })
}