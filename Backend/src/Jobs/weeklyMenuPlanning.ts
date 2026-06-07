import cron from "node-cron";
import { generateNeededProductsFromPublishedMenus } from "../utils/generateNeededProducts";
import { generateOrdersFromNeededProducts } from "../utils/generateOrdersFromNeededProducts";
import { adjustOrdersAfterReservations } from "../utils/adjustOrdersAfterReservations";
import logger from "../utils/logger";

export function startWeeklyMenuPlanningJob() {
  // Corre Às 00:00 todos os dias 
  cron.schedule("00 00 * * *", async () => {
    logger.info("JOB:MENU_PLANNING_START");

    try {
      // Gerar NeededProducts
      await generateNeededProductsFromPublishedMenus();
      logger.info("JOB:MENU_PLANNING_NEEDED_PRODUCTS_DONE");
 
      await generateOrdersFromNeededProducts();
      logger.info("JOB:MENU_PLANNING_ORDERS_GENERATED");
 
      await adjustOrdersAfterReservations();
      logger.info("JOB:MENU_PLANNING_ORDERS_ADJUSTED");
 
      logger.info("JOB:MENU_PLANNING_DONE");
    } catch (error: any) {
      logger.error("JOB:MENU_PLANNING_FAILED", {
        error: error.message,
        stack: error.stack,
      });
    }
  }
);
}
