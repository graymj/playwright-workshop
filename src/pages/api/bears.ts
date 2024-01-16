import { NextApiRequest, NextApiResponse } from 'next';

export type Bear = {
    id: number;
    name: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<{ bears: Bear[] }>) {
  res.status(200).json({
    bears: [
      { id: 1, name: 'Black Bear' },
      { id: 2, name: 'Brown Bear' },
      { id: 3, name: 'Polar Bear' },
      { id: 4, name: 'Sloth Bear' },
      { id: 5, name: 'Spectacled Bear' }
    ]
  })
}