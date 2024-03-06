const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    createReservation,
    fetchCustomers,
    fetchRestaurants,
    fetchReservations,
    destroyReservation,
} = require("./db");

const express = require("express");
const routes = require("./routes");
const app = express();

app.use(express.json());
app.use(require("morgan")("dev"));
app.use("/api", routes);

const PORT = process.env.PORT || 3000;

const init = async () => {
    try {
        await client.connect();
        console.log("Connected to database!");

        await createTables();
        console.log("Tables Created 📊!");

        const [
            steve,
            gio,
            yandiel,
            yvelis,

            steakHouse,
            oliveGardens,
            romeItaly,
            cheesecakeFactory,
        ] = await Promise.all([
            createCustomer("Steve"),
            createCustomer("Gio"),
            createCustomer("Yandiel"),
            createCustomer("Yvelis"),

            createRestaurant("Steak House"),
            createRestaurant("Olive Gardens"),
            createRestaurant("Rome Pizza"),
            createRestaurant("Cheesecake Factory"),
        ]);

        console.log(`Steve has an id of ${steve.id}`);

        console.log(await fetchCustomers());
        console.log(await fetchRestaurants());

        await Promise.all([
            createReservation({
                customer_id: gio.id,
                party_count: 4,
                restaurant_id: steakHouse.id,
                date: "03/26/2024",
            }),
            createReservation({
                customer_id: yvelis.id,
                party_count: 6,
                restaurant_id: oliveGardens.id,
                date: "03/12/2024",
            }),
            createReservation({
                customer_id: yandiel.id,
                party_count: 2,
                restaurant_id: romeItaly.id,
                date: "04/21/2024",
            }),
            createReservation({
                customer_id: steve.id,
                party_count: 4,
                restaurant_id: romeItaly.id,
                date: "03/17/2024",
            }),
        ]);

        const reservations = await fetchReservations();
        console.log(reservations);

        await destroyReservation(reservations[0].id);
        console.log(await fetchReservations());
    } catch (error) {
        console.error(error);
    }
};

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

init();
