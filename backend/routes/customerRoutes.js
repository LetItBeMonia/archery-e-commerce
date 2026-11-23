import app from "../server";

// Insert a single book record
// await client.query(
//   "INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4);",
//   ["The Catcher in the Rye", "J.D. Salinger", 1951, true],
// );
// console.log("Inserted a single book.");

// Data to be inserted
// const booksToInsert = [
//   {
//     title: "The Hobbit",
//     author: "J.R.R. Tolkien",
//     year: 1937,
//     in_stock: true,
//   },
//   { title: "1984", author: "George Orwell", year: 1949, in_stock: true },
//   { title: "Dune", author: "Frank Herbert", year: 1965, in_stock: false },
// ];

// Insert multiple books
// for (const book of booksToInsert) {
//   await client.query(
//     "INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4);",
//     [book.title, book.author, book.year, book.in_stock],
//   );
// }
// console.log("Inserted 3 rows of data.");
