import React, { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  Video,
  Users,
  ShoppingBag,
  LogOut,
  Check,
  ArrowLeft,
  MessageSquare,
  User,
  Calendar,
  Phone,
  Search,
  ShieldCheck,
  DollarSign,
  X,
  CheckCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Clock,
  Package,
  Plus,
  Trash2,
  PencilLine,
  BookOpen,
  Globe,
  Truck,
  Download,
  UserCheck,
  Activity,
  Menu,
  Send,
} from "lucide-react";
import { getDashboardStats } from "../services/adminService.js";
import {
  getAllSubscribers,
  getSubscriberStats,
  exportSubscribersCSV,
} from "../services/subscriberService.js";
import {
  getAllConsultationsAdmin,
  updateConsultationStatusAdmin,
  sendVideoLinkAdmin,
} from "../services/consultationService.js";
import {
  getAllRegistrationsAdmin,
  getAllSeminarsAdmin,
  createSeminarAdmin,
  updateSeminarAdmin,
  deleteSeminarAdmin,
} from "../services/seminarService.js";
import {
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  addTrackingInfoAdmin,
} from "../services/orderService.js";
import {
  getAllProductsAdmin,
  updateProductAdmin,
  createProductAdmin,
  deleteProductAdmin,
} from "../services/productService.js";

// ─────────────────────────────────────────────────────────────────────────────
//  Helper: empty product form state
// ─────────────────────────────────────────────────────────────────────────────
const emptyProductForm = () => ({
  name: "",
  description: "",
  image: "",
  active: true,
  packs: [{ weight: 100, price: 0 }],
  ingredients: [""],
  benefits: [""],
});

const emptySeminarForm = () => ({
  topic: "",
  date: "",
  time: "",
  language: "Hindi / Gujarati",
  seminarLink: "",
  totalSeats: 100,
});

// ─────────────────────────────────────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────────────────────────────────────
const AdminDashboard = ({ onLogout, onBackToSite }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [stats, setStats] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [allSeminars, setAllSeminars] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [subStats, setSubStats] = useState(null);

  // Loading states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingConsultations, setLoadingConsultations] = useState(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingSeminars, setLoadingSeminars] = useState(true);
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);

  // Action feedback
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Seminar sub-tab
  const [seminarSubTab, setSeminarSubTab] = useState("manage");

  // Seminar modal
  const [seminarModal, setSeminarModal] = useState(null);
  const [seminarForm, setSeminarForm] = useState(emptySeminarForm());
  const [savingSeminar, setSavingSeminar] = useState(false);
  const [deleteSeminarTarget, setDeleteSeminarTarget] = useState(null);
  const [deletingSeminar, setDeletingSeminar] = useState(false);

  // Product modal — shared for Add & Edit
  const [productModal, setProductModal] = useState(null); // null | 'add' | 'edit'
  const [productForm, setProductForm] = useState(emptyProductForm());
  const [savingProduct, setSavingProduct] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null); // product object
  const [deletingProduct, setDeletingProduct] = useState(false);

  // Video link modal
  const [videoLinkModal, setVideoLinkModal] = useState(null);
  const [videoLinkInput, setVideoLinkInput] = useState("");
  const [videoLinkLoading, setVideoLinkLoading] = useState(false);

  // Tracking modal
  const [trackingModal, setTrackingModal] = useState(null); // order object
  const [trackingId, setTrackingId] = useState("");
  const [savingTracking, setSavingTracking] = useState(false);

  // ─── Data fetchers ─────────────────────────────────────────────────────────

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      setStats(await getDashboardStats());
    } catch {
      /* silent */
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchConsultations = useCallback(async () => {
    setLoadingConsultations(true);
    try {
      setConsultations(await getAllConsultationsAdmin());
    } catch {
      setConsultations([]);
    } finally {
      setLoadingConsultations(false);
    }
  }, []);

  const fetchRegistrations = useCallback(async () => {
    setLoadingRegistrations(true);
    try {
      setRegistrations(await getAllRegistrationsAdmin());
    } catch {
      setRegistrations([]);
    } finally {
      setLoadingRegistrations(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      setProducts(await getAllProductsAdmin());
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      setOrders(await getAllOrdersAdmin());
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  const fetchAllSeminars = useCallback(async () => {
    setLoadingSeminars(true);
    try {
      setAllSeminars(await getAllSeminarsAdmin());
    } catch {
      setAllSeminars([]);
    } finally {
      setLoadingSeminars(false);
    }
  }, []);

  const fetchSubscribers = useCallback(async () => {
    setLoadingSubscribers(true);
    try {
      const [list, stats] = await Promise.all([
        getAllSubscribers(),
        getSubscriberStats(),
      ]);
      setSubscribers(list || []);
      setSubStats(stats || null);
    } catch {
      setSubscribers([]);
    } finally {
      setLoadingSubscribers(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchConsultations();
    fetchRegistrations();
    fetchProducts();
    fetchOrders();
    fetchAllSeminars();
    fetchSubscribers();
  }, [
    fetchStats,
    fetchConsultations,
    fetchRegistrations,
    fetchProducts,
    fetchOrders,
    fetchAllSeminars,
    fetchSubscribers,
  ]);

  // ─── Feedback helpers ──────────────────────────────────────────────────────

  const showSuccess = (msg) => {
    setActionSuccess(msg);
    setActionError("");
    setTimeout(() => setActionSuccess(""), 3000);
  };

  const showError = (msg) => {
    setActionError(msg);
    setActionSuccess("");
  };

  // ─── Consultation actions ──────────────────────────────────────────────────

  const handleUpdateConsultationStatus = async (id, status) => {
    try {
      const updated = await updateConsultationStatusAdmin(id, status);
      setConsultations((prev) => prev.map((c) => (c.id === id ? updated : c)));
      showSuccess(`Consultation status updated to ${status}.`);
      fetchStats();
    } catch (err) {
      showError(err.message || "Failed to update status.");
    }
  };

  const handleSendVideoLink = async () => {
    if (!videoLinkInput.trim()) return;
    setVideoLinkLoading(true);
    try {
      const updated = await sendVideoLinkAdmin(
        videoLinkModal.id,
        videoLinkInput.trim(),
      );
      setConsultations((prev) =>
        prev.map((c) => (c.id === videoLinkModal.id ? updated : c)),
      );
      setVideoLinkModal(null);
      setVideoLinkInput("");
      showSuccess("Video link sent successfully.");
    } catch (err) {
      showError(err.message || "Failed to send video link.");
    } finally {
      setVideoLinkLoading(false);
    }
  };

  // ── WhatsApp helpers ───────────────────────────────────────────────────────

  // Consultation: booking received (PENDING)
  const handleWaBookingReceived = (c) => {
    const mobile = (c.mobile || "").replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello ${c.patientName}! 🙏\n\nThank you for booking a consultation at *Sutra Holistic Care*.\n\n📅 Date: ${c.consultationDate}\n⏰ Time: ${c.timeSlot}\n\nWe have received your request and our team will confirm your slot shortly. Please keep this number handy.\n\n— Dr. Keval Dankhara | Radhe Clinic`,
    );
    window.open(`https://wa.me/${mobile}?text=${msg}`, "_blank");
  };

  // Consultation: confirmed + meet link (CONFIRMED)
  const handleWhatsAppConfirm = (c) => {
    const mobile = (c.mobile || "").replace(/[^0-9]/g, "");
    const link = c.videoLink || "Link will be shared before the session";
    const msg = encodeURIComponent(
      `Hello ${c.patientName}! ✅\n\nYour video consultation at *Sutra Holistic Care* is confirmed.\n\n📅 Date: ${c.consultationDate}\n⏰ Time: ${c.timeSlot}\n🎥 Google Meet: ${link}\n\nPlease join on time. Feel free to reach out if you have any questions.\n\n— Dr. Keval Dankhara | Radhe Clinic 🌿`,
    );
    window.open(`https://wa.me/${mobile}?text=${msg}`, "_blank");
  };

  // Order: order confirmation to customer
  const handleWaOrderConfirm = (o) => {
    const mobile = (o.mobile || "").replace(/[^0-9]/g, "");
    const productName = o.product?.name || "your product";
    const msg = encodeURIComponent(
      `Hello ${o.name}! 🛒\n\nYour order for *${productName}* has been received at *Sutra Holistic Care*.\n\n📦 Order ID: ${o.id}\n💰 Amount: ₹${(o.totalAmount || 0).toLocaleString("en-IN")}\n\nWe will process and ship your order soon. You'll receive your tracking details once dispatched.\n\nThank you for choosing Sutra! 🌿\n— Radhe Clinic`,
    );
    window.open(`https://wa.me/${mobile}?text=${msg}`, "_blank");
  };

  // Order: tracking notification to customer (used in modal)
  const handleWaTracking = (order, tId) => {
    const mobile = (order.mobile || "").replace(/[^0-9]/g, "");
    const productName = order.product?.name || "your order";
    const msg = encodeURIComponent(
      `Hello ${order.name}! 📦\n\nGreat news — your order of *${productName}* has been shipped!\n\n🔍 Tracking ID: ${tId}\nTrack here: https://trackcourier.io/anjani-courier-tracking\n\nIf you have any questions, reply here.\n\n— Sutra Holistic Care 🌿`,
    );
    window.open(`https://wa.me/${mobile}?text=${msg}`, "_blank");
  };

  // Seminar: registration confirmation
  const handleWaSeminarConfirm = (r) => {
    const mobile = (r.mobile || "").replace(/[^0-9]/g, "");
    const seminar =
      allSeminars.find(
        (s) => s.topic === r.seminarTopic || s.id === r.seminarId,
      ) || {};
    const link = seminar.seminarLink;
    const linkLine = link
      ? `\n\uD83C\uDF9E *Join Link:* ${link}\n`
      : "\nThe joining link will be shared before the event.\n";
    const msg = encodeURIComponent(
      `Hello ${r.name}! \uD83C\uDF93\n\nYour registration for the seminar *"${r.seminarTopic || "Health Seminar"}"* is confirmed at *Sutra Holistic Care*.\n\n\u2705 This seminar is FREE${linkLine}\n\u2014 Dr. Keval Dankhara | Radhe Clinic \uD83C\uDF3F`,
    );
    window.open(`https://wa.me/${mobile}?text=${msg}`, "_blank");
  };

  // ─── Order actions ─────────────────────────────────────────────────────────

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const updated = await updateOrderStatusAdmin(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      showSuccess(`Order status updated to ${status}.`);
      fetchStats();
    } catch (err) {
      showError(err.message || "Failed to update order status.");
    }
  };

  const openTrackingModal = (order) => {
    setTrackingModal(order);
    setTrackingId(order.trackingId || "");
    setActionError("");
  };

  const handleSaveTracking = async (openWa = false) => {
    if (!trackingId.trim()) {
      showError("Tracking ID is required.");
      return;
    }
    setSavingTracking(true);
    try {
      const updated = await addTrackingInfoAdmin(
        trackingModal.id,
        trackingId.trim(),
      );
      setOrders((prev) =>
        prev.map((o) => (o.id === trackingModal.id ? updated : o)),
      );

      if (openWa) {
        handleWaTracking(trackingModal, trackingId.trim());
      }

      setTrackingModal(null);
      setTrackingId("");
      showSuccess(
        openWa
          ? "Tracking saved. WhatsApp opened to notify customer."
          : "Tracking info saved.",
      );
    } catch (err) {
      showError(err.message || "Failed to save tracking info.");
    } finally {
      setSavingTracking(false);
    }
  };

  // ─── Product CRUD ──────────────────────────────────────────────────────────

  const openAddModal = () => {
    setProductForm(emptyProductForm());
    setProductModal("add");
    setActionError("");
  };

  const openEditModal = (product) => {
    setProductForm({
      name: product.name || "",
      description: product.description || "",
      image: product.image || "",
      active: product.active !== false,
      packs:
        product.packs && product.packs.length > 0
          ? product.packs.map((p) => ({ ...p }))
          : [{ weight: 100, price: 0 }],
      ingredients:
        product.ingredients && product.ingredients.length > 0
          ? [...product.ingredients]
          : [""],
      benefits:
        product.benefits && product.benefits.length > 0
          ? [...product.benefits]
          : [""],
      _id: product.id,
    });
    setProductModal("edit");
    setActionError("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm((f) => ({ ...f, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showError("Product name is required.");
      return;
    }
    setSavingProduct(true);
    try {
      const payload = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        image: productForm.image.trim(),
        active: productForm.active,
        packs: productForm.packs.filter((p) => p.weight > 0),
        ingredients: productForm.ingredients
          .map((s) => s.trim())
          .filter(Boolean),
        benefits: productForm.benefits.map((s) => s.trim()).filter(Boolean),
      };

      if (productModal === "edit") {
        const updated = await updateProductAdmin(productForm._id, payload);
        setProducts((prev) =>
          prev.map((p) => (p.id === productForm._id ? updated : p)),
        );
        showSuccess(`"${updated.name}" updated successfully.`);
      } else {
        const created = await createProductAdmin(payload);
        setProducts((prev) => [...prev, created]);
        showSuccess(`"${created.name}" added successfully.`);
      }
      setProductModal(null);
      fetchStats();
    } catch (err) {
      showError(err.message || "Failed to save product.");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteTarget) return;
    setDeletingProduct(true);
    try {
      await deleteProductAdmin(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showSuccess(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      fetchStats();
    } catch (err) {
      showError(err.message || "Failed to delete product.");
    } finally {
      setDeletingProduct(false);
    }
  };

  // ─── Seminar CRUD ──────────────────────────────────────────────────────────

  const openAddSeminarModal = () => {
    setSeminarForm(emptySeminarForm());
    setSeminarModal("add");
    setActionError("");
  };

  const openEditSeminarModal = (seminar) => {
    setSeminarForm({
      topic: seminar.topic || "",
      date: seminar.date || "",
      time: seminar.time || "",
      language: seminar.language || "Hindi / Gujarati",
      seminarLink: seminar.seminarLink || "",
      totalSeats: seminar.totalSeats || 100,
      _id: seminar.id,
    });
    setSeminarModal("edit");
    setActionError("");
  };

  const handleSaveSeminar = async (e) => {
    e.preventDefault();
    if (!seminarForm.topic.trim()) {
      showError("Seminar topic is required.");
      return;
    }
    if (!seminarForm.date) {
      showError("Seminar date is required.");
      return;
    }
    if (!seminarForm.time) {
      showError("Seminar time is required.");
      return;
    }
    // Frontend guard: only allow upcoming dates (add mode)
    if (
      seminarModal === "add" &&
      seminarForm.date < new Date().toISOString().split("T")[0]
    ) {
      showError("Please select an upcoming date for the seminar.");
      return;
    }
    setSavingSeminar(true);
    try {
      const payload = {
        topic: seminarForm.topic.trim(),
        fee: 0, // Seminars are always free
        date: seminarForm.date,
        time: seminarForm.time,
        language: seminarForm.language.trim(),
        seminarLink: seminarForm.seminarLink.trim() || null,
        totalSeats: Number(seminarForm.totalSeats) || 100,
      };
      if (seminarModal === "edit") {
        const updated = await updateSeminarAdmin(seminarForm._id, payload);
        setAllSeminars((prev) =>
          prev.map((s) => (s.id === seminarForm._id ? updated : s)),
        );
        showSuccess(`"${updated.topic}" updated successfully.`);
      } else {
        const created = await createSeminarAdmin(payload);
        setAllSeminars((prev) => [...prev, created]);
        showSuccess(`"${created.topic}" created successfully.`);
      }
      setSeminarModal(null);
      fetchStats();
    } catch (err) {
      showError(err.message || "Failed to save seminar.");
    } finally {
      setSavingSeminar(false);
    }
  };

  const handleDeleteSeminar = async () => {
    if (!deleteSeminarTarget) return;
    setDeletingSeminar(true);
    try {
      await deleteSeminarAdmin(deleteSeminarTarget.id);
      setAllSeminars((prev) =>
        prev.filter((s) => s.id !== deleteSeminarTarget.id),
      );
      showSuccess(`"${deleteSeminarTarget.topic}" deactivated.`);
      setDeleteSeminarTarget(null);
      fetchStats();
    } catch (err) {
      showError(err.message || "Failed to delete seminar.");
    } finally {
      setDeletingSeminar(false);
    }
  };

  // ─── Product form field helpers ────────────────────────────────────────────

  const updatePack = (i, field, val) =>
    setProductForm((f) => ({
      ...f,
      packs: f.packs.map((p, j) =>
        j === i ? { ...p, [field]: Number(val) || 0 } : p,
      ),
    }));

  const addPack = () =>
    setProductForm((f) => ({
      ...f,
      packs: [...f.packs, { weight: 100, price: 0 }],
    }));
  const removePack = (i) =>
    setProductForm((f) => ({ ...f, packs: f.packs.filter((_, j) => j !== i) }));

  const updateList = (key, i, val) =>
    setProductForm((f) => ({
      ...f,
      [key]: f[key].map((v, j) => (j === i ? val : v)),
    }));

  const addListItem = (key) =>
    setProductForm((f) => ({ ...f, [key]: [...f[key], ""] }));
  const removeListItem = (key, i) =>
    setProductForm((f) => ({ ...f, [key]: f[key].filter((_, j) => j !== i) }));

  // ─── Derived values ────────────────────────────────────────────────────────

  const pendingConsultations = consultations.filter(
    (c) => c.status === "PENDING",
  ).length;
  const confirmedConsultations = consultations.filter(
    (c) => c.status === "CONFIRMED",
  ).length;

  const filteredConsultations = consultations.filter(
    (c) =>
      (c.patientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.mobile || "").includes(searchTerm),
  );
  const filteredRegistrations = registrations.filter(
    (r) =>
      (r.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.mobile || "").includes(searchTerm),
  );
  const filteredOrders = orders.filter(
    (o) =>
      (o.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.mobile || "").includes(searchTerm) ||
      (o.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const filteredSeminars = allSeminars.filter((s) =>
    (s.topic || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const filteredSubscribers = subscribers.filter(
    (s) =>
      (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.mobile || "").includes(searchTerm),
  );

  const formatSeminarDate = (dateStr) => {
    if (!dateStr) return "TBA";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const formatSeminarTime = (timeStr) => {
    if (!timeStr) return "TBA";
    const parts = timeStr.split(":");
    const hours = parseInt(parts[0], 10);
    const mins = parts[1] || "00";
    const suffix = hours >= 12 ? "PM" : "AM";
    const display = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${display}:${mins} ${suffix}`;
  };

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-slate-200 h-16 px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="lg:hidden mr-2 p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-text-dark text-primary shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <span className="font-serif text-base font-bold text-text-dark leading-none block">
              Dr. Keval's Console
            </span>
            <span className="text-[10px] font-sans font-bold text-emerald-600 uppercase tracking-widest leading-none block mt-0.5">
              Radhe Clinic Dashboard
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actionSuccess && (
            <span className="hidden sm:flex text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> {actionSuccess}
            </span>
          )}
          {actionError && (
            <span className="hidden sm:flex text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" /> {actionError}
            </span>
          )}
          <button
            onClick={onBackToSite}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 px-2.5 sm:px-3 py-1.5 text-xs text-text-light font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View Site</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-lg bg-red-50 hover:bg-red-100 px-2.5 sm:px-3 py-1.5 text-xs text-red-600 font-semibold transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile overlay — closes sidebar when tapping outside */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#1E293B] text-slate-300 flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:w-60 lg:shrink-0 lg:inset-auto lg:z-auto
        `}
        >
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 lg:hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Navigation
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-slate-700 text-slate-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 space-y-1 flex-1 overflow-y-auto">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">
              Management
            </p>
            {[
              { id: "overview", icon: LayoutDashboard, label: "Overview" },
              {
                id: "orders",
                icon: Package,
                label: `Orders (${orders.length})`,
              },
              {
                id: "bookings",
                icon: Video,
                label: `Consultations (${pendingConsultations} new)`,
              },
              {
                id: "seminars",
                icon: BookOpen,
                label: `Seminars (${allSeminars.length})`,
              },
              {
                id: "products",
                icon: ShoppingBag,
                label: `Products (${products.length})`,
              },
              {
                id: "subscribers",
                icon: Users,
                label: `Subscribers (${subscribers.length})`,
              },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setSearchTerm("");
                  setActionError("");
                  setActionSuccess("");
                  setSeminarSubTab("manage");
                  setSidebarOpen(false); // close drawer on mobile after selection
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeTab === id
                    ? "bg-primary text-text-dark font-extrabold shadow-sm"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500">
            Radhe Clinic Console v2.0
            <br />© 2026 Sutra Holistic Care
          </div>
        </aside>

        {/* Main workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {/* Search bar + tab title + refresh */}
          {activeTab !== "overview" && (
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h1 className="text-xl font-serif font-extrabold text-slate-800 uppercase self-start">
                {activeTab === "orders" && "Product Orders"}
                {activeTab === "bookings" && "Telemedicine Consultations"}
                {activeTab === "seminars" && "Seminars & Registrations"}
                {activeTab === "products" && "Sutra Product Inventory"}
                {activeTab === "subscribers" && "Subscribers & Marketing CRM"}
              </h1>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-xs placeholder-slate-400 focus:border-primary-dark focus:outline-hidden shadow-xs"
                  />
                </div>
                {activeTab === "products" && (
                  <button
                    onClick={openAddModal}
                    className="flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-dark text-text-dark hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all shadow-sm"
                  >
                    <Plus className="h-4 w-4" /> Add Product
                  </button>
                )}
                {activeTab === "seminars" && seminarSubTab === "manage" && (
                  <button
                    onClick={openAddSeminarModal}
                    className="flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-dark text-text-dark hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all shadow-sm"
                  >
                    <Plus className="h-4 w-4" /> New Seminar
                  </button>
                )}
                {activeTab === "subscribers" && (
                  <button
                    onClick={() => exportSubscribersCSV(filteredSubscribers)}
                    disabled={filteredSubscribers.length === 0}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all shadow-sm disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" /> Export CSV
                  </button>
                )}
                <button
                  onClick={() => {
                    fetchConsultations();
                    fetchRegistrations();
                    fetchProducts();
                    fetchOrders();
                    fetchStats();
                    fetchAllSeminars();
                    fetchSubscribers();
                  }}
                  className="rounded-lg border border-slate-200 hover:bg-slate-50 p-2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── OVERVIEW ────────────────────────────────────────────────────── */}
          {activeTab === "overview" && (
            <div className="space-y-8 text-left animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-serif font-extrabold text-slate-800">
                    Good Day, Dr. Keval
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Here's a holistic summary of your practice.
                  </p>
                </div>
                <button
                  onClick={() => {
                    fetchStats();
                    fetchConsultations();
                    fetchRegistrations();
                    fetchProducts();
                    fetchOrders();
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 border border-slate-200 rounded-md px-3 py-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </button>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                {[
                  {
                    label: "Pending Consults",
                    value: loadingStats
                      ? null
                      : (stats?.pendingConsultations ?? pendingConsultations),
                    icon: Video,
                    color: "amber",
                  },
                  {
                    label: "Confirmed Consults",
                    value: loadingStats ? null : confirmedConsultations,
                    icon: CheckCircle,
                    color: "emerald",
                  },
                  {
                    label: "Seminar Registrations",
                    value: loadingStats
                      ? null
                      : (stats?.totalRegistrations ?? registrations.length),
                    icon: Users,
                    color: "purple",
                  },
                  {
                    label: "Active Products",
                    value: loadingStats
                      ? null
                      : (stats?.totalProducts ?? products.length),
                    icon: ShoppingBag,
                    color: "blue",
                  },
                  {
                    label: "Total Subscribers",
                    value: loadingSubscribers ? null : subscribers.length,
                    icon: UserCheck,
                    color: "teal",
                  },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div
                    key={label}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4"
                  >
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 bg-${color}-50 text-${color}-600`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">
                        {label}
                      </span>
                      <span className="text-2xl font-serif font-extrabold text-slate-800 block mt-0.5">
                        {value === null ? (
                          <Loader2 className="h-5 w-5 animate-spin text-slate-300 inline" />
                        ) : (
                          value
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent consultations */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                  <h3 className="font-serif font-extrabold text-lg text-slate-800 border-b border-slate-100 pb-3 mb-4">
                    Recent Consultations
                  </h3>
                  {loadingConsultations ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                    </div>
                  ) : consultations.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">
                      No consultation requests yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {consultations.slice(0, 4).map((c) => (
                        <div
                          key={c.id}
                          className="flex justify-between items-center bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-800">
                              {c.patientName}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {c.consultationDate} | {c.timeSlot}
                            </p>
                          </div>
                          <StatusBadge status={c.status} />
                        </div>
                      ))}
                    </div>
                  )}
                  {consultations.length > 4 && (
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="text-[10px] font-bold text-primary-dark uppercase hover:text-text-dark text-right block mt-4"
                    >
                      View All →
                    </button>
                  )}
                </div>

                {/* Recent orders */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                  <h3 className="font-serif font-extrabold text-lg text-slate-800 border-b border-slate-100 pb-3 mb-4">
                    Recent Orders
                  </h3>
                  {loadingOrders ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                    </div>
                  ) : orders.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">
                      No orders yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 4).map((o) => (
                        <div
                          key={o.id}
                          className="flex justify-between items-center bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-800">{o.name}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {o.product?.name} — ₹
                              {o.totalAmount?.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <OrderStatusBadge status={o.status} />
                        </div>
                      ))}
                    </div>
                  )}
                  {orders.length > 4 && (
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-[10px] font-bold text-primary-dark uppercase hover:text-text-dark text-right block mt-4"
                    >
                      View All →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS TAB ──────────────────────────────────────────────────── */}
          {activeTab === "orders" && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden text-left animate-fade-in">
              {loadingOrders ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4 text-left">Customer</th>
                        <th className="px-6 py-4 text-left">Product / Pack</th>
                        <th className="px-6 py-4 text-left">Amount</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center py-10 text-slate-400"
                          >
                            No orders found.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((o) => (
                          <tr
                            key={o.id}
                            className="hover:bg-slate-50/45 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-slate-400" />
                                {o.name}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-1 flex flex-col gap-0.5">
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" /> {o.mobile}
                                </span>
                                <span>{o.email}</span>
                                <span className="text-slate-300 truncate max-w-xs">
                                  {o.address}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-800">
                                {o.product?.name || "—"}
                              </div>
                              {o.selectedPack && (
                                <div className="text-[10px] text-slate-400 mt-1">
                                  {o.selectedPack.weight}g × {o.quantity}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-serif font-extrabold text-slate-800 text-base">
                                ₹{(o.totalAmount || 0).toLocaleString("en-IN")}
                              </span>
                              {o.paymentId && (
                                <div className="text-[10px] text-emerald-600 mt-0.5">
                                  Paid ✓
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <OrderStatusBadge status={o.status} />
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap space-x-1.5">
                              {o.status === "PENDING" && (
                                <button
                                  onClick={() =>
                                    handleUpdateOrderStatus(o.id, "CONFIRMED")
                                  }
                                  className="inline-flex items-center gap-1 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2.5 py-1.5 text-[10px] uppercase"
                                >
                                  <Check className="h-3.5 w-3.5" /> Confirm
                                </button>
                              )}
                              {o.status === "CONFIRMED" && (
                                <button
                                  onClick={() =>
                                    handleUpdateOrderStatus(o.id, "SHIPPED")
                                  }
                                  className="inline-flex items-center gap-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-bold px-2.5 py-1.5 text-[10px] uppercase"
                                >
                                  Ship
                                </button>
                              )}
                              {o.status === "SHIPPED" && (
                                <button
                                  onClick={() =>
                                    handleUpdateOrderStatus(o.id, "DELIVERED")
                                  }
                                  className="inline-flex items-center gap-1 rounded-md bg-text-dark hover:bg-black text-white font-bold px-2.5 py-1.5 text-[10px] uppercase"
                                >
                                  Delivered
                                </button>
                              )}
                              {/* WhatsApp order confirmation — for any active order */}
                              {(o.status === "PENDING" ||
                                o.status === "CONFIRMED" ||
                                o.status === "SHIPPED") && (
                                <button
                                  onClick={() => handleWaOrderConfirm(o)}
                                  title="WhatsApp order confirmation to customer"
                                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-1.5 text-[10px] uppercase"
                                >
                                  <MessageSquare className="h-3.5 w-3.5" /> WA
                                </button>
                              )}
                              {/* Set Tracking button — available for CONFIRMED, SHIPPED, DELIVERED */}
                              {(o.status === "CONFIRMED" ||
                                o.status === "SHIPPED" ||
                                o.status === "DELIVERED") && (
                                <button
                                  onClick={() => openTrackingModal(o)}
                                  title={
                                    o.trackingId
                                      ? `Tracking: ${o.trackingId}`
                                      : "Add tracking info"
                                  }
                                  className={`inline-flex items-center gap-1 rounded-md font-bold px-2.5 py-1.5 text-[10px] uppercase border transition-colors ${
                                    o.trackingId
                                      ? "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
                                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                                  }`}
                                >
                                  <Truck className="h-3.5 w-3.5" />
                                  {o.trackingId ? "Update" : "Track"}
                                </button>
                              )}

                              {(o.status === "PENDING" ||
                                o.status === "CONFIRMED") && (
                                <button
                                  onClick={() =>
                                    handleUpdateOrderStatus(o.id, "CANCELLED")
                                  }
                                  className="inline-flex items-center gap-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-2.5 py-1.5 text-[10px] uppercase"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── CONSULTATIONS TAB ────────────────────────────────────────────── */}
          {activeTab === "bookings" && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden text-left animate-fade-in">
              {loadingConsultations ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4 text-left">Patient Info</th>
                        <th className="px-6 py-4 text-left">Requested Slot</th>
                        <th className="px-6 py-4 text-left">Chief Complaint</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredConsultations.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center py-10 text-slate-400"
                          >
                            No consultations found.
                          </td>
                        </tr>
                      ) : (
                        filteredConsultations.map((c) => (
                          <tr
                            key={c.id}
                            className="hover:bg-slate-50/45 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-slate-400" />
                                {c.patientName}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-1 flex flex-col gap-0.5">
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" /> {c.mobile}
                                </span>
                                <span>{c.email}</span>
                                {c.age && (
                                  <span>
                                    Age: {c.age} | {c.sex}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                {c.consultationDate}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {c.timeSlot}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-slate-600 max-w-xs truncate">
                                {c.chiefComplaint || "Not specified"}
                              </p>
                              {c.videoLink && (
                                <a
                                  href={c.videoLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-primary-dark underline mt-1 block"
                                >
                                  Meet Link ↗
                                </a>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={c.status} />
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap space-x-1.5">
                              {c.status === "PENDING" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleUpdateConsultationStatus(
                                        c.id,
                                        "CONFIRMED",
                                      )
                                    }
                                    className="inline-flex items-center gap-1 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2.5 py-1.5 text-[10px] uppercase"
                                  >
                                    <Check className="h-3.5 w-3.5" /> Confirm
                                  </button>
                                  <button
                                    onClick={() => handleWaBookingReceived(c)}
                                    title="Send booking received message via WhatsApp"
                                    className="inline-flex items-center gap-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-1.5 text-[10px] uppercase"
                                  >
                                    <MessageSquare className="h-3.5 w-3.5" /> WA
                                  </button>
                                </>
                              )}
                              {c.status === "CONFIRMED" && (
                                <>
                                  <button
                                    onClick={() => {
                                      setVideoLinkModal(c);
                                      setVideoLinkInput(c.videoLink || "");
                                    }}
                                    className="inline-flex items-center gap-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold px-2.5 py-1.5 text-[10px] uppercase"
                                  >
                                    <Video className="h-3.5 w-3.5" /> Set Link
                                  </button>
                                  <button
                                    onClick={() => handleWhatsAppConfirm(c)}
                                    title="Send confirmation + meet link via WhatsApp"
                                    className="inline-flex items-center gap-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-1.5 text-[10px] uppercase"
                                  >
                                    <MessageSquare className="h-3.5 w-3.5" /> WA
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUpdateConsultationStatus(
                                        c.id,
                                        "COMPLETED",
                                      )
                                    }
                                    className="inline-flex items-center gap-1 rounded-md bg-text-dark hover:bg-black text-white font-bold px-2.5 py-1.5 text-[10px] uppercase"
                                  >
                                    Done
                                  </button>
                                </>
                              )}
                              {(c.status === "PENDING" ||
                                c.status === "CONFIRMED") && (
                                <button
                                  onClick={() =>
                                    handleUpdateConsultationStatus(
                                      c.id,
                                      "CANCELLED",
                                    )
                                  }
                                  className="inline-flex items-center gap-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-2.5 py-1.5 text-[10px] uppercase"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── SEMINARS TAB ─────────────────────────────────────────────────── */}
          {activeTab === "seminars" && (
            <div className="animate-fade-in text-left space-y-6">
              {/* Sub-tab switcher */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                <button
                  onClick={() => setSeminarSubTab("manage")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                    seminarSubTab === "manage"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" /> Manage Seminars
                </button>
                <button
                  onClick={() => setSeminarSubTab("registrations")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                    seminarSubTab === "registrations"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Users className="h-3.5 w-3.5" /> Registrations (
                  {registrations.length})
                </button>
              </div>

              {/* ── Manage Seminars sub-tab ── */}
              {seminarSubTab === "manage" && (
                <div>
                  {loadingSeminars ? (
                    <div className="flex justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                    </div>
                  ) : filteredSeminars.length === 0 ? (
                    <div className="text-center py-20">
                      <BookOpen className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 text-sm mb-4">
                        No seminars created yet.
                      </p>
                      <button
                        onClick={openAddSeminarModal}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-dark text-text-dark hover:text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        <Plus className="h-4 w-4" /> Create Your First Seminar
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredSeminars.map((seminar) => (
                        <div
                          key={seminar.id}
                          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                                  seminar.active
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                {seminar.active ? "● Active" : "● Inactive"}
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                {seminar.bookedSeats || 0}/
                                {seminar.totalSeats || "∞"} seats
                              </span>
                            </div>
                            <h3 className="font-serif font-extrabold text-base text-slate-800 leading-tight mb-3">
                              {seminar.topic}
                            </h3>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span>{formatSeminarDate(seminar.date)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span>
                                  {formatSeminarTime(seminar.time)} IST
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span>
                                  {seminar.language || "Hindi / Gujarati"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="font-extrabold text-emerald-700 text-sm">
                                  Free
                                </span>
                              </div>
                              {seminar.seminarLink ? (
                                <div className="flex items-center gap-2 text-[11px]">
                                  <Video className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                                  <a
                                    href={seminar.seminarLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800 truncate max-w-[180px] font-semibold"
                                  >
                                    Join Link ↗
                                  </a>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                                  <Video className="h-3.5 w-3.5 shrink-0" />
                                  <span className="italic">
                                    No join link yet
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-5 flex gap-2 pt-4 border-t border-slate-100">
                            <button
                              onClick={() => openEditSeminarModal(seminar)}
                              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-primary/40 text-primary-dark font-bold hover:bg-primary/10 py-2 text-xs uppercase tracking-wide transition-colors"
                            >
                              <PencilLine className="h-3.5 w-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => setDeleteSeminarTarget(seminar)}
                              className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 text-red-500 font-bold hover:bg-red-50 px-3 py-2 text-xs uppercase tracking-wide transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Registrations sub-tab ── */}
              {seminarSubTab === "registrations" && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                  {loadingRegistrations ? (
                    <div className="flex justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200 text-xs">
                        <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-500">
                          <tr>
                            <th className="px-6 py-4 text-left">Participant</th>
                            <th className="px-6 py-4 text-left">Contact</th>
                            <th className="px-6 py-4 text-left">Seminar</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-left">
                              Registered On
                            </th>
                            <th className="px-6 py-4 text-right">Notify</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredRegistrations.length === 0 ? (
                            <tr>
                              <td
                                colSpan="5"
                                className="text-center py-10 text-slate-400"
                              >
                                No registrations found.
                              </td>
                            </tr>
                          ) : (
                            filteredRegistrations.map((r) => (
                              <tr
                                key={r.id}
                                className="hover:bg-slate-50/45 transition-colors"
                              >
                                <td className="px-6 py-4 font-bold text-slate-800">
                                  <div className="flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5 text-slate-400" />
                                    {r.name}
                                  </div>
                                  {r.age && (
                                    <div className="text-[10px] text-slate-400 mt-0.5">
                                      Age: {r.age} | {r.sex}
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-1.5 text-slate-600">
                                    <Phone className="h-3 w-3 text-slate-400" />{" "}
                                    {r.mobile}
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-1">
                                    {r.email}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="inline-flex rounded-lg bg-primary/20 text-text-dark px-3 py-1 font-semibold">
                                    {r.seminarTopic || "Seminar"}
                                  </span>
                                  {r.status !== undefined && (
                                    <div className="text-[10px] text-emerald-600 mt-1 font-semibold">
                                      Free
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                                      r.status === "CONFIRMED"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : r.status === "CANCELLED"
                                          ? "bg-red-50 text-red-700 border-red-200"
                                          : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}
                                  >
                                    {r.status || "PENDING_PAYMENT"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400">
                                  {r.registeredAt
                                    ? new Date(r.registeredAt).toLocaleString(
                                        "en-IN",
                                      )
                                    : "—"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {r.status !== "CANCELLED" && (
                                    <button
                                      onClick={() => handleWaSeminarConfirm(r)}
                                      title="Send seminar registration confirmation via WhatsApp"
                                      className="inline-flex items-center gap-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-1.5 text-[10px] uppercase"
                                    >
                                      <MessageSquare className="h-3.5 w-3.5" />{" "}
                                      WA
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── PRODUCTS TAB ─────────────────────────────────────────────────── */}
          {activeTab === "products" && (
            <div className="animate-fade-in text-left">
              {loadingProducts ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 text-sm mb-4">
                    No products found.
                  </p>
                  <button
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-dark text-text-dark hover:text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <Plus className="h-4 w-4" /> Add Your First Product
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            {product.image && (
                              <img
                                src={product.image}
                                alt="product"
                                className="h-8 w-8 object-contain"
                              />
                            )}
                            <div>
                              <h3 className="font-serif font-extrabold text-base text-slate-800 leading-tight">
                                {product.name}
                              </h3>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        {product.packs && product.packs.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {product.packs.map((pack, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700"
                              >
                                {pack.weight}g — ₹{pack.price}
                              </span>
                            ))}
                          </div>
                        )}

                        {product.ingredients &&
                          product.ingredients.length > 0 && (
                            <div className="mt-3">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                                Ingredients
                              </p>
                              <p className="text-[10px] text-slate-500 line-clamp-1">
                                {product.ingredients.join(", ")}
                              </p>
                            </div>
                          )}
                      </div>

                      {/* Card actions */}
                      <div className="mt-5 flex gap-2 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => openEditModal(product)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-primary/40 text-primary-dark font-bold hover:bg-primary/10 py-2 text-xs uppercase tracking-wide transition-colors"
                        >
                          <PencilLine className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 text-red-500 font-bold hover:bg-red-50 px-3 py-2 text-xs uppercase tracking-wide transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── SUBSCRIBERS TAB ──────────────────────────────────────────────── */}
          {activeTab === "subscribers" && (
            <div className="animate-fade-in text-left space-y-6">
              {/* CRM Stats mini cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Subscribers",
                    value: subscribers.length,
                    color: "bg-teal-50 text-teal-700 border-teal-200",
                    dot: "🧑‍💼",
                  },
                  {
                    label: "From Orders",
                    value: subStats?.fromOrders ?? "—",
                    color: "bg-blue-50 text-blue-700 border-blue-200",
                    dot: "📦",
                  },
                  {
                    label: "From Consultations",
                    value: subStats?.fromConsults ?? "—",
                    color: "bg-violet-50 text-violet-700 border-violet-200",
                    dot: "🎥",
                  },
                  {
                    label: "From Seminars",
                    value: subStats?.fromSeminars ?? "—",
                    color: "bg-amber-50 text-amber-700 border-amber-200",
                    dot: "🎓",
                  },
                ].map(({ label, value, color, dot }) => (
                  <div
                    key={label}
                    className={`rounded-2xl border p-4 flex items-center gap-3 ${color}`}
                  >
                    <span className="text-2xl">{dot}</span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                        {label}
                      </p>
                      <p className="text-2xl font-serif font-extrabold">
                        {loadingSubscribers ? (
                          <Loader2 className="h-5 w-5 animate-spin inline opacity-50" />
                        ) : (
                          value
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subscribers Table */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                {loadingSubscribers ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                  </div>
                ) : filteredSubscribers.length === 0 ? (
                  <div className="text-center py-20">
                    <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">
                      {searchTerm
                        ? "No subscribers match your search."
                        : "No subscribers yet. They will appear here automatically when users place orders, book consultations, or register for seminars."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-xs">
                      <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-5 py-4 text-left">Contact Info</th>
                          <th className="px-5 py-4 text-left">Demographics</th>
                          <th className="px-5 py-4 text-left">Sources</th>
                          <th className="px-5 py-4 text-left">Activity</th>
                          <th className="px-5 py-4 text-left">Total Spend</th>
                          <th className="px-5 py-4 text-left">Last Seen</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredSubscribers.map((s) => (
                          <tr
                            key={s.id}
                            className="hover:bg-slate-50/40 transition-colors"
                          >
                            {/* Contact */}
                            <td className="px-5 py-4">
                              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-slate-400" />
                                {s.name || "—"}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-1 flex flex-col gap-0.5">
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {s.mobile}
                                </span>
                                <span>{s.email || "—"}</span>
                              </div>
                            </td>

                            {/* Demographics */}
                            <td className="px-5 py-4">
                              {s.age ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700">
                                  Age {s.age} · {s.sex || "N/A"}
                                </span>
                              ) : (
                                <span className="text-slate-300 text-[10px]">
                                  N/A
                                </span>
                              )}
                            </td>

                            {/* Source tags */}
                            <td className="px-5 py-4">
                              <div className="flex flex-wrap gap-1">
                                {(s.sources || []).includes("ORDER") && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5">
                                    📦 Order
                                  </span>
                                )}
                                {(s.sources || []).includes("CONSULTATION") && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-2.5 py-0.5">
                                    🎥 Consult
                                  </span>
                                )}
                                {(s.sources || []).includes("SEMINAR") && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5">
                                    🎓 Seminar
                                  </span>
                                )}
                                {(!s.sources || s.sources.length === 0) && (
                                  <span className="text-slate-300 text-[10px]">
                                    —
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Activity counts */}
                            <td className="px-5 py-4">
                              <div className="flex flex-col gap-0.5 text-[10px] text-slate-500">
                                {s.orderCount > 0 && (
                                  <span>
                                    📦 {s.orderCount} order
                                    {s.orderCount > 1 ? "s" : ""}
                                  </span>
                                )}
                                {s.consultationCount > 0 && (
                                  <span>
                                    🎥 {s.consultationCount} consult
                                    {s.consultationCount > 1 ? "s" : ""}
                                  </span>
                                )}
                                {s.seminarCount > 0 && (
                                  <span>
                                    🎓 {s.seminarCount} seminar
                                    {s.seminarCount > 1 ? "s" : ""}
                                  </span>
                                )}
                                {!s.orderCount &&
                                  !s.consultationCount &&
                                  !s.seminarCount && (
                                    <span className="text-slate-300">—</span>
                                  )}
                              </div>
                            </td>

                            {/* Spend */}
                            <td className="px-5 py-4">
                              <span className="font-serif font-extrabold text-slate-800 text-base">
                                ₹{(s.totalSpend || 0).toLocaleString("en-IN")}
                              </span>
                            </td>

                            {/* Last seen */}
                            <td className="px-5 py-4">
                              <div className="text-[10px] text-slate-500">
                                {s.lastSeenAt
                                  ? new Date(s.lastSeenAt).toLocaleDateString(
                                      "en-IN",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      },
                                    )
                                  : "—"}
                              </div>
                              {s.firstSeenAt &&
                                s.lastSeenAt &&
                                s.firstSeenAt !== s.lastSeenAt && (
                                  <div className="text-[9px] text-slate-300 mt-0.5">
                                    First:{" "}
                                    {new Date(s.firstSeenAt).toLocaleDateString(
                                      "en-IN",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      },
                                    )}
                                  </div>
                                )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="px-6 py-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>
                        Showing {filteredSubscribers.length} of{" "}
                        {subscribers.length} subscriber
                        {subscribers.length !== 1 ? "s" : ""}
                      </span>
                      <span className="text-slate-300">
                        Auto-updated on each purchase / booking
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Seminar Add / Edit Modal ────────────────────────────────────────── */}
      {seminarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-bg-cream rounded-3xl overflow-hidden shadow-2xl border border-primary/20 max-h-[95vh] flex flex-col">
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary-dark to-primary shrink-0" />
            <div className="px-6 py-5 border-b border-primary/15 bg-white flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-primary-dark uppercase">
                  {seminarModal === "add" ? "New Seminar" : "Edit Seminar"}
                </span>
                <h3 className="font-serif text-xl font-bold text-text-dark">
                  {seminarModal === "add"
                    ? "Create Health Seminar"
                    : `Editing: ${seminarForm.topic || "…"}`}
                </h3>
              </div>
              <button
                onClick={() => setSeminarModal(null)}
                className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-text-light hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form
              onSubmit={handleSaveSeminar}
              className="flex-1 overflow-y-auto p-6 space-y-5 text-left"
            >
              <div>
                <label className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">
                  Seminar Topic *
                </label>
                <input
                  type="text"
                  value={seminarForm.topic}
                  onChange={(e) =>
                    setSeminarForm((f) => ({ ...f, topic: e.target.value }))
                  }
                  placeholder="e.g. Lifestyle & Sleep Mastery: Plant-based solutions"
                  required
                  className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={seminarForm.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setSeminarForm((f) => ({ ...f, date: e.target.value }))
                    }
                    required
                    className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Only upcoming dates can be selected.
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">
                    Time (IST) *
                  </label>
                  <input
                    type="time"
                    value={seminarForm.time}
                    onChange={(e) =>
                      setSeminarForm((f) => ({ ...f, time: e.target.value }))
                    }
                    required
                    className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">
                  Language
                </label>
                <input
                  type="text"
                  value={seminarForm.language}
                  onChange={(e) =>
                    setSeminarForm((f) => ({ ...f, language: e.target.value }))
                  }
                  placeholder="Hindi / Gujarati"
                  className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden"
                />
              </div>
              {/* Seminar Join Link */}
              <div>
                <label className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">
                  Join Link (Google Meet / Zoom / YouTube)
                </label>
                <input
                  type="url"
                  value={seminarForm.seminarLink}
                  onChange={(e) =>
                    setSeminarForm((f) => ({
                      ...f,
                      seminarLink: e.target.value,
                    }))
                  }
                  placeholder="https://meet.google.com/xxx-yyyy-zzz"
                  className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  This link will be included in WhatsApp notifications sent to
                  registrants.
                </p>
              </div>
              {/* Fee is always 0 — seminars are free */}
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                Admission is <strong>Free</strong> for all attendees — no
                payment required.
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">
                  Total Seats
                </label>
                <input
                  type="number"
                  value={seminarForm.totalSeats}
                  min="1"
                  onChange={(e) =>
                    setSeminarForm((f) => ({
                      ...f,
                      totalSeats: e.target.value,
                    }))
                  }
                  className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden"
                />
              </div>
              {actionError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md text-xs text-red-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {actionError}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSeminarModal(null)}
                  className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 py-3 text-xs font-bold uppercase tracking-wider text-text-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSeminar}
                  className="flex-1 rounded-xl bg-primary text-text-dark font-bold hover:bg-primary-dark hover:text-white py-3 text-sm uppercase tracking-wider shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {savingSeminar ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : seminarModal === "add" ? (
                    "Create Seminar"
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Seminar Delete Confirm Modal ─────────────────────────────────────── */}
      {deleteSeminarTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-bg-cream rounded-3xl overflow-hidden shadow-2xl border border-red-200">
            <div className="h-1.5 w-full bg-red-500 shrink-0" />
            <div className="p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500 mb-4">
                <Trash2 className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-text-dark">
                Deactivate Seminar?
              </h3>
              <p className="text-sm text-text-light mt-2 leading-relaxed">
                Are you sure you want to deactivate{" "}
                <strong>"{deleteSeminarTarget.topic}"</strong>? It will no
                longer appear for users.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setDeleteSeminarTarget(null)}
                  className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 py-3 text-xs font-bold uppercase tracking-wider text-text-light"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSeminar}
                  disabled={deletingSeminar}
                  className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white py-3 text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {deletingSeminar ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Removing…
                    </>
                  ) : (
                    "Yes, Deactivate"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tracking Info Modal ──────────────────────────────────────────────── */}
      {trackingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-bg-cream rounded-3xl overflow-hidden shadow-2xl border border-indigo-200">
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-indigo-700 shrink-0" />
            <div className="px-6 py-5 border-b border-indigo-100 bg-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
                  Courier Tracking
                </span>
                <h3 className="font-serif text-lg font-bold text-text-dark">
                  Set Tracking Info
                </h3>
                <p className="text-xs text-text-light mt-0.5">
                  Order:{" "}
                  <span className="font-semibold">{trackingModal.name}</span> —{" "}
                  {trackingModal.product?.name}
                </p>
              </div>
              <button
                onClick={() => {
                  setTrackingModal(null);
                  setTrackingId("");
                }}
                className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-text-light hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-left">
              {/* Tracking ID */}
              <div>
                <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">
                  Tracking ID *
                </label>
                <div className="relative">
                  <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="e.g. 123456789012"
                    className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 pl-10 pr-4 py-2.5 text-sm text-text-dark focus:border-indigo-400 focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 -mt-1">
                After saving, WhatsApp will open pre-filled with the tracking ID
                to send to the customer.
              </p>
              {actionError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md text-xs text-red-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {actionError}
                </div>
              )}
              <div className="flex gap-2 pt-1 flex-wrap">
                <button
                  onClick={() => {
                    setTrackingModal(null);
                    setTrackingId("");
                  }}
                  className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 py-3 text-xs font-bold uppercase tracking-wider text-text-light min-w-[80px]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveTracking(false)}
                  disabled={savingTracking || !trackingId.trim()}
                  className="flex-1 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-800 py-3 text-xs uppercase tracking-wider shadow-sm disabled:opacity-60 flex items-center justify-center gap-1.5 min-w-[80px]"
                >
                  {savingTracking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Truck className="h-3.5 w-3.5" />
                      Save
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleSaveTracking(true)}
                  disabled={savingTracking || !trackingId.trim()}
                  className="flex-1 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 py-3 text-xs uppercase tracking-wider shadow-md disabled:opacity-60 flex items-center justify-center gap-1.5 min-w-[100px]"
                >
                  {savingTracking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-3.5 w-3.5" />
                      Save & WA
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Product Add / Edit Modal ────────────────────────────────────────── */}
      {productModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-bg-cream rounded-3xl overflow-hidden shadow-2xl border border-primary/20 max-h-[95vh] flex flex-col">
            {/* Header bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary-dark to-primary shrink-0" />
            <div className="px-6 py-5 border-b border-primary/15 bg-white flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-primary-dark uppercase">
                  {productModal === "add" ? "New Product" : "Edit Product"}
                </span>
                <h3 className="font-serif text-xl font-bold text-text-dark">
                  {productModal === "add"
                    ? "Add Sutra Formula"
                    : `Editing: ${productForm.name || "…"}`}
                </h3>
              </div>
              <button
                onClick={() => setProductModal(null)}
                className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-text-light hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveProduct}
              className="flex-1 overflow-y-auto p-6 space-y-5 text-left"
            >
              {/* Name & Image */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="e.g. Sleep Sutra Powder"
                    required
                    className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">
                    Product Image (from PC)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/20 file:text-primary-dark hover:file:bg-primary/30 file:cursor-pointer bg-bg-cream/45 border border-primary/20 rounded-xl"
                  />
                  {productForm.image && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={productForm.image}
                        alt="Preview"
                        className="h-8 w-8 object-contain rounded-md border border-slate-200 bg-white"
                      />
                      <span className="text-[10px] text-emerald-600 font-bold">
                        Image Set ✓
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of this formula…"
                  className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden resize-none"
                />
              </div>

              {/* Packs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-text-dark uppercase tracking-wider">
                    Pack Sizes (Weight &amp; Price)
                  </label>
                  <button
                    type="button"
                    onClick={addPack}
                    className="text-[10px] font-bold text-primary-dark hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Pack
                  </button>
                </div>
                <div className="space-y-2">
                  {productForm.packs.map((pack, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 right-3 flex items-center text-slate-400 text-xs pointer-events-none">
                          g
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={pack.weight}
                          onChange={(e) =>
                            updatePack(i, "weight", e.target.value)
                          }
                          placeholder="Weight (g)"
                          className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden"
                        />
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs pointer-events-none">
                          ₹
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={pack.price}
                          onChange={(e) =>
                            updatePack(i, "price", e.target.value)
                          }
                          placeholder="Price"
                          className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 pl-7 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden"
                        />
                      </div>
                      {productForm.packs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePack(i)}
                          className="rounded-xl border border-red-200 text-red-500 hover:bg-red-50 p-2.5 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-text-dark uppercase tracking-wider">
                    Key Ingredients
                  </label>
                  <button
                    type="button"
                    onClick={() => addListItem("ingredients")}
                    className="text-[10px] font-bold text-primary-dark hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {productForm.ingredients.map((ing, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={ing}
                        onChange={(e) =>
                          updateList("ingredients", i, e.target.value)
                        }
                        placeholder={`Ingredient ${i + 1}`}
                        className="flex-1 block rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden"
                      />
                      {productForm.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeListItem("ingredients", i)}
                          className="rounded-xl border border-red-200 text-red-500 hover:bg-red-50 p-2 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-text-dark uppercase tracking-wider">
                    Key Benefits
                  </label>
                  <button
                    type="button"
                    onClick={() => addListItem("benefits")}
                    className="text-[10px] font-bold text-primary-dark hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {productForm.benefits.map((ben, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={ben}
                        onChange={(e) =>
                          updateList("benefits", i, e.target.value)
                        }
                        placeholder={`Benefit ${i + 1}`}
                        className="flex-1 block rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden"
                      />
                      {productForm.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeListItem("benefits", i)}
                          className="rounded-xl border border-red-200 text-red-500 hover:bg-red-50 p-2 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status toggle */}
              <div>
                <label className="text-[10px] font-bold text-text-dark uppercase tracking-wider block mb-2">
                  Availability Status
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm((f) => ({ ...f, active: true }))
                    }
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${productForm.active ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-white border-slate-200 text-slate-400"}`}
                  >
                    <Check className="h-4 w-4" /> Active
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm((f) => ({ ...f, active: false }))
                    }
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${!productForm.active ? "bg-amber-50 border-amber-500 text-amber-700" : "bg-white border-slate-200 text-slate-400"}`}
                  >
                    <X className="h-4 w-4" /> Inactive
                  </button>
                </div>
              </div>

              {actionError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md text-xs text-red-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {actionError}
                </div>
              )}

              {/* Footer actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setProductModal(null)}
                  className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 py-3 text-xs font-bold uppercase tracking-wider text-text-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="flex-1 rounded-xl bg-primary text-text-dark font-bold hover:bg-primary-dark hover:text-white py-3 text-sm uppercase tracking-wider shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {savingProduct ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : productModal === "add" ? (
                    "Create Product"
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ─────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-bg-cream rounded-3xl overflow-hidden shadow-2xl border border-red-200">
            <div className="h-1.5 w-full bg-red-500 shrink-0" />
            <div className="p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500 mb-4">
                <Trash2 className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-text-dark">
                Delete Product?
              </h3>
              <p className="text-sm text-text-light mt-2 leading-relaxed">
                Are you sure you want to delete{" "}
                <strong>"{deleteTarget.name}"</strong>? This action cannot be
                undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 py-3 text-xs font-bold uppercase tracking-wider text-text-light"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  disabled={deletingProduct}
                  className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white py-3 text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {deletingProduct ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Video Link Modal ─────────────────────────────────────────────────── */}
      {videoLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-bg-cream rounded-3xl overflow-hidden shadow-2xl border border-primary/20">
            <div className="px-6 py-5 border-b border-primary/15 bg-white flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-bold text-text-dark">
                  Set Video Link
                </h3>
                <p className="text-xs text-text-light mt-0.5">
                  For: {videoLinkModal.patientName}
                </p>
              </div>
              <button
                onClick={() => {
                  setVideoLinkModal(null);
                  setVideoLinkInput("");
                }}
                className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-text-light hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-left">
              <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                Google Meet / Zoom Link
              </label>
              <input
                type="url"
                value={videoLinkInput}
                onChange={(e) => setVideoLinkInput(e.target.value)}
                placeholder="https://meet.google.com/…"
                className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-3 text-xs text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden"
              />
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => {
                    setVideoLinkModal(null);
                    setVideoLinkInput("");
                  }}
                  className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 py-3 text-xs font-bold uppercase text-text-light"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendVideoLink}
                  disabled={videoLinkLoading || !videoLinkInput.trim()}
                  className="flex-1 rounded-xl bg-primary text-text-dark font-bold hover:bg-primary-dark hover:text-white py-3 text-xs uppercase tracking-wider shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {videoLinkLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save Link"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBSCRIBERS TAB ───────────────────────────────────────────────────── */}
      {/* This tab is rendered inside the main workspace, outside the modals */}
    </div>
  );
};

// ─── Status badge helpers ─────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = {
    PENDING: {
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
    CONFIRMED: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
    COMPLETED: {
      bg: "bg-slate-100 text-slate-600 border-slate-200",
      dot: "bg-slate-400",
    },
    CANCELLED: {
      bg: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-400",
    },
  };
  const { bg, dot } = cfg[status] || cfg.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${bg}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
};

const OrderStatusBadge = ({ status }) => {
  const cfg = {
    PENDING: {
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
    CONFIRMED: {
      bg: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-500",
    },
    SHIPPED: {
      bg: "bg-purple-50 text-purple-700 border-purple-200",
      dot: "bg-purple-500",
    },
    DELIVERED: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
    CANCELLED: {
      bg: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-400",
    },
  };
  const { bg, dot } = cfg[status] || cfg.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${bg}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status || "PENDING"}
    </span>
  );
};

export default AdminDashboard;
