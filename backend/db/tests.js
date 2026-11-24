import { pool } from "./dbConfig.js";

export async function testQueries() {
  const client = await pool.connect();

  try {
    // await client.query(`
    //     INSERT INTO customers (email,password)
    //     VALUES('cos@gmail.com', '123456789');
    // `);

    // await client.query(`
    //     UPDATE customers
    //     SET surname='Zadek'
    //     WHERE id=1;
    // `);

    console.log("Row updated.");
  } catch (err) {
    console.error("Insert failed.", err.stack);
  } finally {
    client.release();
    pool.end();
  }
}
