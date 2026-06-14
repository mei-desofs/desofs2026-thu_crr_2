import { useLogout } from "../../../util/useLogout";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Bell, LogOut, Search, FileText, Leaf, AlertCircle } from "lucide-react";
import { parishesStyles } from "./ParishesList.styles";
import { useNavigate } from "react-router-dom";
import { parishService } from "../../../services/parishService";
import { FREGUESIAS } from "../../../models/FreguesiasByMunicipio";

export interface ParishView {
  id: number;
  name: string;
  quarantined: boolean;
  updatedAt: string;
}

export default function SuppliersList() {
  const navigate = useNavigate();

  const [parishes, setParishes] = useState<ParishView[]>([]);
  const [searchParish, setSearchParish] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");
  const [selectedParish, setSelectedParish] = useState<string>("");
  const [quarantineFilter, setQuarantineFilter] = useState<"all" | "quarantine" | "not_quarantine">("all");

  useEffect(() => {
    const fetchParishes = async () => {
      try {
        const dataFromApi = await parishService.listParishes();
        const data: ParishView[] = dataFromApi.map((p: any) => ({
          id: p.id,
          name: p.name,
          quarantined: p.quarantined,
          updatedAt: p.updatedAt || new Date().toISOString(),
        }));
        setParishes(data);
      } catch (e) {
        console.error("Erro ao carregar freguesias", e);
      }
    };
    fetchParishes();
  }, []);

  const filteredParishes = parishes.filter((p) => {
    if (quarantineFilter === "quarantine" && !p.quarantined) return false;
    if (quarantineFilter === "not_quarantine" && p.quarantined) return false;
    if (selectedMunicipality && !FREGUESIAS[selectedMunicipality]?.includes(p.name)) return false;
    if (selectedParish && p.name !== selectedParish) return false;
    if (searchParish && !p.name.toLowerCase().includes(searchParish.toLowerCase())) return false;
    return true;
  });

  const handleLogout = useLogout();

  const toggleQuarantine = async (parish: ParishView) => {
    const action = parish.quarantined ? "retirar de quarentena" : "colocar em quarentena";
    if (!window.confirm(`Tem a certeza que deseja ${action} a freguesia "${parish.name}"?`)) return;

    try {
      const updated = parish.quarantined
        ? await parishService.takeParishOfQuarantine(parish.id)
        : await parishService.quarantineParish(parish.id);

      const updatedView: ParishView = {
        id: updated.id,
        name: updated.name,
        quarantined: updated.quarantined,
        updatedAt: updated.updatedAt || new Date().toISOString(),
      };

      setParishes((prev) => prev.map((p) => (p.id === parish.id ? updatedView : p)));
    } catch (e) {
      console.error("Erro ao alterar estado da freguesia", e);
      alert("Erro ao alterar estado da freguesia.");
    }
  };

  return (
    <div style={parishesStyles.pageContainer}>
      {/* Header */}
      <header style={parishesStyles.header}>
        <div style={parishesStyles.headerLeft}>
          <div style={parishesStyles.logoCircle}>
            <Leaf size={parishesStyles.logoSize} color="#16a34a" />
          </div>
          <div style={parishesStyles.headerInfo}>
            <h1 style={parishesStyles.headerTitle}>BioCantinas</h1>
            <p style={parishesStyles.headerSubtitle}>Freguesias existentes</p>
          </div>
        </div>

        <div style={parishesStyles.headerActions}>
          <button style={parishesStyles.iconButton}>
            <Bell size={20} />
          </button>
          <button style={parishesStyles.iconButton} onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={parishesStyles.mainContent as React.CSSProperties}>
        <h2 style={parishesStyles.pageTitle}>Lista de Freguesias</h2>

        {/* Search & Filters */}
        <div style={parishesStyles.filtersContainer as React.CSSProperties}>
          <div style={parishesStyles.searchContainer}>
            <Search size={20} color="#9ca3af" style={{ marginRight: 8 }} />
            <input
              type="text"
              placeholder="Pesquisar freguesia..."
              value={searchParish}
              onChange={(e) => setSearchParish(e.target.value)}
              style={parishesStyles.searchInput}
            />
          </div>

          <select
            value={selectedMunicipality}
            onChange={(e) => {
              setSelectedMunicipality(e.target.value);
              setSelectedParish("");
            }}
            style={parishesStyles.selectFilter}
          >
            <option value="">Todos os municípios</option>
            {Object.keys(FREGUESIAS).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {selectedMunicipality && (
            <select
              value={selectedParish}
              onChange={(e) => setSelectedParish(e.target.value)}
              style={parishesStyles.parishSelect}
            >
              <option value="">Todas as freguesias</option>
              {FREGUESIAS[selectedMunicipality].map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          )}

          <select
            value={quarantineFilter}
            onChange={(e) =>
              setQuarantineFilter(e.target.value as "all" | "not_quarantine" | "quarantine")
            }
            style={parishesStyles.selectFilter}
          >
            <option value="all">Todas as freguesias</option>
            <option value="active">Disponíveis</option>
            <option value="quarantine">Em quarentena</option>
          </select>
        </div>

        {/* Parishes List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredParishes.length === 0 ? (
            <div style={parishesStyles.emptyState as React.CSSProperties}>
              <FileText size={48} color="#d1d5db" />
              <p style={parishesStyles.emptyStateText}>Nenhuma freguesia encontrada</p>
            </div>
          ) : (
            filteredParishes.map((parish) => {
              const isQuarantined = parish.quarantined;
              return (
                <div
                  key={parish.id}
                  style={{
                    ...parishesStyles.applicationCard,
                    borderLeft: isQuarantined ? "4px solid #dc2626" : "4px solid transparent",
                    background: isQuarantined ? "#fef2f2" : "#ffffff",
                  }}
                >
                  <button
                    onClick={() => toggleQuarantine(parish)}
                    style={{
                      ...parishesStyles.quarantineButton as React.CSSProperties,
                      background: isQuarantined ? "#ecfdf5" : "#fef2f2",
                      color: isQuarantined ? "#166534" : "#991b1b",
                      borderColor: isQuarantined ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {isQuarantined ? "Retirar de quarentena" : "Colocar em quarentena"}
                  </button>

                  <div style={parishesStyles.applicationHeader}>
                    <h3 style={parishesStyles.applicationNome}>{parish.name}</h3>
                    {isQuarantined && (
                      <div style={parishesStyles.quarantineBadge}>
                        <AlertCircle size={14} />
                        <span>Quarentena</span>
                      </div>
                    )}
                  </div>

                  {isQuarantined && (
                    <div style={parishesStyles.applicationInfo}>
                      <AlertCircle size={16} color="#991b1b" />
                      <span style={parishesStyles.infoText}>
                        <strong>Em quarentena desde:</strong>{" "}
                        {new Date(parish.updatedAt).toLocaleDateString("pt-PT")}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
