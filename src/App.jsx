import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BookingPage from "./pages/BookingPage";
import ContactPage from "./pages/ContactPage";
import LoginModal from "./pages/LoginModal";
import TrainCarousel from "./components/TrainCarousel";
import styles from "./styles/App.module.css";
import ProtectedRoute from "./components/ProtectedRoute";
import TrainSearchResults from "./pages/TrainSearchResults";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthState } from "./redux/auth/authSlice";
import { observeAuthState } from "./services/authService";
import TrainDetails from "./pages/TrainDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";

// Component to conditionally render content based on route
const RouteContentManager = () => {
  return (
    <div className={styles.mainContent}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <TrainCarousel />
            </>
          }
        />
        <Route path="/train-search" element={<TrainSearchResults />} />
        <Route path="/train-details/:train_number" element={<TrainDetails />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation/>} />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/my-bookings" 
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } 
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/login"
          element={
            <LoginModal
              isOpen={true}
              onClose={() => window.history.back()}
              onLogin={() => {}}
              switchToRegister={() => {}}
            />
          }
        />
      </Routes>
    </div>
  );
};

function App() {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    observeAuthState((user) => {
      dispatch(setAuthState(user));
    });
  }, [dispatch]);

  if (!isInitialized) {
    return <>Loading....</>;
  }

  return (
    <Router>
      <div className={styles.app}>
        <Navbar />
        <RouteContentManager />
        <Footer />
      </div>
    </Router>
  );
}

export default App;