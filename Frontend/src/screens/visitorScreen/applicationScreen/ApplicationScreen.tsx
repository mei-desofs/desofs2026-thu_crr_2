/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Upload, Bell, LogOut, Leaf, Plus, Trash2 } from "lucide-react";
import { ApplicationStyles } from "./ApplicationScreen.styles";
import { useSelector } from "react-redux";
import { UnitEnum, PartialUnitEnum } from "../../../models/Unit";
import { productService } from "../../../services/productService";
import type { Application } from "../../../models/Application";
import { applicationService } from "../../../services/applicationService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { FREGUESIAS } from "../../../models/FreguesiasByMunicipio";
import { MUNICIPIOS } from "../../../models/Municipios";

import Select from "react-select";

const API_URL = `${API_BASE_URL}/applications`;

interface Product {
  id: number;
  name: string;
}

interface ProductEntry {
  productId: number;
  quantity: number;
  unit: UnitEnum;
  weeks: number[];
  weeksExpanded?: boolean;
}

// Utility to generate week date ranges
const getWeekDateRange = (weekNumber: number, year: number = 2025): string => {
  const firstDayOfYear = new Date(year, 0, 1);
  const daysOffset = (weekNumber - 1) * 7;
  const startDate = new Date(
    firstDayOfYear.getTime() + daysOffset * 24 * 60 * 60 * 1000
  );
  const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);

  const formatDate = (date: Date) => `${date.getDate()}/${date.getMonth() + 1}`;
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export default function ApplicationForm() {
  const user = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();

  const [currentApplication, setCurrentApplication] =
    useState<Application | null>(null);

    const selectFreguesiaRef = useRef(null);
    const selectMunicipioRef = useRef(null);

  // Form state
  const [nome, setNome] = useState(user?.name || "");
  const [localizacao, setLocalizacao] = useState("");
  const [selectedFreguesia, setSelectedFreguesia] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [businessEmail, setBusinessEmail] = useState(user?.email || "");
  const [businessPhone, setBusinessPhone] = useState(user?.phone || "");
  const [supplierComment, setSupplierComment] = useState("");
  const [documentos, setDocumentos] = useState<File[]>([]);
  const [productEntries, setProductEntries] = useState<ProductEntry[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [errors, setErrors] = useState({
    nome: false,
    localizacao: false,
    selectedFreguesia: false,
    selectedMunicipio: false,
    businessEmail: false,
    businessPhone: false,
    documentos: false,
    farmerProducts: false,
  });

  const unitLabelsPT: Record<UnitEnum, string> = {
    g: "Gramas",
    kg: "Quilogramas",
    L: "Litros",
    mL: "Mililitros",
    unit: "Unidades",
  };

  // Fetch available products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productService.listProducts();
        setAvailableProducts(products);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch existing application
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const applications = await applicationService.listApplications();
        const userApp = applications.find(
          (app: Application) => app.userId === user?.id
        );
        if (userApp) {
          console.log("application to edit", userApp);
          setCurrentApplication(userApp);
        }
      } catch (error) {
        console.error("Erro ao carregar candidatura:", error);
      }
    };
    if (user?.id) fetchApplication();
  }, [user?.id]);

  // Fill form if there is an existing application
  useEffect(() => {
    if (currentApplication) {
      setNome(currentApplication.name || "");
      setLocalizacao(currentApplication.location || "");
      setSelectedFreguesia(currentApplication.freguesia || "");
      setSelectedMunicipio(currentApplication.municipio || "");
      setBusinessEmail(currentApplication.businessEmail || "");
      setBusinessPhone(currentApplication.businessPhone || "");
      setSupplierComment(currentApplication.supplierComment || "");

      // Handle documents
      if (
        currentApplication.documentsSubmitted &&
        Array.isArray(currentApplication.documentsSubmitted)
      ) {
        setDocumentos(
          currentApplication.documentsSubmitted.map((f) => new File([], f))
        );
      }

      // Convert farmerProducts back to ProductEntry format
      if (
        currentApplication.farmerProducts &&
        Array.isArray(currentApplication.farmerProducts)
      ) {
        const productMap = new Map<string, ProductEntry>();

        currentApplication.farmerProducts.forEach((item: any) => {
          const key = `${item.productId}-${item.quantity}-${item.unit}`;

          if (!productMap.has(key)) {
            productMap.set(key, {
              productId: item.productId,
              quantity: item.quantity,
              unit: item.unit,
              weeks: [item.week],
              weeksExpanded: false,
            });
          } else {
            productMap.get(key)!.weeks.push(item.week);
          }
        });

        // Ordenar semanas de cada entry
        const entries = Array.from(productMap.values()).map((e) => ({
          ...e,
          weeks: e.weeks.sort((a, b) => a - b),
        }));

        setProductEntries(entries);
      }
    }
  }, [currentApplication]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setDocumentos((prev) => [...prev, ...Array.from(files as FileList)]);
      setErrors((prev) => ({ ...prev, documentos: false }));
    }
  };

  const removeFile = (index: number) => {
    setDocumentos((prev) => prev.filter((_, i) => i !== index));
  };

  const addProductEntry = () => {
    setProductEntries([
      ...productEntries,
      {
        productId: 0,
        quantity: 0,
        unit: "kg",
        weeks: [],
        weeksExpanded: false,
      },
    ]);
    setErrors((prev) => ({ ...prev, farmerProducts: false }));
  };

  const removeProductEntry = (index: number) => {
    setProductEntries(productEntries.filter((_, i) => i !== index));
  };

  const updateProductEntry = (
    index: number,
    field: keyof ProductEntry,
    value: any
  ) => {
    const updated = [...productEntries];
    updated[index] = { ...updated[index], [field]: value };
    setProductEntries(updated);
  };

  const toggleWeeksExpanded = (index: number) => {
    const updated = [...productEntries];
    updated[index].weeksExpanded = !updated[index].weeksExpanded;
    setProductEntries(updated);
  };

  const toggleWeekForProduct = (productIndex: number, week: number) => {
    const updated = [...productEntries];
    const weeks = updated[productIndex].weeks;
    if (weeks.includes(week)) {
      updated[productIndex].weeks = weeks.filter((w) => w !== week);
    } else {
      updated[productIndex].weeks = [...weeks, week].sort((a, b) => a - b);
    }
    setProductEntries(updated);
  };

  const toggleAllWeeksForProduct = (productIndex: number) => {
    const updated = [...productEntries];
    const currentWeeks = updated[productIndex].weeks;
    if (currentWeeks.length === 52) {
      // Se todas estão selecionadas → desmarcar todas
      updated[productIndex].weeks = [];
    } else {
      // Selecionar todas
      updated[productIndex].weeks = Array.from({ length: 52 }, (_, i) => i + 1);
    }
    setProductEntries(updated);
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[0-9+\s()-]{9,}$/.test(phone);

  const handleSubmit = async () => {
    const newErrors = {
      nome: nome.trim() === "",
      localizacao: localizacao.trim() === "",
      selectedFreguesia: selectedFreguesia.trim() === "",
      selectedMunicipio: selectedFreguesia.trim() === "",
      businessEmail: !validateEmail(businessEmail),
      businessPhone: !validatePhone(businessPhone),
      documentos: documentos.length === 0,
      farmerProducts:
        productEntries.length === 0 ||
        productEntries.some(
          (p) => p.productId === 0 || p.quantity <= 0 || p.weeks.length === 0
        ),
    };
    setErrors(newErrors);
    if (!Object.values(newErrors).every((v) => !v)) return;

    // Converter ProductEntry[] para o formato backend
    const weekMap = new Map<number, any[]>();
    productEntries.forEach((entry) => {
      entry.weeks.forEach((week) => {
        if (!weekMap.has(week)) weekMap.set(week, []);
        weekMap.get(week)!.push({
          productId: entry.productId,
          quantity: entry.quantity,
          unit: entry.unit,
        });
      });
    });
    const farmerProducts = Array.from(weekMap.entries())
      .map(([week, products]) => ({
        week,
        products,
      }))
      .sort((a, b) => a.week - b.week);

    // Criar FormData
    const formData = new FormData();
    formData.append("userId", String(user?.id));
    formData.append("businessEmail", businessEmail);
    formData.append("businessPhone", businessPhone);
    formData.append("name", nome);
    formData.append("location", localizacao);
    formData.append("freguesia", selectedFreguesia);
    formData.append("municipio", selectedMunicipio);
    formData.append("supplierComment", supplierComment);
    formData.append("farmerProducts", JSON.stringify(farmerProducts));

    // Adicionar ficheiros
    documentos.forEach((file) => formData.append("documents", file));

    try {
      if (currentApplication && currentApplication.status === "submitted") {
        if (currentApplication.id !== undefined) {
          await axios.put(`${API_URL}/${currentApplication.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          console.error("Application ID is undefined.");
        }
        alert("Candidatura atualizada com sucesso!");
      } else {
        await axios.post(`${API_URL}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Candidatura submetida com sucesso!");
      }
      navigate("/visitor-dashboard");
    } catch (error) {
      console.error("Erro ao submeter candidatura:", error);
    }
  };
  
  const municipioOptions=MUNICIPIOS.map((municipio) => ({
                value: municipio,
                label: municipio,
              }));

  let freguesiaOptions = selectedMunicipio === ""
    ? []
    : FREGUESIAS[selectedMunicipio].map(freguesia => ({ 
      value: freguesia, 
      label: freguesia }));


  return (
    <div style={ApplicationStyles.pageContainer}>
      <header style={ApplicationStyles.header}>
        <div style={ApplicationStyles.headerLeft}>
          <div style={ApplicationStyles.logoCircle()}>
            <Leaf size={ApplicationStyles.logoIcon()} color="#16a34a" />
          </div>
          <div style={ApplicationStyles.headerInfo}>
            <h1 style={ApplicationStyles.headerTitle}>BioCantinas</h1>
            <p style={ApplicationStyles.headerSubtitle}>{user?.name}</p>
          </div>
        </div>
        <div style={ApplicationStyles.headerActions}>
          <button style={ApplicationStyles.iconButton}>
            <Bell size={20} />
          </button>
          <button style={ApplicationStyles.iconButton}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main style={ApplicationStyles.mainContent}>
        <div style={ApplicationStyles.pageHeader}>
          <h2 style={ApplicationStyles.pageTitle}>Candidatura de Fornecedor</h2>
          <p style={ApplicationStyles.pageDescription}>
            Preencha o formulário para se candidatar como fornecedor da
            BioCantinas
          </p>
        </div>

        <div style={ApplicationStyles.formContainer}>
          {/* Informações Básicas */}
          <h3 style={ApplicationStyles.sectionTitle}>
            Informações Básicas<span style={ApplicationStyles.required}>*</span>
          </h3>
          <div style={ApplicationStyles.formGroup}>
            <label style={ApplicationStyles.formLabel}>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                setErrors((prev) => ({ ...prev, nome: false }));
              }}
              placeholder="Digite o seu nome ou o nome da sua quinta"
              style={{
                ...ApplicationStyles.formInput,
                ...(errors.nome ? ApplicationStyles.inputError : {}),
              }}
            />
            {errors.nome && (
              <p style={ApplicationStyles.errorMessage}>O nome é obrigatório</p>
            )}
          </div>




          <div style={ApplicationStyles.formGroup}>
            <label style={ApplicationStyles.formLabel}>Município</label>
            <Select
              ref={selectMunicipioRef}
              options={municipioOptions}
              value={ selectedMunicipio
                ? municipioOptions.find(o => o.value === selectedMunicipio)
                : null
              }
              isSearchable
              isClearable
              placeholder="Selecione ou escreva o nome do municipio"
              onChange={(choice) => {
                setSelectedMunicipio(choice?.value || "");
                setSelectedFreguesia("");
                setErrors((prev) => ({ ...prev, selectedMunicipio: false, selectedFreguesia:false }));
                selectFreguesiaRef.current?.clearValue();
              }}
              styles={{
                control: (base, state) => ({
                  ...base,
                  ...ApplicationStyles.formInput,
                  ...(errors.selectedMunicipio
                    ? ApplicationStyles.inputError
                    : {}),
                  borderColor: errors.selectedMunicipio
                    ? ApplicationStyles.inputError?.borderColor || "red"
                    : base.borderColor,
                  boxShadow: state.isFocused ? base.boxShadow : "none",
                }),

                singleValue: (base) => ({
                  ...base,
                  color: "#111",
                }),

                input: (base) => ({
                  ...base,
                  color: "#111",
                }),

                placeholder: (base) => ({
                  ...base,
                  color: "#6b7280",
                }),

                option: (base, state) => ({
                  ...base,
                  color: "#111",
                  backgroundColor: state.isSelected
                    ? "#e5efff"
                    : state.isFocused
                    ? "#f3f4f6"
                    : "#fff",
                  cursor: "pointer",
                }),

                menu: (base) => ({
                  ...base,
                  zIndex: 9999,
                  backgroundColor: "#fff",
                }),
              }}
            ></Select>
            {errors.selectedMunicipio && (
              <p style={ApplicationStyles.errorMessage}>
                O município é obrigatório.
              </p>
            )}
          </div>

          <div style={ApplicationStyles.formGroup}>
            <label style={ApplicationStyles.formLabel}>Freguesia</label>
            <Select
            ref={selectFreguesiaRef}
              options={freguesiaOptions}
              value={
                selectedFreguesia
                  ? freguesiaOptions.find(o => o.value === selectedFreguesia)
                  : null
              }
              isSearchable
              isClearable
              isDisabled={selectedMunicipio == ""}
              placeholder="Selecione ou escreva o nome da freguesia"
              onChange={(choice) => {
                setSelectedFreguesia(choice?.value || "");
                setErrors((prev) => ({ ...prev, selectedFreguesia: false }));
              }}
              styles={{
                control: (base, state) => ({
                  ...base,
                  ...ApplicationStyles.formInput,
                  ...(errors.selectedFreguesia
                    ? ApplicationStyles.inputError
                    : {}),
                  borderColor: errors.selectedFreguesia
                    ? ApplicationStyles.inputError?.borderColor || "red"
                    : state.isDisabled
                    ? "#d0d0d0"
                    : base.borderColor,
                  boxShadow: state.isFocused ? base.boxShadow : "none",
                  opacity: state.isDisabled ? 0.7 : 1,
                }),

                singleValue: (base, state) => ({
                  ...base,
                  color: state.isDisabled ? "#7a7a7a" : "#111",
                }),

                input: (base, state) => ({
                  ...base,
                  color: state.isDisabled ? "#7a7a7a" : "#111",
                }),

                placeholder: (base, state) => ({
                  ...base,
                  color: state.isDisabled ? "#9aa0a6" : "#6b7280",
                }),

                option: (base, state) => ({
                  ...base,
                  color: "#111",
                  backgroundColor: state.isSelected
                    ? "#e5efff"
                    : state.isFocused
                    ? "#f3f4f6"
                    : "#fff",
                  cursor: "pointer",
                }),

                dropdownIndicator: (base, state) => ({
                  ...base,
                  color: state.isDisabled ? "#b0b0b0" : base.color,
                }),

                indicatorSeparator: (base, state) => ({
                  ...base,
                  backgroundColor: state.isDisabled
                    ? "#d0d0d0"
                    : base.backgroundColor,
                }),

                menu: (base) => ({
                  ...base,
                  zIndex: 9999,
                  backgroundColor: "#fff",
                }),
              }}
            ></Select>
            {errors.selectedFreguesia && (
              <p style={ApplicationStyles.errorMessage}>
                A freguesia é obrigatória.
              </p>
            )}
          </div>

          <div style={ApplicationStyles.formGroup}>
            <label style={ApplicationStyles.formLabel}>Localização</label>
            <input
              type="text"
              value={localizacao}
              onChange={(e) => {
                setLocalizacao(e.target.value);
                setErrors((prev) => ({ ...prev, localizacao: false }));
              }}
              disabled={selectedFreguesia == ""}
              placeholder="Digite a sua localização"
              style={{
                ...ApplicationStyles.formInput,
                ...(errors.localizacao ? ApplicationStyles.inputError : {}),
                ...(selectedFreguesia==""?{borderColor:"#d0d0d0", opacity: 0.7 }:{ })
              }}
            />
            {errors.localizacao && (
              <p style={ApplicationStyles.errorMessage}>
                A localização é obrigatória
              </p>
            )}
          </div>

          {/* Contactos */}
          <h3 style={ApplicationStyles.sectionTitle}>
            Contactos (Pessoais ou da Quinta)
            <span style={ApplicationStyles.required}>*</span>
          </h3>
          <div style={ApplicationStyles.formGroup}>
            <label style={ApplicationStyles.formLabel}>Email</label>
            <input
              type="email"
              value={businessEmail}
              onChange={(e) => {
                setBusinessEmail(e.target.value);
                setErrors((prev) => ({ ...prev, businessEmail: false }));
              }}
              placeholder="email@exemplo.com"
              style={{
                ...ApplicationStyles.formInput,
                ...(errors.businessEmail ? ApplicationStyles.inputError : {}),
              }}
            />
            {errors.businessEmail && (
              <p style={ApplicationStyles.errorMessage}>Email inválido</p>
            )}
          </div>

          <div style={ApplicationStyles.formGroup}>
            <label style={ApplicationStyles.formLabel}>Telefone</label>
            <input
              type="tel"
              value={businessPhone}
              onChange={(e) => {
                setBusinessPhone(e.target.value);
                setErrors((prev) => ({ ...prev, businessPhone: false }));
              }}
              placeholder="+351 912 345 678"
              style={{
                ...ApplicationStyles.formInput,
                ...(errors.businessPhone ? ApplicationStyles.inputError : {}),
              }}
            />
            {errors.businessPhone && (
              <p style={ApplicationStyles.errorMessage}>Telefone inválido</p>
            )}
          </div>

          {/* Comentário */}
          <div style={ApplicationStyles.formGroup}>
            <label style={ApplicationStyles.formLabel}>Comentário</label>
            <textarea
              value={supplierComment}
              onChange={(e) => setSupplierComment(e.target.value)}
              placeholder="Informações adicionais relevantes..."
              style={{
                ...ApplicationStyles.formInput,
                minHeight: "100px",
                resize: "vertical" as const,
              }}
            />
          </div>

          {/* Documentos */}
          <h3 style={ApplicationStyles.sectionTitle}>
            Documento<span style={ApplicationStyles.required}>*</span>
          </h3>
          <div
            style={{
              ...ApplicationStyles.uploadArea,
              ...(errors.documentos ? ApplicationStyles.uploadError : {}),
            }}
          >
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileChange}
              style={ApplicationStyles.fileInput}
            />
            <label htmlFor="file-upload" style={ApplicationStyles.uploadLabel}>
              <Upload size={40} style={ApplicationStyles.uploadIcon} />
              <p style={ApplicationStyles.uploadText}>
                Clique para adicionar documentos
              </p>
              {documentos.length > 0 && (
                <div style={ApplicationStyles.filesList}>
                  <p style={ApplicationStyles.filesTitle}>Ficheiros:</p>
                  {documentos.map((file, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: "#374151",
                        fontSize: "14px",
                      }}
                    >
                      <span>• {file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </label>
          </div>
          {errors.documentos && (
            <p style={ApplicationStyles.errorMessage}>
              Pelo menos um documento é obrigatório
            </p>
          )}

          {/* Produtos */}
          <h3 style={ApplicationStyles.sectionTitle}>
            Produtos Disponíveis
            <span style={ApplicationStyles.required}>*</span>
          </h3>
          <p style={ApplicationStyles.sectionDescription}>
            Selecione os produtos que pretende fornecer, a quantidade e as
            semanas em que estarão disponíveis.
          </p>

          {productEntries.map((entry, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "16px",
                backgroundColor: "#fafafa",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1f2937",
                  }}
                >
                  Produto {idx + 1}
                </h4>
                <button
                  onClick={() => removeProductEntry(idx)}
                  style={{
                    ...ApplicationStyles.deleteButton,
                    backgroundColor: "#ef4444",
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    window.innerWidth < 640 ? "1fr" : "2fr 1fr 1fr",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label style={ApplicationStyles.formLabel}>Produto</label>
                  <select
                    value={entry.productId}
                    onChange={(e) =>
                      updateProductEntry(
                        idx,
                        "productId",
                        Number(e.target.value)
                      )
                    }
                    style={ApplicationStyles.productSelect}
                  >
                    <option value={0}>Selecione um produto</option>
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={ApplicationStyles.formLabel}>Quantidade</label>
                  <input
                    type="number"
                    min="0"
                    value={entry.quantity}
                    onChange={(e) =>
                      updateProductEntry(
                        idx,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                    style={ApplicationStyles.formInput}
                    placeholder="Ex: 10"
                  />
                </div>
                <div>
                  <label style={ApplicationStyles.formLabel}>Unidade</label>
                  <select
                    value={entry.unit}
                    onChange={(e) =>
                      updateProductEntry(
                        idx,
                        "unit",
                        e.target.value as UnitEnum
                      )
                    }
                    style={ApplicationStyles.productSelect}
                  >
                    {Object.values(PartialUnitEnum).map((unit) => (
                      <option key={unit} value={unit}>
                        {unitLabelsPT[unit]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div
                  onClick={() => toggleWeeksExpanded(idx)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: "1px solid #e5e7eb",
                    marginBottom: entry.weeksExpanded ? "12px" : "0",
                  }}
                >
                  <label
                    style={{
                      ...ApplicationStyles.formLabel,
                      marginBottom: "0",
                      cursor: "pointer",
                    }}
                  >
                    Semanas Disponíveis ({entry.weeks.length} selecionada
                    {entry.weeks.length !== 1 ? "s" : ""})
                  </label>
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#6b7280",
                      transition: "transform 0.2s",
                      transform: entry.weeksExpanded
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      display: "inline-block",
                    }}
                  >
                    ▼
                  </span>
                </div>

                {!entry.weeksExpanded && entry.weeks.length > 0 && (
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#f9fafb",
                      borderRadius: "8px",
                      marginTop: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                      }}
                    >
                      {entry.weeks.map((week) => (
                        <span
                          key={week}
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            backgroundColor: "#dcfce7",
                            color: "#166534",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "500",
                            border: "1px solid #16a34a",
                          }}
                        >
                          Sem. {week} ({getWeekDateRange(week)})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {entry.weeksExpanded && (
                  <div
                    style={{
                      maxHeight: "250px",
                      overflowY: "auto",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "8px",
                      backgroundColor: "white",
                    }}
                  >
                    {/* Botão Selecionar Todas */}
                    <button
                      onClick={() => toggleAllWeeksForProduct(idx)}
                      style={{
                        marginBottom: "8px",
                        padding: "6px 12px",
                        backgroundColor: "#d7dad8ff",
                        color: "black",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      {entry.weeks.length === 52
                        ? "Desmarcar Todas"
                        : "Selecionar Todas"}
                    </button>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(160px, 1fr))",
                        gap: "8px",
                      }}
                    >
                      {Array.from({ length: 52 }, (_, i) => i + 1).map(
                        (week) => (
                          <label
                            key={week}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "8px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              backgroundColor: entry.weeks.includes(week)
                                ? "#dcfce7"
                                : "transparent",
                              border: entry.weeks.includes(week)
                                ? "1px solid #16a34a"
                                : "1px solid transparent",
                              transition: "all 0.2s",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={entry.weeks.includes(week)}
                              onChange={() => toggleWeekForProduct(idx, week)}
                              style={{ marginRight: "8px", cursor: "pointer" }}
                            />
                            <span
                              style={{
                                fontSize: "13px",
                                color: "#374151",
                                lineHeight: "1.3",
                              }}
                            >
                              <strong>Sem. {week}</strong>
                              <br />
                              <span
                                style={{ fontSize: "11px", color: "#6b7280" }}
                              >
                                {getWeekDateRange(week)}
                              </span>
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={addProductEntry}
            style={{
              ...ApplicationStyles.addButton,
              width: "100%",
              justifyContent: "center",
              padding: "12px",
            }}
          >
            <Plus size={18} /> Adicionar Produto
          </button>

          {errors.farmerProducts && (
            <p style={ApplicationStyles.errorMessage}>
              Adicione pelo menos um produto válido com quantidade e semanas
              selecionadas
            </p>
          )}

          {/* Actions */}
          <div style={ApplicationStyles.formActions}>
            <button
              onClick={() => navigate("/visitor-dashboard")}
              style={ApplicationStyles.btnSecondary}
            >
              Cancelar
            </button>
            <button onClick={handleSubmit} style={ApplicationStyles.btnPrimary}>
              {currentApplication && currentApplication.status === "submitted"
                ? "Editar Candidatura"
                : "Submeter Candidatura"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
