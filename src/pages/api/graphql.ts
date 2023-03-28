import { NextApiRequest, NextApiResponse } from 'next';

import { getServerClient } from '../../graphql/server';
import { MutationOptions, QueryOptions } from '../../graphql/utils';

const isQueryRequest = (body: unknown): body is QueryOptions => {
  return typeof body === 'object' && body !== null && 'query' in body;
};

const isMutationRequest = (body: unknown): body is MutationOptions => {
  return typeof body === 'object' && body !== null && 'mutation' in body;
};

export default async function graphqlHandler(req: NextApiRequest, res: NextApiResponse) {
  if (typeof req.method !== 'string') {
    return res.status(405).send(`No request method provided`);
  }

  if (req.method !== 'POST') {
    return res.status(405).send(`Method ${req.method} not allowed`);
  }

  const body: unknown = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const client = getServerClient();

  if (isQueryRequest(body)) {
    const response = await client.query(body);

    return res.status(200).send(response);
  }

  if (isMutationRequest(body)) {
    const response = await client.mutate(body);

    return res.status(200).send(response);
  }

  return res.status(400).send(`Request body is invalid ${JSON.stringify(body)}`);
}