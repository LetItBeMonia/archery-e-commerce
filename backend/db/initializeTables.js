// TODO: trigger updating updated_at fields
import { pool } from "./dbConfig.js";

export async function initializeTables() {
  const client = await pool.connect();
  console.log("Database connection established.");

  try {
    // customer related tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          surname VARCHAR(255),
          phone_number VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS addresses (
          id SERIAL PRIMARY KEY,
          customer_id INT REFERENCES customers(id) NOT NULL,
          country VARCHAR(255),
          state VARCHAR(255),
          city VARCHAR(255),
          street VARCHAR(255),
          building_number VARCHAR(255),
          apartment_number VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // products categories
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          parent_category_id INT REFERENCES categories(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // product related tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS brands (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          images JSONB,
          brand_id INT REFERENCES brands(id) NOT NULL,
          category_id INT REFERENCES categories(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS products_variants (
          id SERIAL PRIMARY KEY,
          product_id INT REFERENCES products(id) NOT NULL,
          sku VARCHAR(255) NOT NULL UNIQUE,
          price numeric(7,2) NOT NULL CHECK (price >= 0),
          stock_quantity INT NOT NULL CHECK (stock_quantity >= 0),
          color VARCHAR(255),
          material VARCHAR(255),
          attributes JSONB,
          default_display BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TYPE data_type AS ENUM ('short_text', 'integer', 'float', 'boolean');
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS attributes_definitions (
          id SERIAL PRIMARY KEY,
          category_id INT REFERENCES categories(id) NOT NULL,
          name VARCHAR(255) NOT NULL,
          data_type data_type NOT NULL,
          unit VARCHAR(255),
          is_filterable BOOLEAN NOT NULL,
          is_required BOOLEAN NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // shopping cart related tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS carts (
          id SERIAL PRIMARY KEY,
          customer_id INT REFERENCES customers(id) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS carts_items (
          id SERIAL PRIMARY KEY,
          cart_id INT REFERENCES carts(id) NOT NULL,
          quantity INT NOT NULL CHECK (quantity > 0),
          product_variant_id INT REFERENCES products_variants(id) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // order related tables
    await client.query(`
      CREATE TYPE order_status AS ENUM ('placed', 'in preparation', 'sent', 'delivered', 'received');
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          customer_id INT REFERENCES customers(id) NOT NULL,
          shipping_address_id INT REFERENCES addresses(id) NOT NULL,
          total_amount numeric(10,2) NOT NULL CHECK (total_amount >= 0),
          status order_status NOT NULL,
          shipped_date TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          product_variant_id INT REFERENCES products_variants(id) NOT NULL,
          order_id INT REFERENCES orders(id) NOT NULL,
          unit_price numeric(7,2) NOT NULL CHECK (unit_price >= 0),
          quantity INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'recorded');
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
          id SERIAL PRIMARY KEY,
          order_id INT REFERENCES orders(id) NOT NULL,
          method VARCHAR(255) NOT NULL,
          amount numeric(10,2) NOT NULL CHECK (amount >= 0),
          payment_status payment_status NOT NULL,
          payment_date TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.error("Database initialization failed.", err.stack);
  } finally {
    client.release();
    pool.end();
  }
}
