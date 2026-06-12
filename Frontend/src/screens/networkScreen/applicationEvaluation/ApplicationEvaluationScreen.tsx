import { useLogout } from "../../../util/useLogout";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Bell,
  LogOut,
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Leaf,
  ShoppingBasket,
  FileChartColumnIncreasing,
} from "lucide-react";
import { applicationsStyles } from "./ApplicationEvaluationScreen.styles";
import { useNavigate } from "react-router-dom";
import type { Application } from "../../../models/Application";
import { applicationService } from "../../../services/applicationService";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../../config";

const STATUS_LABELS = {
  submitted: "Submetida",
  under_review: "Em revisão",
  approved: "Aprovada",
  rejected: "Recusada",
  cancelled: "Cancelada",
};

export default function ApplicationEvaluationScreen() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const userName = user ? user.name : "Admin BioCantinas";

  const [activeTab, setActiveTab] = useState<"pendentes" | "avaliadas">(
    "pendentes"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [comentario, setComentario] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"aceitar" | "recusar" | null>(
    null
  );
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applications = await applicationService.listApplications();
        const pendingApplications = applications.filter(
          (app) => app.status === "submitted" || app.status === "under_review"
        );
        const evaluatedApplications = applications.filter(
          (app) => app.status !== "submitted" && app.status !== "under_review"
        );

        setApplicationsPendentes(pendingApplications);
        setApplicationsAvaliadas(evaluatedApplications);
      } catch (error) {
        console.error("Erro ao carregar candidaturas:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Dados de exemplo
  const [applicationsPendentes, setApplicationsPendentes] = useState<
    Application[]
  >([]);

  const [applicationsAvaliadas, setApplicationsAvaliadas] = useState<
    Application[]
  >([]);

  const handleLogout = useLogout();

  const handleOpenModal = (
    application: Application,
    action: "aceitar" | "recusar"
  ) => {
    setSelectedApplication(application);
    setModalAction(action);
    setComentario("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
    setModalAction(null);
    setComentario("");
  };

  const handleSubmitAvaliacao = async () => {
    if (!selectedApplication || !modalAction) return;

    const updatedApplication: Application = {
      ...selectedApplication,
      status: modalAction === "aceitar" ? "approved" : "rejected",
      evaluationComment: comentario,
    };

    console.log("Selected Application:", selectedApplication);

    console.log("Updated Application to submit:", updatedApplication);

    try {
      if (selectedApplication.id == null) {
        throw new Error("Application ID is null");
      }
      if (modalAction === "aceitar") {
        await applicationService.acceptApplication(
          selectedApplication.id,
          comentario
        );
      } else {
        await applicationService.rejectApplication(
          selectedApplication.id,
          comentario
        );
      }

      // Remove das pendentes
      setApplicationsPendentes((prev) =>
        prev.filter((c) => c.id !== selectedApplication.id)
      );

      // Adiciona às avaliadas
      setApplicationsAvaliadas((prev) => [updatedApplication, ...prev]);

      handleCloseModal();
      alert("Candidatura avaliada com sucesso!");
    } catch {
      handleCloseModal();
      alert("Erro ao avaliar candidatura. Por favor, tente novamente.");
    }
  };

  let filteredApplications =
    searchTerm == null || searchTerm === ""
      ? activeTab === "pendentes"
        ? applicationsPendentes
        : applicationsAvaliadas
      : activeTab === "pendentes"
      ? applicationsPendentes.filter(
          (app) =>
            app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.location?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : applicationsAvaliadas.filter(
          (app) =>
            app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.location?.toLowerCase().includes(searchTerm.toLowerCase())
        );

  filteredApplications = [...filteredApplications].sort((a, b) => {
    const dA = new Date(a.applicationDate).getTime();
    const dB = new Date(b.applicationDate).getTime();
    return order === "asc" ? dA - dB : dB - dA;
  });

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
              Bem-vindo, {userName}
            </p>
          </div>
        </div>
        <div style={applicationsStyles.headerActions}>
          <button style={applicationsStyles.iconButton}>
            <Bell size={20} />
          </button>
          <button style={applicationsStyles.iconButton} onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={applicationsStyles.mainContent}>
        <div style={applicationsStyles.pageHeader}>
          <h2 style={applicationsStyles.pageTitle}>
            Candidaturas de Agricultores
          </h2>
          <p style={applicationsStyles.pageDescription}>
            Avalie e gerencie as candidaturas de fornecedores
          </p>
        </div>

        {/* Tabs */}
        <div style={applicationsStyles.tabsContainer}>
          <button
            style={{
              ...applicationsStyles.tab,
              ...(activeTab === "pendentes"
                ? applicationsStyles.tabActive
                : {}),
            }}
            onClick={() => setActiveTab("pendentes")}
          >
            Por Avaliar ({applicationsPendentes.length})
          </button>
          <button
            style={{
              ...applicationsStyles.tab,
              ...(activeTab === "avaliadas"
                ? applicationsStyles.tabActive
                : {}),
            }}
            onClick={() => setActiveTab("avaliadas")}
          >
            Avaliadas ({applicationsAvaliadas.length})
          </button>
        </div>

        {/* Search Bar */}
        <div style={applicationsStyles.searchContainer}>
          <Search
            size={20}
            color="#9ca3af"
            style={applicationsStyles.searchIcon}
          />
          <input
            type="text"
            placeholder="Pesquisar por nome ou localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={applicationsStyles.searchInput}
          />
          <button
            onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
            style={applicationsStyles.orderButton}
          >
            Ordenar por Data {order === "asc" ? "▲" : "▼"}
          </button>
        </div>
        {/* Applications List */}
        <div style={applicationsStyles.applicationsList}>
          {filteredApplications.length === 0 ? (
            <div style={applicationsStyles.emptyState}>
              <FileText size={48} color="#d1d5db" />
              <p style={applicationsStyles.emptyStateText}>
                Nenhuma candidatura encontrada
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div
                key={application.id}
                style={applicationsStyles.applicationCard}
              >
                <div style={applicationsStyles.applicationHeader}>
                  <h3 style={applicationsStyles.applicationNome}>
                    {application.name}
                  </h3>
                  {application.status === "approved" && (
                    <span style={applicationsStyles.statusBadgeAceite}>
                      ACEITE
                    </span>
                  )}
                  {application.status === "rejected" && (
                    <span style={applicationsStyles.statusBadgeRecusada}>
                      RECUSADA
                    </span>
                  )}
                </div>

                <div style={applicationsStyles.applicationInfo}>
                  {
                    <div style={applicationsStyles.infoItem}>
                      <MapPin size={16} color="#6b7280" />
                      <span style={applicationsStyles.infoText}>
                        <strong>Munícipio:</strong>&nbsp;
                        {application.municipio} &nbsp;
                        <strong>Freguesia:</strong>&nbsp;
                        {application.freguesia} &nbsp; <br/> 
                        <strong>Localização da candidatura:</strong>&nbsp;
                        {application.location} &nbsp; 
                      </span>
                    </div>
                  }
                  <div style={applicationsStyles.infoItem}>
                    <FileChartColumnIncreasing size={16} color="#6b7280" />
                    <span style={applicationsStyles.infoText}>
                      <strong>Estado:</strong>{" "}
                      {STATUS_LABELS[application.status]}
                    </span>
                  </div>
                  <div style={applicationsStyles.infoItem}>
                    <Calendar size={16} color="#6b7280" />
                    <span style={applicationsStyles.infoText}>
                      <strong>Data de submissão: </strong>
                      {new Date(application.applicationDate).toLocaleDateString(
                        "pt-PT"
                      )}
                    </span>
                  </div>
                  <div
                    style={{
                      ...applicationsStyles.infoItem,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <span style={{ marginTop: 2, flexShrink: 0 }}>
                      <ShoppingBasket size={16} color="#6b7280" />
                    </span>
                    <div style={applicationsStyles.infoText}>
                      <div>
                        {application.farmerProducts.length}{" "}
                        <strong>
                          Produto
                          {application.farmerProducts.length !== 1 ? "s" : ""}:
                        </strong>
                      </div>
                      <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                        {application.farmerProducts.map((fp, id) => (
                          <li key={id}>
                            {fp.product?.name} - {fp.quantity}{" "}
                            {fp.unit === "unit"
                              ? `unidade${Number(fp.quantity) !== 1 ? "s" : ""}`
                              : fp.unit}{" "}
                            | Semana: {fp.week}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div
                    style={{
                      ...applicationsStyles.infoItem,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <span style={{ marginTop: 2, flexShrink: 0 }}>
                      <FileText size={16} color="#6b7280" />
                    </span>
                    <span style={applicationsStyles.infoText}>
                      {application.documentsSubmitted.length}{" "}
                      <strong>
                        Documento
                        {application.documentsSubmitted.length !== 1
                          ? "s"
                          : " "}
                        :{" "}
                      </strong>
                      <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                        {application.documentsSubmitted.map((doc, id) => (
                          <li key={id}>
                            {" "}
                            <a
                              href={`${API_BASE_URL}/applications/${application.id}/documents/${doc.filename}`}
                              target="blank"
                            >
                              {" "}
                              {doc.filename}{" "}
                            </a>
                          </li>
                        ))}{" "}
                      </ul>
                    </span>
                  </div>
                </div>

                {application.status !== "under_review" &&
                  application.evaluationComment && (
                    <div style={applicationsStyles.comentarioBox}>
                      <strong style={applicationsStyles.comentarioLabel}>
                        Comentário:
                        <span style={applicationsStyles.required}>*</span>
                      </strong>
                      <p style={applicationsStyles.comentarioText}>
                        {application.evaluationComment}
                      </p>
                    </div>
                  )}

                {(application.status === "submitted" ||
                  application.status === "under_review") && (
                  <div style={applicationsStyles.actionButtons}>
                    <button
                      style={applicationsStyles.recusarButton}
                      onClick={() => handleOpenModal(application, "recusar")}
                    >
                      <XCircle size={18} />
                      Recusar
                    </button>
                    <button
                      style={applicationsStyles.aceitarButton}
                      onClick={() => handleOpenModal(application, "aceitar")}
                    >
                      <CheckCircle size={18} />
                      Aceitar
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && selectedApplication && (
        <div style={applicationsStyles.modalOverlay} onClick={handleCloseModal}>
          <div
            style={applicationsStyles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={applicationsStyles.modalTitle}>
              {modalAction === "aceitar" ? "Aceitar" : "Recusar"} Candidatura
            </h3>
            <p style={applicationsStyles.modalSubtitle}>
              {selectedApplication.name}
            </p>

            <div style={applicationsStyles.modalFormGroup}>
              <label style={applicationsStyles.modalLabel}>
                Comentário<span style={applicationsStyles.required}>*</span>
                {modalAction === "recusar"}
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Adicione um comentário sobre a avaliação..."
                style={applicationsStyles.modalTextarea}
                rows={4}
              />
            </div>

            <div style={applicationsStyles.modalActions}>
              <button
                style={applicationsStyles.modalCancelButton}
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
              <button
                style={
                  modalAction === "aceitar"
                    ? applicationsStyles.modalConfirmButtonAceitar
                    : applicationsStyles.modalConfirmButtonRecusar
                }
                onClick={handleSubmitAvaliacao}
                disabled={modalAction === "recusar" && !comentario.trim()}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
