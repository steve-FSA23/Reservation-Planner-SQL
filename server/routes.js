const express = require("express");
const router = express.Router();

const {
    fetchCustomers,
    fetchRestaurants,
    fetchReservations,
    createReservation,
    destroyReservation,
} = require("./db");

// GET - Returns an array of customers
router.get("/customers", async (req, res, next) => {
    try {
        const customers = await fetchCustomers();
        res.send(customers);
    } catch (error) {
        next(error);
    }
});

// GET - Returns an array of restaurants
router.get("/restaurants", async (req, res, next) => {
    try {
        const restaurants = await fetchRestaurants();
        res.send(restaurants);
    } catch (error) {
        next(error);
    }
});

// GET - Returns an array of reservations
router.get("/reservations", async (req, res, next) => {
    try {
        const reservations = await fetchReservations();
        res.send(reservations);
    } catch (error) {
        next(error);
    }
});

// POST-Create reservation for a customer
router.post("/customers/:id/reservations", async (req, res, next) => {
    try {
        const customerId = req.params.id;

        const { restaurant_id, date, party_count } = req.body;

        const reservation = await createReservation({
            customer_id: customerId,
            restaurant_id,
            date,
            party_count,
        });
        res.status(201).json(reservation);
    } catch (error) {
        next(error);
    }
});

// Deletes a reservation for a customer
router.delete(
    "/customers/:customer_id/reservations/:id",
    async (req, res, next) => {
        try {
            const reservationId = req.params.id;

            await destroyReservation(reservationId);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
);

// Error handling route
router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});

module.exports = router;
