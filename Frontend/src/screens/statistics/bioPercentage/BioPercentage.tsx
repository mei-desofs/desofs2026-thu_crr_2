import { Bell, LogOut, ArrowLeft, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { bioPercentageStyles } from './BioPercentage.styles';
import { useNavigate } from "react-router-dom";
import { statisticsService } from "../../../services/statisticsService"
import { dishService } from "../../../services/dishService"
import { ingredientService } from "../../../services/ingredientService"
import { productService } from "../../../services/productService"
import type { Recipe } from "../../../models/Recipe"
import type { Dish } from "../../../models/Dish"
import {suppliersStyles} from "../../networkScreen/supplierListScreen/SuppliersList.styles";

export default function BioPercentageScreen() {
  const navigate = useNavigate();

  /* Aqui vem o array bidimensional do backend */
  const [recipes, setRecipes] = useState<{ recipe: Recipe; percent: number; dish: Dish }[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<{ recipe: Recipe; percent: number; dish: Dish } | null>(null);
  const [ingredientNames, setIngredientNames] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState('');

  interface bioPercentage {
    recipe: Recipe
    percentage: number
  }

  // Carregar receitas
  useEffect(() => {
  const fetchData = async () => {
    try {
      const data: bioPercentage[] = await statisticsService.getBioProductsPercentageForRecipe();
      const enriched = await Promise.all(
        data.map(async (item) => {
          const dish = await dishService.getDishByRecipeId(item.recipe.id);
          return {
            recipe: item.recipe,
            percent: item.percentage,
            dish: dish,
          };
        })
      );
      setRecipes(enriched);
    } catch (err) {
      console.error(err);
    }
  };
    fetchData();
  }, []);

  // Carregar ingredientes QUANDO seleciona uma receita
  useEffect(() => {
    if (!selectedRecipe) return;

    const fetchIngredientNames = async () => {
      try {
        const names = await Promise.all(
          selectedRecipe.recipe.ingredients.map(async (ingredientId) => {
            const ingredient = await ingredientService.getIngredientById(ingredientId);
            const product = await productService.getProductById(ingredient.productId);
            return product.name;
          })
        );

        setIngredientNames(names);
      } catch (err) {
        console.error(err);
        setIngredientNames([]);
      }
    };

    fetchIngredientNames();
  }, [selectedRecipe]);

  const handleBack = () => {
    if (selectedRecipe) {
      setSelectedRecipe(null);
      setIngredientNames([]);
    } else {
      navigate("/statistics-dashboard");
    }
  };

  const handleLogout = () => {
    console.log("Logout triggered");
  };

  const formatPercent = (value: number) => {
    return Number.isInteger(value) ? value : Number(value.toFixed(2));
  };


  /* Filtros */
  const filteredRecipes = recipes.filter(item => {
    const matchSearch =
        item.dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.recipe.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchSearch;
  });

  return (
      <div style={bioPercentageStyles.pageContainer}>
        {/* Header */}
        <header style={bioPercentageStyles.header}>
          <div style={bioPercentageStyles.headerLeft}>
            <button
                style={bioPercentageStyles.backButton}
                onClick={handleBack}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <ArrowLeft size={20} />
            </button>

            <div style={bioPercentageStyles.logoCircle}>
              <span style={bioPercentageStyles.logoText}>B</span>
            </div>

            <div style={bioPercentageStyles.headerInfo}>
              <h1 style={bioPercentageStyles.headerTitle}>BioCantinas</h1>
              <p style={bioPercentageStyles.headerSubtitle}>
                {selectedRecipe ? 'Detalhes da Receita' : 'Percentagem Biológica por Receita'}
              </p>
            </div>
          </div>

          <div style={bioPercentageStyles.headerActions}>
            <button
                style={bioPercentageStyles.iconButton}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Bell size={20} />
            </button>

            <button
                style={bioPercentageStyles.iconButton}
                onClick={handleLogout}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Main */}
        <main style={bioPercentageStyles.mainContent}>

          {/* LISTA DE RECEITAS */}
          {!selectedRecipe ? (
              <>
                {/* Título */}
                <div style={bioPercentageStyles.titleSection}>
                  <h2 style={bioPercentageStyles.pageTitle}>Receitas</h2>
                  <p style={bioPercentageStyles.pageDescription}>
                    {filteredRecipes.length} receita(s) encontradas
                  </p>
                </div>

                {/* Search */}
                <div style={bioPercentageStyles.filtersContainer}>
                  <div style={bioPercentageStyles.searchBox}>
                    <Search size={20} color="#6b7280" />
                    <input
                        type="text"
                        placeholder="Pesquisar receitas..."
                        style={bioPercentageStyles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* GRID */}
                <div style={bioPercentageStyles.suppliersGrid}>
                  {filteredRecipes.map((item, i) => (
                    <div
                      key={i}
                      style={bioPercentageStyles.supplierCard}
                      onClick={() => setSelectedRecipe(item)}
                    >
                    
                      {/* Header */}
                      <div style={bioPercentageStyles.cardHeader}>
                        <h3 style={bioPercentageStyles.supplierName}>
                          {item.dish.name}
                        </h3>

                        <span
                          style={{
                            ...suppliersStyles.statusBadge,
                            backgroundColor: '#dcfce7',
                            color: '#16a34a',
                          }}
                        >
                          {formatPercent(item.percent)}% BIO
                        </span>
                      </div>

                      {/* Info principal */}
                      <div style={bioPercentageStyles.cardMeta}>
                        <span style={bioPercentageStyles.ingredientsText}>
                          🧺 {item.recipe.ingredients.length} ingrediente(s)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredRecipes.length === 0 && (
                    <div style={bioPercentageStyles.emptyState}>
                      <p style={bioPercentageStyles.emptyText}>
                        Nenhuma receita encontrada.
                      </p>
                    </div>
                )}
              </>
          ) : (
              <>
                {/* DETALHES DA RECEITA */}
                <div style={bioPercentageStyles.detailsCard}>
                  <div style={bioPercentageStyles.detailsHeader}>
                    <div>
                      <h2 style={bioPercentageStyles.detailsTitle}>
                        {selectedRecipe?.dish.name || "Carregando..."}
                      </h2>

                      <span
                          style={{
                            ...bioPercentageStyles.statusBadge,
                            backgroundColor: '#dcfce7',
                            color: '#16a34a',
                          }}
                      >
                  {selectedRecipe && formatPercent(selectedRecipe.percent)}% BIO
                </span>
                    </div>
                  </div>

                  {/* Ingredientes */}
                  <div style={bioPercentageStyles.detailsSection}>
                    <h3 style={bioPercentageStyles.sectionTitle}>Ingredientes</h3>
                    <p style={bioPercentageStyles.detailValue}>
                      {ingredientNames.length > 0
                      ? ingredientNames.join(', ')
                      : 'A carregar ingredientes...'}
                    </p>
                  </div>

                  {/* Descrição */}
                  <div style={bioPercentageStyles.detailsSection}>
                    <h3 style={bioPercentageStyles.sectionTitle}>Descrição</h3>
                    <p style={bioPercentageStyles.detailValue}>
                      {selectedRecipe?.recipe.description}
                    </p>
                  </div>
                </div>
              </>
          )}
        </main>
      </div>
  );
}
