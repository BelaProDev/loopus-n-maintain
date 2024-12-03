import { query as q } from 'faunadb';
import { client } from './client';
import type { WhatsAppNumbers } from '@/types/dropbox';

export const updateWhatsAppNumbers = async (numbers: WhatsAppNumbers) => {
  const result = await client.query(
    q.Update(
      q.Select(
        ['ref'],
        q.Get(q.Match(q.Index('whatsapp_numbers_by_id'), numbers.id))
      ),
      {
        data: {
          name: numbers.name,
          number: numbers.number,
          primary: numbers.primary,
          secondary: numbers.secondary
        }
      }
    )
  );
  return result;
};

export const createWhatsAppNumber = async (numbers: WhatsAppNumbers) => {
  const result = await client.query(
    q.Create(
      q.Collection('whatsapp_numbers'),
      {
        data: {
          name: numbers.name,
          number: numbers.number,
          primary: numbers.primary,
          secondary: numbers.secondary
        }
      }
    )
  );
  return result;
};

export const deleteWhatsAppNumber = async (id: string) => {
  const result = await client.query(
    q.Delete(
      q.Select(
        ['ref'],
        q.Get(q.Match(q.Index('whatsapp_numbers_by_id'), id))
      )
    )
  );
  return result;
};

export const getWhatsAppNumbers = async () => {
  const result = await client.query(
    q.Paginate(q.Documents(q.Collection('whatsapp_numbers')))
  );
  return result.data;
};
