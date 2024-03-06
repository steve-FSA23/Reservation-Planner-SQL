const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(
    process.env.DATABASE_URL || "postgres://localhost/acme_reservation_planner"
);

const createTables = async () => {
    const SQL = `
    DROP TABLE IF EXISTS reservation;
    DROP TABLE IF EXISTS restaurant;
    DROP TABLE IF EXISTS customer;

    CREATE TABLE customer(
        id UUID PRIMARY KEY,
        name VARCHAR(100)
    );
    CREATE TABLE restaurant(
        id UUID PRIMARY KEY,
        name VARCHAR(100)
    );
    CREATE TABLE reservation(
        id UUID PRIMARY KEY,
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurant(id) NOT NULL,
        customer_id UUID REFERENCES customer(id) NOT NULL
    );
    `;
    await client.query(SQL);
};

const createCustomer = async (name) => {
    const SQL = `
    INSERT INTO customer(id, name) VALUES($1, $2) RETURNING *
    `;

    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
};

const createRestaurant = async (name) => {
    const SQL = `
    INSERT INTO restaurant(id, name) VALUES($1, $2) RETURNING *
    `;

    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
};

const createReservation = async ({
    customer_id,
    party_count,
    restaurant_id,
    date,
}) => {
    const SQL = `
    INSERT INTO reservation(id, customer_id, party_count, restaurant_id, date) VALUES($1,$2,$3,$4,$5)
    `;
    const response = await client.query(SQL, [
        uuid.v4(),
        customer_id,
        party_count,
        restaurant_id,
        date,
    ]);
    return response.rows[0];
};

const fetchCustomers = async () => {
    const SQL = `
    SELECT * FROM customer;
    `;
    const response = await client.query(SQL);

    return response.rows;
};

const fetchRestaurants = async () => {
    const SQL = `
    SELECT * FROM restaurant;
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchReservations = async () => {
    const SQL = `
    SELECT * FROM reservation;
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const destroyReservation = async (reservationId) => {
    const SQL = `
    DELETE FROM reservation WHERE id = $1
    `;
    await client.query(SQL, [reservationId]);
};

module.exports = {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    createReservation,
    fetchCustomers,
    fetchRestaurants,
    fetchReservations,
    destroyReservation,
};
