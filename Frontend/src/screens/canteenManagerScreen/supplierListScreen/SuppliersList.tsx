/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Bell,
  LogOut,
  Search,
  Calendar,
  MapPin,
  ShoppingBasket,
  FileText,
  Leaf,
  AlertCircle,
} from "lucide-react";
import { applicationsStyles } from "../../networkScreen/applicationEvaluation/ApplicationEvaluationScreen.styles";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../services/userService";
import type { SupplierOrder } from "../../../models/SupplierOrder";
import { API_BASE_URL } from "../../../../config";
import { applicationService } from "../../../services/applicationService";

interface SupplierView {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  joinDate: Date;
  position: number;

  status: string;
  updatedAt: Date;

  products: {
    name: string;
    quantity: number;
    unit: string;
    week?: number;
  }[];

  documents: {
    filename: string;
    url: string;
  }[];
}

export default function SuppliersList() {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState<SupplierView[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDescending, setSortDescending] = useState(true);
  const [expandedProducts, setExpandedProducts] = useState<
    Record<number, boolean>
  >({});
  const [quarantineFilter, setQuarantineFilter] = useState<
    "all" | "quarantine" | "active"
  >("all");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const orders: SupplierOrder[] =
          await userService.listOrderedSuppliers();

        const suppliersView = await Promise.all(
          orders.map(async (order) => {
            const user = await userService.getUserById(order.supplierId);
            const application =
              await applicationService.getApplicationByUser(user.id);

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: application.businessPhone,
              address: application.location,
              joinDate: order.applicationDate,
              position: order.position,

              status: user.status,
              updatedAt: new Date(user.updatedAt),

              products: application.farmerProducts ?? [],
              documents: (application.documentsSubmitted ?? []).map(
                (doc: any) => ({
                  filename: doc.filename,
                  url: `${API_BASE_URL}/applications/${application.id}/documents/${doc.filename}`,
                })
              ),
            };
          })
        );

        setSuppliers(suppliersView);
      } catch (error) {
        console.error("Erro ao carregar fornecedores:", error);
      }
    };

    fetchSuppliers();
  }, []);

  const filteredSuppliers =
    (searchTerm.trim() === ""
      ? suppliers
      : suppliers.filter(
          (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
      .filter((s) => {
        if (quarantineFilter === "quarantine")
          return s.status === "quarantine";
        if (quarantineFilter === "active")
          return s.status !== "quarantine";
        return true;
      })
      .slice()
      .sort((a, b) =>
        sortDescending ? b.position - a.position : a.position - b.position
      );

  const handleLogout = () => {
    navigate("/login");
  };

  const toggleQuarantine = async (supplierId: number, currentStatus: string) => {
    const isQuarantined = currentStatus === "quarantine";
    const action = isQuarantined ? "retirar de quarentena" : "colocar em quarentena";
    const supplier = suppliers.find(s => s.id === supplierId);
    
    const confirmed = window.confirm(
      `Tem a certeza que deseja ${action} o fornecedor "${supplier?.name}"?`
    );
    
    if (!confirmed) return;

    try {
      if(currentStatus === "quarantine"){
        await userService.endQuarantine(supplierId);
      }
      else{
        await userService.startQuarantine(supplierId);
      }
      
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === supplierId
            ? {
                ...s,
                status:
                  s.status === "quarantine"
                    ? "active"
                    : "quarantine",
                updatedAt: new Date(),
              }
            : s
        )
      );
    } catch (e) {
      console.error("Erro ao alterar status do utilizador", e);
      alert("Erro ao alterar o status do fornecedor. Por favor, tente novamente.");
    }
  };

  return (
    <div style={applicationsStyles.pageContainer}>
      {/* Header */}
      <header style={applicationsStyles.header}>
        <div style={applicationsStyles.headerLeft}>
          <div style={applicationsStyles.logoCircle()}>
            <Leaf size={applicationsStyles.logoIcon()} color="#16a34a" />
          </div>
          <div style={applicationsStyles.headerInfo}>
            <h1 style={applicationsStyles.headerTitle}>BioCantinas</h1>
            <p style={applicationsStyles.headerSubtitle}>
              Fornecedores aprovados
            </p>
          </div>
        </div>

        <div style={applicationsStyles.headerActions}>
          <button style={applicationsStyles.iconButton}>
            <Bell size={20} />
          </button>
          <button
            style={applicationsStyles.iconButton}
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={applicationsStyles.mainContent}>
        <div style={applicationsStyles.pageHeader}>
          <h2 style={applicationsStyles.pageTitle}>Lista de Fornecedores</h2>
        </div>

        {/* Search & Filters */}
        <div style={applicationsStyles.searchContainer}>
          <Search
            size={20}
            color="#9ca3af"
            style={applicationsStyles.searchIcon}
          />
          <input
            type="text"
            placeholder="Pesquisar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={applicationsStyles.searchInput}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "flex-end",
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => setSortDescending((prev) => !prev)}
            style={{
              background: "#f0fdf4",
              border: "1px solid #16a34a",
              color: "#166534",
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Ordem: {sortDescending ? "Decrescente" : "Crescente"}
          </button>
          <select
            value={quarantineFilter}
            onChange={(e) =>
              setQuarantineFilter(e.target.value as any)
            }
            style={{
              background: "#f0fdf4",
              border: "1px solid #16a34a",
              color: "#166534",
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <option value="all">Todos os fornecedores</option>
            <option value="active">Disponíveis</option>
            <option value="quarantine">Em quarentena</option>
          </select>
        </div>

        {/* Suppliers List */}
        <div style={applicationsStyles.applicationsList}>
          {filteredSuppliers.length === 0 ? (
            <div style={applicationsStyles.emptyState}>
              <FileText size={48} color="#d1d5db" />
              <p style={applicationsStyles.emptyStateText}>
                Nenhum fornecedor encontrado
              </p>
            </div>
          ) : (
            filteredSuppliers.map((supplier) => {
              const isExpanded = expandedProducts[supplier.id] ?? false;
              const isQuarantined = supplier.status === "quarantine";

              const visibleProducts = isExpanded
                ? supplier.products
                : supplier.products.slice(0, 3);

              return (
                <div
                  key={supplier.id}
                  style={{
                    ...applicationsStyles.applicationCard,
                    borderLeft: isQuarantined ? "4px solid #dc2626" : "4px solid transparent",
                    background: isQuarantined ? "#fef2f2" : "#ffffff",
                    position: "relative",
                  }}
                >
                  {/* Botão de quarentena no canto superior direito */}
                  <button
                    onClick={() => toggleQuarantine(supplier.id, supplier.status)}
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: isQuarantined ? "#ecfdf5" : "#fef2f2",
                      color: isQuarantined ? "#166534" : "#991b1b",
                      border: "1px solid",
                      borderColor: isQuarantined ? "#16a34a" : "#dc2626",
                      padding: "8px 16px",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isQuarantined
                      ? "Retirar de quarentena"
                      : "Colocar em quarentena"}
                  </button>

                  {/* Header */}
                  <div style={applicationsStyles.applicationHeader}>
                    <div style={{ 
                      paddingRight: 200,
                      marginBottom: 16,
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 4,
                      }}>
                        <h3 style={{
                          ...applicationsStyles.applicationNome,
                          margin: 0,
                        }}>
                          {supplier.name}
                        </h3>
                        {isQuarantined && (
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            background: "#fee2e2",
                            color: "#991b1b",
                            padding: "4px 10px",
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                          }}>
                            <AlertCircle size={14} />
                            <span>Quarentena</span>
                          </div>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          color: "#6b7280",
                          fontWeight: 500,
                        }}
                      >
                        Posição na lista: {supplier.position}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={applicationsStyles.applicationInfo}>
                    {isQuarantined && (
                      <div style={applicationsStyles.infoItem}>
                        <AlertCircle size={16} color="#991b1b" />
                        <span style={applicationsStyles.infoText}>
                          <strong>Início da quarentena:</strong>{" "}
                          {supplier.updatedAt.toLocaleDateString("pt-PT")}
                        </span>
                      </div>
                    )}

                    <div style={applicationsStyles.infoItem}>
                      <MapPin size={16} color="#6b7280" />
                      <span style={applicationsStyles.infoText}>
                        <strong>Morada:</strong> {supplier.address ?? "—"}
                      </span>
                    </div>

                    <div style={applicationsStyles.infoItem}>
                      <Calendar size={16} color="#6b7280" />
                      <span style={applicationsStyles.infoText}>
                        <strong>Membro desde:</strong>{" "}
                        {new Date(supplier.joinDate).toLocaleDateString("pt-PT")}
                      </span>
                    </div>

                    {/* Produtos */}
                    <div
                      style={{
                        ...applicationsStyles.infoItem,
                        alignItems: "flex-start",
                      }}
                    >
                      <ShoppingBasket size={16} color="#6b7280" />
                      <div style={applicationsStyles.infoText}>
                        <strong>
                          Produto
                          {supplier.products.length !== 1 ? "s" : ""}
                        </strong>

                        <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                          {visibleProducts.map((p, i) => (
                            <li key={i}>
                              {p.name} – {p.quantity} {p.unit}
                              {p.week && ` | Semana ${p.week}`}
                            </li>
                          ))}
                        </ul>

                        {supplier.products.length > 3 && (
                          <button
                            onClick={() =>
                              setExpandedProducts((prev) => ({
                                ...prev,
                                [supplier.id]: !isExpanded,
                              }))
                            }
                            style={{
                              marginTop: 8,
                              background: "none",
                              border: "none",
                              color: "#16a34a",
                              cursor: "pointer",
                              padding: 0,
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                          >
                            {isExpanded ? "Ver menos" : "Ver mais"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Documentos */}
                    {/*<div
                      style={{
                        ...applicationsStyles.infoItem,
                        alignItems: "flex-start",
                      }}
                    >
                      <FileText size={16} color="#6b7280" />
                      <div style={applicationsStyles.infoText}>
                        <strong>
                          {supplier.documents.length} Documento
                          {supplier.documents.length !== 1 ? "s" : ""}
                        </strong>
                        <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                          {supplier.documents.map((doc, i) => (
                            <li key={i}>
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {doc.filename}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>*/}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}