import { BookType } from '@/app/types/types';
import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!, 
  apiKey: process.env.MICROCMS_API_KEY!,
});

export const getAllBooks = async () => {
    const allBooks = await client.getList<BookType>({
        endpoint: "bookcommerce"
    })

    return allBooks;
}

export const getDetailBook = async (contentId: string) => {
  const detailBook = await client.getListDetail<BookType>({
    endpoint: "bookcommerce",
    contentId
  });

  return detailBook;
}