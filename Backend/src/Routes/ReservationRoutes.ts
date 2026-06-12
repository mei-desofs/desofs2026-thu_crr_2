import { Router } from "express";
import { ReservationController } from "../Controller/ReservationController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { Role, RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.post(
  "/",
  authorizeRoles(Role.Student, Role.NursingHome),
  ReservationController.createReservation,
);
router.get("/", authorizeRoles(...RoleGroups.RESERVATIONS), ReservationController.listReservations);
router.patch(
  "/:id/cancel",
  authorizeRoles(Role.Student, Role.NursingHome),
  ReservationController.cancelReservation,
);
router.patch(
  "/:id/status",
  authorizeRoles(...RoleGroups.REFECTORY, ...RoleGroups.NETWORK),
  ReservationController.updateStatus,
);
router.post(
  "/:id/lift",
  authorizeRoles(...RoleGroups.REFECTORY),
  ReservationController.liftTickets,
);

export default router;
