import { useLogout } from "../../util/useLogout";
import { ArrowLeft, Bell, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { reservationStyles } from "./ReservationScreen.styles";
import { useSelector } from "react-redux";
import { reservationService } from "../../services/reservationService";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config";

type ReservationState = {
  mealId?: number;
  name?: string;
  dishName?: string;
  type?: string;
  date?: string;
  quantity?: number;
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" });
};

export default function ReservationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as ReservationState;
  const { user } = useSelector((s: any) => s.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [refeitorioName, setRefeitorioName] = useState<string | null>(null);

  const mealName = state.dishName || state.name || "Prato não definido";
  const mealDate = formatDate(state.date);
  const mealType = state.type || "Almoço";
  const mealQuantity = state.quantity && state.quantity > 0 ? state.quantity : 1;

  // Buscar nome do refeitório
  useEffect(() => {
    const fetchRefeitorioName = async () => {
      // Se o user já tem refeitorio.name, usar diretamente
      if (user?.refeitorio?.name) {
        setRefeitorioName(user.refeitorio.name);
        return;
      }
      
      // Se tem refeitorioId mas não tem refeitorio.name, buscar
      if (user?.refeitorioId) {
        try {
          const response = await axios.get(`${API_BASE_URL}/refeitorios/${user.refeitorioId}`);
          if (response.data?.name) {
            setRefeitorioName(response.data.name);
          }
        } catch (err) {
          console.error("Erro ao buscar nome do refeitório:", err);
        }
      }
    };

    if (user) {
      fetchRefeitorioName();
    }
  }, [user?.refeitorioId, user?.refeitorio?.name, user]);

  const handleConfirm = async () => {
    if (!state.mealId || !user?.id) {
      setError("Dados insuficientes para reservar.");
      return;
    }

    if (mealQuantity < 1) {
      setError("Quantidade inválida.");
      return;
    }

    setError(null);
    setLoading(true);
    
    try {
      // Usar o refeitorioId do utilizador, não da meal
      if (!user?.refeitorioId) {
        setError("Erro: Utilizador não tem refeitório associado.");
        setLoading(false);
        return;
      }

      await reservationService.createReservation({
        status: "active",
        reservationDate: new Date(),
        quantity: mealQuantity,
        mealId: state.mealId,
        userId: user.id,
        refeitorioId: user.refeitorioId, // Usar o refeitorioId do utilizador
      });
      
      setSuccess(true);
      alert("Reserva confirmada!");
      navigate("/weekmenu");
    } catch (err) {
      console.error("Erro ao criar reserva:", err);
      setError("Não foi possível criar a reserva. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = useLogout();

  return (
    <div style={reservationStyles.pageContainer}>
      <header style={reservationStyles.header}>
        <div style={reservationStyles.headerLeft}>
          <button
            style={reservationStyles.backButton}
            onClick={() => navigate(-1)}
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </button>
          <div style={reservationStyles.headerText}>
            <h1 style={reservationStyles.headerTitle}>Reserva</h1>
            <p style={reservationStyles.headerSubtitle}>Confirme os detalhes antes de prosseguir.</p>
          </div>
        </div>
        <div style={reservationStyles.headerActions}>
          <button style={reservationStyles.iconButton} aria-label="Notificações">
            <Bell size={20} />
          </button>
          <button
            style={reservationStyles.iconButton}
            aria-label="Sair"
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main style={reservationStyles.mainContent}>
        <div style={reservationStyles.card}>
          <h2 style={reservationStyles.cardTitle}>Resumo da Reserva</h2>
          <div style={reservationStyles.row}>
            <span>Prato</span>
            <span style={reservationStyles.valueStrong}>{mealName}</span>
          </div>
          <div style={reservationStyles.row}>
            <span>Data</span>
            <span style={reservationStyles.valueStrong}>{mealDate}</span>
          </div>
          <div style={reservationStyles.row}>
            <span>Tipo</span>
            <span style={reservationStyles.valueStrong}>{mealType}</span>
          </div>
          <div style={reservationStyles.row}>
            <span>Quantidade</span>
            <span style={reservationStyles.valueStrong}>{mealQuantity}</span>
          </div>
          {refeitorioName && (
            <div style={reservationStyles.row}>
              <span>Refeitório:</span>
              <span style={reservationStyles.valueStrong}>{refeitorioName}</span>
            </div>
          )}
          {error && <p style={{ color: "#b91c1c", margin: 0 }}>{error}</p>}
          {success ? (
            <span style={{ color: "#166534", fontWeight: 700 }}>Reservada</span>
          ) : (
            <button
              style={reservationStyles.confirmButton}
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "A confirmar..." : "Confirmar Pedido"}
            </button>
          )}
        </div>

        <p style={reservationStyles.notice}>
          Política de Cancelamento: gratuita até ao dia anterior; no próprio dia sujeita a condições
          internas. Este protótipo não está a cobrar valores, apenas demonstra o fluxo de reserva.
        </p>
      </main>
    </div>
  );
}


