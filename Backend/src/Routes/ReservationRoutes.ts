import { Router } from "express";
import { ReservationController } from "../Controller/ReservationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", ReservationController.createReservation);
router.get("/", ReservationController.listReservations);
router.patch("/:id/cancel", ReservationController.cancelReservation);
router.patch("/:id/status", ReservationController.updateStatus);
router.post("/:id/lift", ReservationController.liftTickets);

export default router;


