import { Request, Response } from "express";
import { ReservationService } from "../Service/ReservationService";
import logger from "../utils/logger";
import { createReservationSchema, updateReservationStatusSchema, liftTicketsSchema } from "../Schemas/ReservationValidation";
import { validateOrFail } from "../utils/validateOrFail";


const service = new ReservationService();


export class ReservationController {
  static async createReservation(req: Request, res: Response) {
    const cv = validateOrFail(createReservationSchema, req.body, res);
    if (!cv.ok) return;
    const { status = "active", reservationDate = new Date(), quantity = 1, mealId, userId, refeitorioId } = cv.value;

    try {
      let finalRefeitorioId = refeitorioId;
      if (!finalRefeitorioId) {
        const { Meal } = await import("../Model/Meal");
        const meal = await Meal.findByPk(mealId);
        if (!meal) {
          return res.status(404).json({ error: "Meal not found" });
        }
        if (!meal.refeitorioId) {
          return res.status(400).json({ error: "Meal does not have a refeitorioId associated" });
        }
        finalRefeitorioId = meal.refeitorioId;
      }

      const reservation = await service.createReservation({
        status,
        reservationDate,
        quantity,
        mealId,
        userId,
        refeitorioId: finalRefeitorioId,
      });

      logger.info("RESERVATION:CREATED", {
        reservationId: reservation.id,
        userId,
        mealId,
        refeitorioId: finalRefeitorioId,
        quantity,
      });

      res.status(201).json(reservation);
    } catch (err: any) {
      if (err.message === "MEAL_NOT_FOUND") return res.status(404).json({ error: "Meal not found" });
      if (err.message === "USER_NOT_FOUND") return res.status(404).json({ error: "User not found" });
      if (err.message === "REFEITORIO_NOT_FOUND") return res.status(404).json({ error: "Refeitório not found" });
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async listReservations(req: Request, res: Response) {
    const { userId, status, refeitorioId } = req.query;
    const reservations = await service.listReservations({
      userId: userId ? Number(userId) : undefined,
      status: status as string | undefined,
      refeitorioId: refeitorioId ? Number(refeitorioId) : undefined,
    });
    res.json(reservations);
  }

  static async cancelReservation(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: "Invalid ID" });

    try {
      const reservation = await service.updateStatus(id, "canceled");

      logger.info("RESERVATION:CANCELLED", {
        reservationId: id,
        by: (req as any).user?.id,
      });

      res.json(reservation);
    } catch (err: any) {
      if (err.message === "RESERVATION_NOT_FOUND")
        return res.status(404).json({ error: "Reservation not found" });
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: "Invalid ID" });
    const uv = validateOrFail(updateReservationStatusSchema, req.body, res);
    if (!uv.ok) return;
    const { status } = uv.value;

    try {
      const reservation = await service.updateStatus(id, status);

      logger.info("RESERVATION:STATUS_CHANGED", {
        reservationId: id,
        status,
        by: (req as any).user?.id,
      });

      res.json(reservation);
    } catch (err: any) {
      if (err.message === "RESERVATION_NOT_FOUND")
        return res.status(404).json({ error: "Reservation not found" });
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async liftTickets(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: "Invalid ID" });
    const lv = validateOrFail(liftTicketsSchema, req.body, res);
    if (!lv.ok) return;
    const { quantity } = lv.value;

    try {
      const reservation = await service.liftTickets(id, quantity);

      logger.info("RESERVATION:TICKETS_LIFTED", {
        reservationId: id,
        quantity,
        by: (req as any).user?.id,
      });

      res.json(reservation);
    } catch (err: any) {
      if (err.message === "RESERVATION_NOT_FOUND")
        return res.status(404).json({ error: "Reservation not found" });
      if (err.message === "RESERVATION_NOT_ACTIVE")
        return res.status(400).json({ error: "Reservation is not active" });
      if (err.message === "INVALID_QUANTITY")
        return res.status(400).json({ error: "Invalid quantity" });
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}