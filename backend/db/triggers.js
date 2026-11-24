import { pool } from "./dbConfig.js";

export async function createTriggers() {
  const client = await pool.connect();

  try {
    // FUNCTION update updated_at =================================================================================
    await client.query(`
        CREATE OR REPLACE FUNCTION update_updated_at()
        RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
        $$ LANGUAGE plpgsql;
    `);

    // customers
    await client.query(`
        CREATE TRIGGER update_customers_updated_at
            BEFORE UPDATE ON customers
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at();
    `);

    // addresses
    await client.query(`
        CREATE TRIGGER update_addresses_updated_at
            BEFORE UPDATE ON addresses
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at();
    `);

    // categories
    await client.query(`
        CREATE TRIGGER update_categories_updated_at
            BEFORE UPDATE ON categories
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at();
    `);

    // brands
    await client.query(`
        CREATE TRIGGER update_brands_updated_at
            BEFORE UPDATE ON brands
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at();
    `);

    // products
    await client.query(`
        CREATE TRIGGER update_products_updated_at
            BEFORE UPDATE ON products
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at();
    `);

    // products_variants
    await client.query(`
        CREATE TRIGGER update_products_variants_updated_at
            BEFORE UPDATE ON products_variants
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at();
    `);

    // attributes_definitions
    await client.query(`
        CREATE TRIGGER update_attributes_definitions_updated_at
            BEFORE UPDATE ON attributes_definitions
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at();
    `);

    // carts
    await client.query(`
        CREATE TRIGGER update_carts_updated_at
            BEFORE UPDATE ON carts
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at();
    `);

    // carts_items
    await client.query(`
        CREATE TRIGGER update_carts_items_updated_at
            BEFORE UPDATE ON carts_items
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at();
    `);

    // orders
    await client.query(`
        CREATE TRIGGER update_orders_updated_at
            BEFORE UPDATE ON orders
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at();
    `);

    // payments
    await client.query(`
        CREATE TRIGGER update_payments_updated_at
            BEFORE UPDATE ON payments
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at();
    `);
    // ============================================================================================================
  } catch (err) {
    console.error("Creating triggers failed.", err.stack);
  } finally {
    client.release();
    pool.end();
  }
}
