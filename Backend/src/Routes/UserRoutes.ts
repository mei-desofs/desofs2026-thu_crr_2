import { Router } from "express";
import { UserController } from "../Controller/UserController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(apiRateLimiter);

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.use(authMiddleware);

router.get("/:id", UserController.getById);

router.patch("/startQuarantine/:id", UserController.startQuarantine);
router.patch("/endQuarantine/:id", UserController.endQuarantine);

export default router;


/* ex


router.get(
  "/all",
  authMiddleware,
  authorizeRoles("Admin", "PT"),
  userController.getAllIncludingInactive,
);
*/