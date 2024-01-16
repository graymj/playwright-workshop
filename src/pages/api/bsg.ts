import { NextApiRequest, NextApiResponse } from 'next';

export type BSGCharacters = {
    id: number;
    name: string;
}

export default function handler (req: NextApiRequest, res: NextApiResponse<{ data: BSGCharacters[] }>) {
  res.status(200).json({
    data: [
      { id: 1, name: 'William Adama' },
      { id: 2, name: 'Laura Roslin' },
      { id: 3, name: 'Kara Thrace' },
      { id: 4, name: 'Gaius Baltar' },
      { id: 5, name: 'Number Six' },
    ]
  })
}
