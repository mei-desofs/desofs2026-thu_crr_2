import { Request, Response } from "express";
import { ProducerStatisticsService } from "../Service/ProducerStatisticsService";

export class ProducerStatisticsController {
    static async getProducerStatistics(req: Request, res: Response) {
        try {
            const service = new ProducerStatisticsService();
            const producerId = req.query.producerId ? Number(req.query.producerId) : undefined;
            
            const statistics = await service.getProducerStatistics({
                producerId
            });

            res.status(200).json(statistics);
        } catch (error: any) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

