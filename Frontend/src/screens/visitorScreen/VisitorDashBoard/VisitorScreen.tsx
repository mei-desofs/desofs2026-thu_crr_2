import { useLogout } from "../../../util/useLogout";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bell, LogOut, Newspaper, Leaf, CheckCircle2, XCircle, Clock, FileCheck } from 'lucide-react';
import { visitorStyles } from './VisitorScreen.styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { applicationService } from '../../../services/applicationService';
import type { Application } from '../../../models/Application';

export default function VisitorDashboard() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const [currentApplication, setCurrentApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applications = await applicationService.listApplications();
        const userApplication = applications.find(app => app.userId === user?.id);
        setCurrentApplication(userApplication || null);
      } catch (error) {
        console.error('Erro ao carregar candidaturas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchApplications();
    }
  }, [user?.id]);

  const handleLogout = useLogout();

  // Define se a candidatura pode ser editada
  const canEditApplication = (application: Application | null) => {
    if (!application) return false;
    return application.status === 'submitted';
  };

  const handleSendOrEditApplication = () => {
    if (!currentApplication || canEditApplication(currentApplication)) {
      navigate('/application'); // Navega para criar ou editar
    }
  };

  const getStepStatus = (currentStatus: string, stepStatus: string) => {
    const statusOrder = ['submitted', 'under_review', 'approved'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (currentStatus === 'rejected' || currentStatus === 'cancelled') {
      if (stepStatus === currentStatus) return 'error';
      if (stepIndex < statusOrder.indexOf('under_review')) return 'completed';
      return 'pending';
    }

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'pending';
  };

  const renderApplicationFlow = () => {
    if (!currentApplication) return null;

    const status = currentApplication.status;
    const steps = [
      { key: 'submitted', label: 'Submetida', icon: FileCheck },
      { key: 'under_review', label: 'Em Análise', icon: Clock },
      { key: 'approved', label: 'Resultado', icon: CheckCircle2 },
    ];

    if (status === 'rejected' || status === 'cancelled') {
      steps[2] = {
        key: status,
        label: status === 'rejected' ? 'Rejeitada' : 'Cancelada',
        icon: XCircle
      };
    }

    return (
      <div style={visitorStyles.flowContainer}>
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(status, step.key);
          const Icon = step.icon;

          return (
            <div key={step.key} style={visitorStyles.flowStepWrapper}>
              <div style={visitorStyles.flowStep}>
                <div style={
                  stepStatus === 'completed' ? visitorStyles.flowIconCompleted :
                  stepStatus === 'current' ? visitorStyles.flowIconCurrent :
                  stepStatus === 'error' ? visitorStyles.flowIconError :
                  visitorStyles.flowIconPending
                }>
                  <Icon size={20} />
                </div>
                <span style={
                  stepStatus === 'current' ? visitorStyles.flowLabelCurrent :
                  stepStatus === 'error' ? visitorStyles.flowLabelError :
                  visitorStyles.flowLabel
                }>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div style={
                  stepStatus === 'completed' ? visitorStyles.flowLineCompleted :
                  visitorStyles.flowLinePending
                } />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={visitorStyles.pageContainer}>
      {/* Header */}
      <header style={visitorStyles.header}>
        <div style={visitorStyles.headerLeft}>
          <div style={visitorStyles.logoCircle()}>
            <Leaf size={visitorStyles.logoIcon()} color='#16a34a' />
          </div>
          <div style={visitorStyles.headerInfo}>
            <h1 style={visitorStyles.headerTitle}>BioCantinas</h1>
            <p style={visitorStyles.headerSubtitle}>{user?.name}</p>
          </div>
        </div>
        <div style={visitorStyles.headerActions}>
          <button style={visitorStyles.iconButton}>
            <Bell size={20} />
          </button>
          <button style={visitorStyles.iconButton} onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={visitorStyles.mainContent}>
        <div style={visitorStyles.welcomeSection}>
          <h2 style={visitorStyles.welcomeTitle}>Bem-vindo, {user?.name}</h2>
          <p style={visitorStyles.welcomeDescription}>
            Envie ou edite a sua candidatura para se tornar um fornecedor aprovado na nossa plataforma e acompanhe o estado da sua candidatura.
          </p>
        </div>

        {!loading && currentApplication && (
          <div style={visitorStyles.infoArea}>
            <div style={visitorStyles.infoAreaHeader}>
              <h3 style={visitorStyles.infoAreaTitle}>Estado da Candidatura</h3>
              <span style={visitorStyles.infoAreaDate}>
                Submetida em {new Date(currentApplication.applicationDate).toLocaleDateString('pt-PT')}
              </span>
            </div>
            {renderApplicationFlow()}
          </div>
        )}

        {/* Enviar / Editar Candidatura Card */}
        <div
          style={
            !currentApplication || canEditApplication(currentApplication) 
              ? visitorStyles.card 
              : visitorStyles.cardDisabled
          }
          onClick={handleSendOrEditApplication}
        >
          <div style={visitorStyles.cardIcon}>
            <Newspaper size={32} color="#16a34a" />
          </div>
          <div style={visitorStyles.cardContent}>
            <h3 style={visitorStyles.cardTitle}>
              {!currentApplication
                ? 'Enviar Candidatura'
                : canEditApplication(currentApplication)
                ? 'Editar Candidatura'
                : 'Candidatura Já Enviada'
              }
            </h3>
            <p style={visitorStyles.cardDescription}>
              {!currentApplication
                ? 'Envie uma candidatura para se tornar um fornecedor aprovado na nossa plataforma.'
                : canEditApplication(currentApplication)
                ? 'A sua candidatura foi submetida. Pode editá-la enquanto não entra no processo de análise.'
                : 'Você já possui uma candidatura em andamento. Aguarde o resultado da análise.'
              }
            </p>
          </div>
          <div style={visitorStyles.cardArrow}>›</div>
        </div>
      </main>
    </div>
  );
}
