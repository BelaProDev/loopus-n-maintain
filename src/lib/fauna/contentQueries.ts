import { query as q } from 'faunadb';
import { client } from './client';
import type { ContentData } from '@/types/dropbox';

export const createContent = async (data: ContentData) => {
  const result = await client.query(
    q.Create(
      q.Collection('content'),
      { 
        data: {
          title: data.title,
          content: data.content,
          key: data.key,
          language: data.language,
          id: data.id
        } 
      }
    )
  );
  return result;
};

export const getContentByKey = async (key: string) => {
  const result = await client.query(
    q.Get(
      q.Match(q.Index('content_by_key'), key)
    )
  );
  return result;
};

export const updateContentById = async (id: string, data: Partial<ContentData>) => {
  const result = await client.query(
    q.Update(
      q.Ref(q.Collection('content'), id),
      { data }
    )
  );
  return result;
};

export const deleteContentById = async (id: string) => {
  const result = await client.query(
    q.Delete(q.Ref(q.Collection('content'), id))
  );
  return result;
};
