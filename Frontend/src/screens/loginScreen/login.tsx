/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { User, Lock, Leaf } from "lucide-react";
import { loginStyles } from "./login.styles";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { getDashboardPathForRole } from "../../config/roles";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
 const handleSubmit = async () => {
  setError("");
  setLoading(true);

  try {
    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    // Faz login e recebe o utilizador
    const user = await authService.login(username, password);
    dispatch(login(user));
    navigate(getDashboardPathForRole(user.role));
  } catch (err: any) {
    setError(err.response?.data?.message || "Erro ao fazer login. Tente novamente.");
  } finally {
    setLoading(false);
  }
};

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.wrapper}>
        <div style={loginStyles.card()}>
          {/* Logo e título */}
          <div style={loginStyles.logoWrapper}>
            <div style={loginStyles.logoCircle()}>
              <Leaf size={loginStyles.logoIcon()} color="white" />
            </div>
            <h1 style={loginStyles.title()}>
              BioCantinas
            </h1>
            <p style={loginStyles.subtitle}>
              Aceda à sua conta
            </p>
          </div>

          {/* Formulário */}
          <div style={loginStyles.form}>
            {/* Username */}
            <div>
              <label htmlFor="username" style={loginStyles.label}>
                Nome de utilizador
              </label>
              <div style={loginStyles.inputWrapper}>
                <div style={loginStyles.iconWrapper}>
                  <User size={loginStyles.iconSize} color={loginStyles.iconColor} />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite o seu nome de utilizador"
                  style={loginStyles.input}
                  onFocus={(e) => {
                    Object.assign(e.target.style, loginStyles.inputFocus);
                  }}
                  onBlur={(e) => {
                    Object.assign(e.target.style, loginStyles.inputBlur);
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={loginStyles.label}>
                Palavra-passe
              </label>
              <div style={loginStyles.inputWrapper}>
                <div style={loginStyles.iconWrapper}>
                  <Lock size={loginStyles.iconSize} color={loginStyles.iconColor} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite a sua palavra-passe"
                  style={loginStyles.input}
                  onFocus={(e) => {
                    Object.assign(e.target.style, loginStyles.inputFocus);
                  }}
                  onBlur={(e) => {
                    Object.assign(e.target.style, loginStyles.inputBlur);
                  }}
                />
              </div>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div style={loginStyles.errorMessage}>
                {error}
              </div>
            )}

            {/* Botão Entrar */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={loginStyles.submitButton(loading)}
              onMouseEnter={(e) => {
                if (!loading) {
                  Object.assign(e.currentTarget.style, loginStyles.submitButtonHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#16a34a';
                }
              }}
            >
              {loading ? "A entrar..." : "Entrar"}
            </button>
          </div>

          {/* Footer */}
          <div style={loginStyles.footer}>
            <button
              onClick={() => alert("Funcionalidade em desenvolvimento")}
              style={loginStyles.footerButton}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, loginStyles.footerButtonHover);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#16a34a';
              }}
            >
              Esqueceu-se da palavra-passe?
            </button>
            <div style={loginStyles.footerDivider}>
              <button
                onClick={() => alert("Funcionalidade em desenvolvimento")}
                style={loginStyles.footerButton}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, loginStyles.footerButtonHover);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#16a34a';
                }}
              >
                Criar nova conta
              </button>
            </div>
          </div>
        </div>

        <p style={loginStyles.copyright}>
          © 2024 BioCantinas. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}