import axios from "axios";
import type {Recipe} from "../models/Recipe"
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/statistics`;

interface BioPercentage {
    recipe: Recipe;
    percentage: number;
}

export const statisticsService = {
    // --------------------------------------------------------------------------
    // Listar todos as receitas e as suas respetivas percentagens de produtos bio
    // --------------------------------------------------------------------------
    async getBioProductsPercentageForRecipe(): Promise<BioPercentage[]> {
        const response = await axios.get<BioPercentage[]>(API_URL);
        return response.data;
    }
};
