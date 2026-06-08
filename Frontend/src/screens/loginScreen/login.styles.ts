// src/screens/Login/login.styles.ts

const isMobile = () => window.innerWidth < 640;

export const loginStyles = {
  // Container principal
  container: {
    minHeight: '100vh',
    height: 'auto',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #d4f1d4 0%, #e8f5e9 50%, #b2dfdb 100%)',
    margin: 0,
    padding: '20px',
    boxSizing: 'border-box' as const,
    overflow: 'auto'
  },

  // Wrapper do card
  wrapper: {
    width: '100%',
    maxWidth: '420px',
    margin: '0 auto'
  },

  // Card principal
  card: () => ({
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    padding: isMobile() ? '24px' : '40px',
    boxSizing: 'border-box' as const
  }),

  // Logo e título
  logoWrapper: {
    textAlign: 'center' as const,
    marginBottom: '32px'
  },

  logoCircle: () => ({
    backgroundColor: '#16a34a',
    borderRadius: '50%',
    width: isMobile() ? '64px' : '80px',
    height: isMobile() ? '64px' : '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px'
  }),

  logoIcon: () => isMobile() ? 32 : 40,

  title: () => ({
    fontSize: isMobile() ? '24px' : '32px',
    fontWeight: 'bold' as const,
    color: '#1f2937',
    margin: '0 0 8px 0'
  }),

  subtitle: {
    color: '#6b7280',
    margin: 0,
    fontSize: '14px'
  },

  // Formulário
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
  },

  // Labels
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500' as const,
    color: '#374151',
    marginBottom: '8px'
  },

  // Input wrapper
  inputWrapper: {
    position: 'relative' as const
  },

  // Ícone dentro do input
  iconWrapper: {
    position: 'absolute' as const,
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none' as const
  },

  iconSize: 20,
  iconColor: '#9ca3af',

  // Input base
  input: {
    width: '100%',
    padding: '12px 12px 12px 42px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#f9fafb',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box' as const,
    color: '#1f2937',
  },

  // Input focus states
  inputFocus: {
    borderColor: '#16a34a',
    boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)'
  },

  inputBlur: {
    borderColor: '#d1d5db',
    boxShadow: 'none'
  },

  // Mensagem de erro
  errorMessage: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px'
  },

  // Botão submit
  submitButton: (loading: boolean) => ({
    width: '100%',
    backgroundColor: loading ? '#9ca3af' : '#16a34a',
    color: 'white',
    fontWeight: '600' as const,
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontSize: '16px',
    transition: 'all 0.2s',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }),

  submitButtonHover: {
    backgroundColor: '#15803d'
  },

  // Footer
  footer: {
    marginTop: '24px',
    textAlign: 'center' as const
  },

  footerButton: {
    color: '#16a34a',
    fontSize: '14px',
    fontWeight: '500' as const,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s'
  },

  footerButtonHover: {
    color: '#15803d'
  },

  footerDivider: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '12px',
    marginTop: '12px'
  },

  // Copyright
  copyright: {
    textAlign: 'center' as const,
    color: '#6b7280',
    fontSize: '13px',
    marginTop: '24px'
  }
};