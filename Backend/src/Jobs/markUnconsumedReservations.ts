const cron = require("node-cron");
import { ReservationService } from "../Service/ReservationService";
import logger from "../utils/logger";

const reservationService = new ReservationService();


// Job de TESTE - Verifica reservas ativas para uma data específica

export function startMarkUnconsumedReservationsJob() {
  cron.schedule("42 3 * * *", async () => {
    const testDate = new Date(2026, 0, 16);
 
    logger.info("JOB:UNCONSUMED_RESERVATIONS_START", {
      checkDate: testDate.toISOString().split("T")[0],
    });
 
    try {
      const result = await reservationService.markUnconsumedReservations(testDate);
 
      logger.info("JOB:UNCONSUMED_RESERVATIONS_DONE", {
        message: result.message,
      });
    } catch (error: any) {
      logger.error("JOB:UNCONSUMED_RESERVATIONS_FAILED", {
        error: error.message,
        stack: error.stack,
      });
    }
  }, {
    scheduled: true,
    timezone: "Europe/Lisbon",
  });
 
  logger.info("JOB:UNCONSUMED_RESERVATIONS_SCHEDULED", {
    cron: "42 3 * * *",
    timezone: "Europe/Lisbon",
  });
}
 
/**
 * Agenda o job para uma hora/minuto específicos (útil em dev/testes).
 */
export function scheduleTestJob(hour: number, minute: number) {
  const cronExpression = `${minute} ${hour} * * *`;
  const timeLabel = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
 
  logger.info("JOB:TEST_SCHEDULED", { time: timeLabel });
 
  const task = cron.schedule(cronExpression, async () => {
    logger.info("JOB:TEST_START", { time: timeLabel });
 
    try {
      const result = await reservationService.markUnconsumedReservations();
      logger.info("JOB:TEST_DONE", { message: result.message });
    } catch (error: any) {
      logger.error("JOB:TEST_FAILED", { error: error.message });
    }
  }, {
    scheduled: true,
    timezone: "Europe/Lisbon",
  });
 
  return task;
}