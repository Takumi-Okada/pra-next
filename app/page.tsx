// "use client";

import { getServerSession } from "next-auth";
import Book from "./components/Book"
import { getAllBooks } from "./lib/microcms/client";
import { BookType, Purchase, User } from "./types/types";
import { nextAuthOptions } from "./lib/next-auth/options";

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;
  const { contents } = await getAllBooks();

  let purchasedIds: Array<string>;

  // console.log(contents);
  if (user) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`
    );
    const purchasesData = await response.json();
     
    purchasedIds = purchasesData.map(
      (purchase: Purchase) => purchase.bookId
    );
    console.log(purchasedIds);
  }

  return (
    <>
      <main className="flex flex-wrap justify-center items-center md:mt-32 mt-20">
        <h2 className="text-center w-full font-bold text-3xl mb-2">
          Book Commerce
        </h2>
        {contents.map((book: BookType) => (
          <Book key={book.id} book={book} isPurchhased={purchasedIds?.includes(book.id)} />
        ))}
      </main>
    </>
  );
}