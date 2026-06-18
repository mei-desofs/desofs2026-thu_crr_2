import Login from "./screens/loginScreen/login";
import NetworkDashboard from "./screens/networkScreen/networkDashboard/NetworkScreen";
import NutritionistDashboard from "./screens/nutritionistScreen/NutritionistDashBoard/NutritionistScreen";
import StudentDashboard from "./screens/studentScreen/StudentScreen";
import NursingHomeDashboard from "./screens/nursingHomeScreen/NursingHomeScreen";
import RefectoryStaffDashboard from "./screens/canteenStaffScreen/CanteenStaffScreen";
import WeekMenuScreen from "./screens/studentScreen/WeekMenuScreen";
import ReservationScreen from "./screens/studentScreen/ReservationScreen";
import ReservationsViewScreen from "./screens/canteenStaffScreen/ReservationsViewScreen";
import ApplicationForm from "./screens/visitorScreen/applicationScreen/ApplicationScreen";
import VisitorDashboard from "./screens/visitorScreen/VisitorDashBoard/VisitorScreen";
import MenuDashboard from "./screens/nutritionistScreen/createMenuScreen/createMenuScreen";
import SuppliersScreen from "./screens/networkScreen/supplierListScreen/SuppliersList";
import ParishesScreen from "./screens/networkScreen/parishListScreen/ParishesList";
import ApplicationEvaluationScreen from "./screens/networkScreen/applicationEvaluation/ApplicationEvaluationScreen";
import PerformanceScreen from "./screens/networkScreen/performanceScreen/PerformanceScreen";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute, { GuestRoute } from "./util/ProtectedRoutes";
import { routeAccess } from "./config/routeAccess";
import StatisticsDashboard from "./screens/statistics/dashboard/Statistics";
import BioPercentageScreen from "./screens/statistics/bioPercentage/BioPercentage";
import WastePercentageScreen from "./screens/statistics/wastePercentage/WastePercentageScreen";
import SupplierDashboard from "./screens/supplierScreen/SupplierDashBoard/SupplierScreen";
import StockManagerDashboard from "./screens/StockManagerScreen/StockManagerDashBoard/StockManagerScreen";
import SupplierOrders from "./screens/supplierScreen/EncomendasScreen/SupplierOrders";
import StockManagerOrders from "./screens/StockManagerScreen/StockManagerOrdersScreen/StockManagerOrders";
import CanteenManagerDashboard from "./screens/canteenManagerScreen/canteenManagerDashBoard/canteenManagerScreen";
import SuppliersList from "./screens/canteenManagerScreen/supplierListScreen/SuppliersList";
import ParishesList from "./screens/canteenManagerScreen/parishListScreen/ParishesList";
import RefectoryManagerDashboard from "./screens/refectoryManagerScreen/RefectoryManagerScreen";
import CanteenStatisticsScreen from "./screens/canteenManagerScreen/statisticsScreen/CanteenStatisticsScreen";
import NetworkCanteenStatisticsScreen from "./screens/networkScreen/canteenStatisticsScreen/NetworkCanteenStatisticsScreen";
import NetworkRefectoryStatisticsScreen from "./screens/networkScreen/refectoryStatisticsScreen/NetworkRefectoryStatisticsScreen";
import NetworkProducerStatisticsScreen from "./screens/networkScreen/producerStatisticsScreen/NetworkProducerStatisticsScreen";
import type { ReactNode } from "react";

/** Screen registry — path must exist in config/routeAccess.ts */
const screens: Record<string, ReactNode> = {
  "/supplier-dashboard": <SupplierDashboard />,
  "/network-dashboard": <NetworkDashboard />,
  "/suppliers-list": <SuppliersScreen />,
  "/parishes-list": <ParishesScreen />,
  "/application-evaluation": <ApplicationEvaluationScreen />,
  "/performance": <PerformanceScreen />,
  "/nutritionist-dashboard": <NutritionistDashboard />,
  "/stockmanager-dashboard": <StockManagerDashboard />,
  "/create-menu": <MenuDashboard />,
  "/student-dashboard": <StudentDashboard />,
  "/nursinghome-dashboard": <NursingHomeDashboard />,
  "/refectorystaff-dashboard": <RefectoryStaffDashboard />,
  "/weekmenu": <WeekMenuScreen />,
  "/reservation": <ReservationScreen />,
  "/reservations-view": <ReservationsViewScreen />,
  "/statistics-dashboard": <StatisticsDashboard />,
  "/bioPercentage-screen": <BioPercentageScreen />,
  "/waste-percentage-screen": <WastePercentageScreen />,
  "/orders": <SupplierOrders />,
  "/sm-orders": <StockManagerOrders />,
  "/canteenmanager-dashboard": <CanteenManagerDashboard />,
  "/suppliers-list-cm": <SuppliersList />,
  "/parishes-list-cm": <ParishesList />,
  "/canteen-statistics": <CanteenStatisticsScreen />,
  "/refectorymanager-dashboard": <RefectoryManagerDashboard />,
  "/network-canteen-statistics": <NetworkCanteenStatisticsScreen />,
  "/network-refectory-statistics": <NetworkRefectoryStatisticsScreen />,
  "/network-producer-statistics": <NetworkProducerStatisticsScreen />,
  "/application": <ApplicationForm />,
  "/visitor-dashboard": <VisitorDashboard />,
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {Object.entries(routeAccess).map(([path, allowedRoles]) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute allowedRoles={allowedRoles}>
                {screens[path]}
              </ProtectedRoute>
            }
          />
        ))}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
