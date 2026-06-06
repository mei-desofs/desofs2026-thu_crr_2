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
import ProtectedRoute from "./util/ProtectedRoutes";
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
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota padrão - redireciona para login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Página de Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboards por Role */}
        <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
        <Route path="/network-dashboard" element={<NetworkDashboard />} />
        <Route path="/suppliers-list" element={<SuppliersScreen />} />
        <Route path="/parishes-list" element={<ParishesScreen />} />
        <Route path="/application-evaluation" element={<ApplicationEvaluationScreen />} />
        <Route path="/performance" element={<PerformanceScreen />} />
        <Route path="/nutritionist-dashboard" element={<NutritionistDashboard />} />
        <Route path="/stockmanager-dashboard" element={<StockManagerDashboard />} />
        <Route path="/create-menu" element={<MenuDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/nursinghome-dashboard" element={<NursingHomeDashboard />} />
        <Route path="/refectorystaff-dashboard" element={<RefectoryStaffDashboard />} />
        <Route path="/weekmenu" element={<WeekMenuScreen />} />
        <Route path="/reservation" element={<ReservationScreen />} />
        <Route path="/reservations-view" element={<ReservationsViewScreen />} />
        <Route path="/statistics-dashboard" element={<StatisticsDashboard />} />
        <Route path="/bioPercentage-screen" element={<BioPercentageScreen />} />
        <Route path="/waste-percentage-screen" element={<WastePercentageScreen />} />
        <Route path="/orders" element={<SupplierOrders />} />
        <Route path="/sm-orders" element={<StockManagerOrders />} />
        <Route path="/canteenmanager-dashboard" element={<CanteenManagerDashboard />} />
        <Route path="/suppliers-list-cm" element={<SuppliersList />} />
        <Route path="/parishes-list-cm" element={<ParishesList />} />
        <Route path="/canteen-statistics" element={<CanteenStatisticsScreen />} />
        <Route path="/refectorymanager-dashboard" element={<RefectoryManagerDashboard />} />
        <Route path="/network-canteen-statistics" element={<NetworkCanteenStatisticsScreen />} />
        <Route path="/network-refectory-statistics" element={<NetworkRefectoryStatisticsScreen />} />
        <Route path="/network-producer-statistics" element={<NetworkProducerStatisticsScreen />} />
         {/* Rota protegida para visitor */}
        <Route
          path="/application"
          element={
            <ProtectedRoute allowedRoles={["Visitor"]}>
              <ApplicationForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/visitor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Visitor"]}>
              <VisitorDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
