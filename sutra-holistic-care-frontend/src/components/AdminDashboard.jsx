import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Video, Users, ShoppingBag, LogOut, Check, ArrowLeft,
  MessageSquare, User, Calendar, Phone, Search, ShieldCheck,
  DollarSign, X, CheckCircle, Loader2, AlertCircle, RefreshCw,
  Clock, Package, Plus, Trash2, PencilLine
} from 'lucide-react';
import { getDashboardStats } from '../services/adminService.js';
import {
  getAllConsultationsAdmin,
  updateConsultationStatusAdmin,
  sendVideoLinkAdmin,
} from '../services/consultationService.js';
import { getAllRegistrationsAdmin } from '../services/seminarService.js';
import { getAllOrdersAdmin, updateOrderStatusAdmin } from '../services/orderService.js';
import {
  getAllProductsAdmin,
  updateProductAdmin,
  createProductAdmin,
  deleteProductAdmin,
} from '../services/productService.js';

// ─────────────────────────────────────────────────────────────────────────────
//  Helper: empty product form state
// ─────────────────────────────────────────────────────────────────────────────
const emptyProductForm = () => ({
  name:        '',
  description: '',
  emoji:       '',
  active:      true,
  packs:       [{ weight: 100, price: 0 }],
  ingredients: [''],
  benefits:    [''],
});

// ─────────────────────────────────────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────────────────────────────────────
const AdminDashboard = ({ onLogout, onBackToSite }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Data states
  const [stats, setStats]             = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [products, setProducts]           = useState([]);
  const [orders, setOrders]               = useState([]);

  // Loading states
  const [loadingStats, setLoadingStats]               = useState(true);
  const [loadingConsultations, setLoadingConsultations] = useState(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);
  const [loadingProducts, setLoadingProducts]           = useState(true);
  const [loadingOrders, setLoadingOrders]               = useState(true);

  // Action feedback
  const [actionError, setActionError]     = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Product modal — shared for Add & Edit
  const [productModal, setProductModal] = useState(null); // null | 'add' | 'edit'
  const [productForm, setProductForm]   = useState(emptyProductForm());
  const [savingProduct, setSavingProduct] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget]   = useState(null); // product object
  const [deletingProduct, setDeletingProduct] = useState(false);

  // Video link modal
  const [videoLinkModal, setVideoLinkModal]   = useState(null);
  const [videoLinkInput, setVideoLinkInput]   = useState('');
  const [videoLinkLoading, setVideoLinkLoading] = useState(false);

  // ─── Data fetchers ─────────────────────────────────────────────────────────

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try { setStats(await getDashboardStats()); } catch { /* silent */ }
    finally { setLoadingStats(false); }
  }, []);

  const fetchConsultations = useCallback(async () => {
    setLoadingConsultations(true);
    try { setConsultations(await getAllConsultationsAdmin()); } catch { setConsultations([]); }
    finally { setLoadingConsultations(false); }
  }, []);

  const fetchRegistrations = useCallback(async () => {
    setLoadingRegistrations(true);
    try { setRegistrations(await getAllRegistrationsAdmin()); } catch { setRegistrations([]); }
    finally { setLoadingRegistrations(false); }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try { setProducts(await getAllProductsAdmin()); } catch { setProducts([]); }
    finally { setLoadingProducts(false); }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try { setOrders(await getAllOrdersAdmin()); } catch { setOrders([]); }
    finally { setLoadingOrders(false); }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchConsultations();
    fetchRegistrations();
    fetchProducts();
    fetchOrders();
  }, [fetchStats, fetchConsultations, fetchRegistrations, fetchProducts, fetchOrders]);

  // ─── Feedback helpers ──────────────────────────────────────────────────────

  const showSuccess = (msg) => {
    setActionSuccess(msg);
    setActionError('');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const showError = (msg) => {
    setActionError(msg);
    setActionSuccess('');
  };

  // ─── Consultation actions ──────────────────────────────────────────────────

  const handleUpdateConsultationStatus = async (id, status) => {
    try {
      const updated = await updateConsultationStatusAdmin(id, status);
      setConsultations(prev => prev.map(c => c.id === id ? updated : c));
      showSuccess(`Consultation status updated to ${status}.`);
      fetchStats();
    } catch (err) {
      showError(err.message || 'Failed to update status.');
    }
  };

  const handleSendVideoLink = async () => {
    if (!videoLinkInput.trim()) return;
    setVideoLinkLoading(true);
    try {
      const updated = await sendVideoLinkAdmin(videoLinkModal.id, videoLinkInput.trim());
      setConsultations(prev => prev.map(c => c.id === videoLinkModal.id ? updated : c));
      setVideoLinkModal(null);
      setVideoLinkInput('');
      showSuccess('Video link sent successfully.');
    } catch (err) {
      showError(err.message || 'Failed to send video link.');
    } finally {
      setVideoLinkLoading(false);
    }
  };

  const handleWhatsAppConfirm = (c) => {
    const link = c.videoLink || 'Link to be sent shortly';
    const msg = `Hi ${c.patientName}, this is Radhe Clinic. Your video consultation with Dr. Keval Dankhara has been confirmed for ${c.consultationDate} at ${c.timeSlot}. Join here: ${link}. Thank you!`;
    window.open(`https://wa.me/${(c.mobile || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ─── Order actions ─────────────────────────────────────────────────────────

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const updated = await updateOrderStatusAdmin(id, status);
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      showSuccess(`Order status updated to ${status}.`);
      fetchStats();
    } catch (err) {
      showError(err.message || 'Failed to update order status.');
    }
  };

  // ─── Product CRUD ──────────────────────────────────────────────────────────

  const openAddModal = () => {
    setProductForm(emptyProductForm());
    setProductModal('add');
    setActionError('');
  };

  const openEditModal = (product) => {
    setProductForm({
      name:        product.name        || '',
      description: product.description || '',
      emoji:       product.emoji       || '',
      active:      product.active      !== false,
      packs:       product.packs && product.packs.length > 0
                     ? product.packs.map(p => ({ ...p }))
                     : [{ weight: 100, price: 0 }],
      ingredients: product.ingredients && product.ingredients.length > 0
                     ? [...product.ingredients]
                     : [''],
      benefits:    product.benefits && product.benefits.length > 0
                     ? [...product.benefits]
                     : [''],
      _id:         product.id,
    });
    setProductModal('edit');
    setActionError('');
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showError('Product name is required.');
      return;
    }
    setSavingProduct(true);
    try {
      const payload = {
        name:        productForm.name.trim(),
        description: productForm.description.trim(),
        emoji:       productForm.emoji.trim(),
        active:      productForm.active,
        packs:       productForm.packs.filter(p => p.weight > 0),
        ingredients: productForm.ingredients.map(s => s.trim()).filter(Boolean),
        benefits:    productForm.benefits.map(s => s.trim()).filter(Boolean),
      };

      if (productModal === 'edit') {
        const updated = await updateProductAdmin(productForm._id, payload);
        setProducts(prev => prev.map(p => p.id === productForm._id ? updated : p));
        showSuccess(`"${updated.name}" updated successfully.`);
      } else {
        const created = await createProductAdmin(payload);
        setProducts(prev => [...prev, created]);
        showSuccess(`"${created.name}" added successfully.`);
      }
      setProductModal(null);
      fetchStats();
    } catch (err) {
      showError(err.message || 'Failed to save product.');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteTarget) return;
    setDeletingProduct(true);
    try {
      await deleteProductAdmin(deleteTarget.id);
      setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
      showSuccess(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      fetchStats();
    } catch (err) {
      showError(err.message || 'Failed to delete product.');
    } finally {
      setDeletingProduct(false);
    }
  };

  // ─── Product form field helpers ────────────────────────────────────────────

  const updatePack = (i, field, val) =>
    setProductForm(f => ({ ...f, packs: f.packs.map((p, j) => j === i ? { ...p, [field]: Number(val) || 0 } : p) }));

  const addPack    = () => setProductForm(f => ({ ...f, packs: [...f.packs, { weight: 100, price: 0 }] }));
  const removePack = (i) => setProductForm(f => ({ ...f, packs: f.packs.filter((_, j) => j !== i) }));

  const updateList = (key, i, val) =>
    setProductForm(f => ({ ...f, [key]: f[key].map((v, j) => j === i ? val : v) }));

  const addListItem = (key) => setProductForm(f => ({ ...f, [key]: [...f[key], ''] }));
  const removeListItem = (key, i) => setProductForm(f => ({ ...f, [key]: f[key].filter((_, j) => j !== i) }));

  // ─── Derived values ────────────────────────────────────────────────────────

  const pendingConsultations  = consultations.filter(c => c.status === 'PENDING').length;
  const confirmedConsultations = consultations.filter(c => c.status === 'CONFIRMED').length;

  const filteredConsultations = consultations.filter(c =>
    (c.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.mobile || '').includes(searchTerm)
  );
  const filteredRegistrations = registrations.filter(r =>
    (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.mobile || '').includes(searchTerm)
  );
  const filteredOrders = orders.filter(o =>
    (o.name  || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.mobile || '').includes(searchTerm) ||
    (o.email  || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredProducts = products.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      {/* Top Admin Header */}
      <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-text-dark text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="font-serif text-base font-bold text-text-dark leading-none block">Dr. Keval's Console</span>
            <span className="text-[10px] font-sans font-bold text-emerald-600 uppercase tracking-widest leading-none block mt-0.5">Radhe Clinic Dashboard</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {actionSuccess && (
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> {actionSuccess}
            </span>
          )}
          {actionError && (
            <span className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" /> {actionError}
            </span>
          )}
          <button onClick={onBackToSite} className="flex items-center gap-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 px-3 py-1.5 text-xs text-text-light font-semibold">
            <ArrowLeft className="h-3.5 w-3.5" /> View Site
          </button>
          <button onClick={onLogout} className="flex items-center gap-1.5 rounded-lg bg-red-50 hover:bg-red-100 px-3 py-1.5 text-xs text-red-600 font-semibold transition-colors">
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* Layout */}
      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar */}
        <aside className="w-60 bg-[#1E293B] text-slate-300 flex flex-col justify-between shrink-0">
          <div className="p-4 space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">Management</p>
            {[
              { id: 'overview',  icon: LayoutDashboard, label: 'Overview' },
              { id: 'orders',    icon: Package,          label: `Orders (${orders.length})` },
              { id: 'bookings',  icon: Video,            label: `Consultations (${pendingConsultations} new)` },
              { id: 'seminars',  icon: Users,            label: `Seminar Registrants` },
              { id: 'products',  icon: ShoppingBag,      label: `Products (${products.length})` },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setSearchTerm(''); setActionError(''); setActionSuccess(''); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeTab === id ? 'bg-primary text-text-dark font-extrabold shadow-sm' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500">
            Radhe Clinic Console v2.0<br />© 2026 Sutra Holistic Care
          </div>
        </aside>

        {/* Main workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">

          {/* Search bar + tab title + refresh */}
          {activeTab !== 'overview' && (
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h1 className="text-xl font-serif font-extrabold text-slate-800 uppercase self-start">
                {activeTab === 'orders'    && 'Product Orders'}
                {activeTab === 'bookings'  && 'Telemedicine Consultations'}
                {activeTab === 'seminars'  && 'Seminar Enrollments'}
                {activeTab === 'products'  && 'Sutra Product Inventory'}
              </h1>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Search className="h-4 w-4" /></div>
                  <input type="text" placeholder="Search…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-xs placeholder-slate-400 focus:border-primary-dark focus:outline-hidden shadow-xs" />
                </div>
                {activeTab === 'products' && (
                  <button onClick={openAddModal} className="flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-dark text-text-dark hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all shadow-sm">
                    <Plus className="h-4 w-4" /> Add Product
                  </button>
                )}
                <button onClick={() => { fetchConsultations(); fetchRegistrations(); fetchProducts(); fetchOrders(); fetchStats(); }} className="rounded-lg border border-slate-200 hover:bg-slate-50 p-2 text-slate-400 hover:text-slate-700 transition-colors">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── OVERVIEW ────────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-8 text-left animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-serif font-extrabold text-slate-800">Good Day, Dr. Keval</h1>
                  <p className="text-xs text-slate-500 mt-1">Here's a holistic summary of your practice.</p>
                </div>
                <button onClick={() => { fetchStats(); fetchConsultations(); fetchRegistrations(); fetchProducts(); fetchOrders(); }} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 border border-slate-200 rounded-md px-3 py-1.5">
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </button>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {[
                  { label: 'Pending Consults',    value: loadingStats ? null : (stats?.pendingConsultations  ?? pendingConsultations),  icon: Video,      color: 'amber'  },
                  { label: 'Confirmed Consults',   value: loadingStats ? null : confirmedConsultations,                                   icon: CheckCircle,color: 'emerald'},
                  { label: 'Seminar Registrations',value: loadingStats ? null : (stats?.totalRegistrations   ?? registrations.length),  icon: Users,      color: 'purple' },
                  { label: 'Active Products',      value: loadingStats ? null : (stats?.totalProducts        ?? products.length),       icon: ShoppingBag,color: 'blue'   },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 bg-${color}-50 text-${color}-600`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">{label}</span>
                      <span className="text-2xl font-serif font-extrabold text-slate-800 block mt-0.5">
                        {value === null ? <Loader2 className="h-5 w-5 animate-spin text-slate-300 inline" /> : value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent consultations */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                  <h3 className="font-serif font-extrabold text-lg text-slate-800 border-b border-slate-100 pb-3 mb-4">Recent Consultations</h3>
                  {loadingConsultations ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
                    : consultations.length === 0 ? <p className="text-xs text-slate-400 py-4 text-center">No consultation requests yet.</p>
                    : (
                      <div className="space-y-3">
                        {consultations.slice(0, 4).map(c => (
                          <div key={c.id} className="flex justify-between items-center bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 text-xs">
                            <div>
                              <p className="font-bold text-slate-800">{c.patientName}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{c.consultationDate} | {c.timeSlot}</p>
                            </div>
                            <StatusBadge status={c.status} />
                          </div>
                        ))}
                      </div>
                    )}
                  {consultations.length > 4 && <button onClick={() => setActiveTab('bookings')} className="text-[10px] font-bold text-primary-dark uppercase hover:text-text-dark text-right block mt-4">View All →</button>}
                </div>

                {/* Recent orders */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                  <h3 className="font-serif font-extrabold text-lg text-slate-800 border-b border-slate-100 pb-3 mb-4">Recent Orders</h3>
                  {loadingOrders ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
                    : orders.length === 0 ? <p className="text-xs text-slate-400 py-4 text-center">No orders yet.</p>
                    : (
                      <div className="space-y-3">
                        {orders.slice(0, 4).map(o => (
                          <div key={o.id} className="flex justify-between items-center bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 text-xs">
                            <div>
                              <p className="font-bold text-slate-800">{o.name}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{o.product?.name} — ₹{o.totalAmount?.toLocaleString('en-IN')}</p>
                            </div>
                            <OrderStatusBadge status={o.status} />
                          </div>
                        ))}
                      </div>
                    )}
                  {orders.length > 4 && <button onClick={() => setActiveTab('orders')} className="text-[10px] font-bold text-primary-dark uppercase hover:text-text-dark text-right block mt-4">View All →</button>}
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS TAB ──────────────────────────────────────────────────── */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden text-left animate-fade-in">
              {loadingOrders ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-slate-300" /></div> : (
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
                      {filteredOrders.length === 0 ? <tr><td colSpan="5" className="text-center py-10 text-slate-400">No orders found.</td></tr>
                        : filteredOrders.map(o => (
                          <tr key={o.id} className="hover:bg-slate-50/45 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-800 flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-slate-400" />{o.name}</div>
                              <div className="text-[10px] text-slate-400 mt-1 flex flex-col gap-0.5">
                                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {o.mobile}</span>
                                <span>{o.email}</span>
                                <span className="text-slate-300 truncate max-w-xs">{o.address}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-800">{o.product?.name || '—'}</div>
                              {o.selectedPack && <div className="text-[10px] text-slate-400 mt-1">{o.selectedPack.weight}g × {o.quantity}</div>}
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-serif font-extrabold text-slate-800 text-base">₹{(o.totalAmount || 0).toLocaleString('en-IN')}</span>
                              {o.paymentId && <div className="text-[10px] text-emerald-600 mt-0.5">Paid ✓</div>}
                            </td>
                            <td className="px-6 py-4"><OrderStatusBadge status={o.status} /></td>
                            <td className="px-6 py-4 text-right whitespace-nowrap space-x-1.5">
                              {o.status === 'PENDING'   && <button onClick={() => handleUpdateOrderStatus(o.id, 'CONFIRMED')} className="inline-flex items-center gap-1 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2.5 py-1.5 text-[10px] uppercase"><Check className="h-3.5 w-3.5" /> Confirm</button>}
                              {o.status === 'CONFIRMED' && <button onClick={() => handleUpdateOrderStatus(o.id, 'SHIPPED')} className="inline-flex items-center gap-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-bold px-2.5 py-1.5 text-[10px] uppercase">Ship</button>}
                              {o.status === 'SHIPPED'   && <button onClick={() => handleUpdateOrderStatus(o.id, 'DELIVERED')} className="inline-flex items-center gap-1 rounded-md bg-text-dark hover:bg-black text-white font-bold px-2.5 py-1.5 text-[10px] uppercase">Delivered</button>}
                              {(o.status === 'PENDING' || o.status === 'CONFIRMED') && (
                                <button onClick={() => handleUpdateOrderStatus(o.id, 'CANCELLED')} className="inline-flex items-center gap-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-2.5 py-1.5 text-[10px] uppercase"><X className="h-3 w-3" /></button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── CONSULTATIONS TAB ────────────────────────────────────────────── */}
          {activeTab === 'bookings' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden text-left animate-fade-in">
              {loadingConsultations ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-slate-300" /></div> : (
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
                      {filteredConsultations.length === 0 ? <tr><td colSpan="5" className="text-center py-10 text-slate-400">No consultations found.</td></tr>
                        : filteredConsultations.map(c => (
                          <tr key={c.id} className="hover:bg-slate-50/45 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-800 flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-slate-400" />{c.patientName}</div>
                              <div className="text-[10px] text-slate-400 mt-1 flex flex-col gap-0.5">
                                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {c.mobile}</span>
                                <span>{c.email}</span>
                                {c.age && <span>Age: {c.age} | {c.sex}</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-800 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400" />{c.consultationDate}</div>
                              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1"><Clock className="h-3 w-3" />{c.timeSlot}</div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-slate-600 max-w-xs truncate">{c.chiefComplaint || 'Not specified'}</p>
                              {c.videoLink && <a href={c.videoLink} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary-dark underline mt-1 block">Meet Link ↗</a>}
                            </td>
                            <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                            <td className="px-6 py-4 text-right whitespace-nowrap space-x-1.5">
                              {c.status === 'PENDING' && <button onClick={() => handleUpdateConsultationStatus(c.id, 'CONFIRMED')} className="inline-flex items-center gap-1 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2.5 py-1.5 text-[10px] uppercase"><Check className="h-3.5 w-3.5" /> Confirm</button>}
                              {c.status === 'CONFIRMED' && (
                                <>
                                  <button onClick={() => { setVideoLinkModal(c); setVideoLinkInput(c.videoLink || ''); }} className="inline-flex items-center gap-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold px-2.5 py-1.5 text-[10px] uppercase"><Video className="h-3.5 w-3.5" /> Set Link</button>
                                  <button onClick={() => handleWhatsAppConfirm(c)} className="inline-flex items-center gap-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-1.5 text-[10px] uppercase"><MessageSquare className="h-3.5 w-3.5" /> WA</button>
                                  <button onClick={() => handleUpdateConsultationStatus(c.id, 'COMPLETED')} className="inline-flex items-center gap-1 rounded-md bg-text-dark hover:bg-black text-white font-bold px-2.5 py-1.5 text-[10px] uppercase">Done</button>
                                </>
                              )}
                              {(c.status === 'PENDING' || c.status === 'CONFIRMED') && (
                                <button onClick={() => handleUpdateConsultationStatus(c.id, 'CANCELLED')} className="inline-flex items-center gap-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-2.5 py-1.5 text-[10px] uppercase"><X className="h-3 w-3" /></button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── SEMINARS TAB ─────────────────────────────────────────────────── */}
          {activeTab === 'seminars' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden text-left animate-fade-in">
              {loadingRegistrations ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-slate-300" /></div> : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4 text-left">Participant</th>
                        <th className="px-6 py-4 text-left">Contact</th>
                        <th className="px-6 py-4 text-left">Seminar</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-left">Registered On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRegistrations.length === 0 ? <tr><td colSpan="5" className="text-center py-10 text-slate-400">No registrations found.</td></tr>
                        : filteredRegistrations.map(r => (
                          <tr key={r.id} className="hover:bg-slate-50/45 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800">
                              <div className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-slate-400" />{r.name}</div>
                              {r.age && <div className="text-[10px] text-slate-400 mt-0.5">Age: {r.age} | {r.sex}</div>}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5 text-slate-600"><Phone className="h-3 w-3 text-slate-400" /> {r.mobile}</div>
                              <div className="text-[10px] text-slate-400 mt-1">{r.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex rounded-lg bg-primary/20 text-text-dark px-3 py-1 font-semibold">{r.seminarTopic || 'Seminar'}</span>
                              {r.feePaid !== undefined && <div className="text-[10px] text-slate-400 mt-1">Fee: ₹{r.feePaid}</div>}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                                r.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : r.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>{r.status || 'PENDING_PAYMENT'}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-400">{r.registeredAt ? new Date(r.registeredAt).toLocaleString('en-IN') : '—'}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── PRODUCTS TAB ─────────────────────────────────────────────────── */}
          {activeTab === 'products' && (
            <div className="animate-fade-in text-left">
              {loadingProducts ? (
                <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-slate-300" /></div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 text-sm mb-4">No products found.</p>
                  <button onClick={openAddModal} className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-dark text-text-dark hover:text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all">
                    <Plus className="h-4 w-4" /> Add Your First Product
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            {product.emoji && <span className="text-2xl">{product.emoji}</span>}
                            <div>
                              <h3 className="font-serif font-extrabold text-base text-slate-800 leading-tight">{product.name}</h3>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold mt-1 ${product.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                {product.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>

                        {product.packs && product.packs.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {product.packs.map((pack, i) => (
                              <span key={i} className="text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700">
                                {pack.weight}g — ₹{pack.price}
                              </span>
                            ))}
                          </div>
                        )}

                        {product.ingredients && product.ingredients.length > 0 && (
                          <div className="mt-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Ingredients</p>
                            <p className="text-[10px] text-slate-500 line-clamp-1">{product.ingredients.join(', ')}</p>
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

        </main>
      </div>

      {/* ── Product Add / Edit Modal ────────────────────────────────────────── */}
      {productModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-bg-cream rounded-3xl overflow-hidden shadow-2xl border border-primary/20 max-h-[95vh] flex flex-col">

            {/* Header bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary-dark to-primary shrink-0" />
            <div className="px-6 py-5 border-b border-primary/15 bg-white flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-primary-dark uppercase">{productModal === 'add' ? 'New Product' : 'Edit Product'}</span>
                <h3 className="font-serif text-xl font-bold text-text-dark">{productModal === 'add' ? 'Add Sutra Formula' : `Editing: ${productForm.name || '…'}`}</h3>
              </div>
              <button onClick={() => setProductModal(null)} className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-text-light hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-5 text-left">

              {/* Name & Emoji */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">Product Name *</label>
                  <input type="text" value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Sleep Sutra Powder" required className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">Emoji</label>
                  <input type="text" value={productForm.emoji} onChange={e => setProductForm(f => ({ ...f, emoji: e.target.value }))} placeholder="🌿" className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 text-xl text-center text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">Description</label>
                <textarea rows="2" value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of this formula…" className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden resize-none" />
              </div>

              {/* Packs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-text-dark uppercase tracking-wider">Pack Sizes (Weight &amp; Price)</label>
                  <button type="button" onClick={addPack} className="text-[10px] font-bold text-primary-dark hover:underline flex items-center gap-0.5"><Plus className="h-3.5 w-3.5" />Add Pack</button>
                </div>
                <div className="space-y-2">
                  {productForm.packs.map((pack, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 right-3 flex items-center text-slate-400 text-xs pointer-events-none">g</span>
                        <input type="number" min="1" value={pack.weight} onChange={e => updatePack(i, 'weight', e.target.value)} placeholder="Weight (g)" className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden" />
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs pointer-events-none">₹</span>
                        <input type="number" min="0" value={pack.price} onChange={e => updatePack(i, 'price', e.target.value)} placeholder="Price" className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 pl-7 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden" />
                      </div>
                      {productForm.packs.length > 1 && (
                        <button type="button" onClick={() => removePack(i)} className="rounded-xl border border-red-200 text-red-500 hover:bg-red-50 p-2.5 transition-colors"><X className="h-4 w-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-text-dark uppercase tracking-wider">Key Ingredients</label>
                  <button type="button" onClick={() => addListItem('ingredients')} className="text-[10px] font-bold text-primary-dark hover:underline flex items-center gap-0.5"><Plus className="h-3.5 w-3.5" />Add</button>
                </div>
                <div className="space-y-2">
                  {productForm.ingredients.map((ing, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" value={ing} onChange={e => updateList('ingredients', i, e.target.value)} placeholder={`Ingredient ${i + 1}`} className="flex-1 block rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden" />
                      {productForm.ingredients.length > 1 && <button type="button" onClick={() => removeListItem('ingredients', i)} className="rounded-xl border border-red-200 text-red-500 hover:bg-red-50 p-2 transition-colors"><X className="h-3.5 w-3.5" /></button>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-text-dark uppercase tracking-wider">Key Benefits</label>
                  <button type="button" onClick={() => addListItem('benefits')} className="text-[10px] font-bold text-primary-dark hover:underline flex items-center gap-0.5"><Plus className="h-3.5 w-3.5" />Add</button>
                </div>
                <div className="space-y-2">
                  {productForm.benefits.map((ben, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" value={ben} onChange={e => updateList('benefits', i, e.target.value)} placeholder={`Benefit ${i + 1}`} className="flex-1 block rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden" />
                      {productForm.benefits.length > 1 && <button type="button" onClick={() => removeListItem('benefits', i)} className="rounded-xl border border-red-200 text-red-500 hover:bg-red-50 p-2 transition-colors"><X className="h-3.5 w-3.5" /></button>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status toggle */}
              <div>
                <label className="text-[10px] font-bold text-text-dark uppercase tracking-wider block mb-2">Availability Status</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setProductForm(f => ({ ...f, active: true }))} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${productForm.active ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-400'}`}>
                    <Check className="h-4 w-4" /> Active — In Stock
                  </button>
                  <button type="button" onClick={() => setProductForm(f => ({ ...f, active: false }))} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${!productForm.active ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-white border-slate-200 text-slate-400'}`}>
                    <X className="h-4 w-4" /> Inactive — Out of Stock
                  </button>
                </div>
              </div>

              {actionError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md text-xs text-red-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />{actionError}
                </div>
              )}

              {/* Footer actions */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setProductModal(null)} className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 py-3 text-xs font-bold uppercase tracking-wider text-text-light">Cancel</button>
                <button type="submit" disabled={savingProduct} className="flex-1 rounded-xl bg-primary text-text-dark font-bold hover:bg-primary-dark hover:text-white py-3 text-sm uppercase tracking-wider shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
                  {savingProduct ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : (productModal === 'add' ? 'Create Product' : 'Save Changes')}
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
              <h3 className="font-serif text-lg font-bold text-text-dark">Delete Product?</h3>
              <p className="text-sm text-text-light mt-2 leading-relaxed">
                Are you sure you want to delete <strong>"{deleteTarget.name}"</strong>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 py-3 text-xs font-bold uppercase tracking-wider text-text-light">Cancel</button>
                <button onClick={handleDeleteProduct} disabled={deletingProduct} className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white py-3 text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
                  {deletingProduct ? <><Loader2 className="h-4 w-4 animate-spin" />Deleting…</> : 'Yes, Delete'}
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
                <h3 className="font-serif text-lg font-bold text-text-dark">Set Video Link</h3>
                <p className="text-xs text-text-light mt-0.5">For: {videoLinkModal.patientName}</p>
              </div>
              <button onClick={() => { setVideoLinkModal(null); setVideoLinkInput(''); }} className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-text-light hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4 text-left">
              <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Google Meet / Zoom Link</label>
              <input type="url" value={videoLinkInput} onChange={e => setVideoLinkInput(e.target.value)} placeholder="https://meet.google.com/…" className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-3 text-xs text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden" />
              <div className="flex gap-3 pt-1">
                <button onClick={() => { setVideoLinkModal(null); setVideoLinkInput(''); }} className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 py-3 text-xs font-bold uppercase text-text-light">Cancel</button>
                <button onClick={handleSendVideoLink} disabled={videoLinkLoading || !videoLinkInput.trim()} className="flex-1 rounded-xl bg-primary text-text-dark font-bold hover:bg-primary-dark hover:text-white py-3 text-xs uppercase tracking-wider shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
                  {videoLinkLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : 'Save Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// ─── Status badge helpers ─────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = {
    PENDING:   { bg: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-500'  },
    CONFIRMED: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    COMPLETED: { bg: 'bg-slate-100 text-slate-600 border-slate-200',  dot: 'bg-slate-400'  },
    CANCELLED: { bg: 'bg-red-50 text-red-700 border-red-200',         dot: 'bg-red-400'    },
  };
  const { bg, dot } = cfg[status] || cfg.PENDING;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
};

const OrderStatusBadge = ({ status }) => {
  const cfg = {
    PENDING:   { bg: 'bg-amber-50 text-amber-700 border-amber-200',     dot: 'bg-amber-500'   },
    CONFIRMED: { bg: 'bg-blue-50 text-blue-700 border-blue-200',         dot: 'bg-blue-500'    },
    SHIPPED:   { bg: 'bg-purple-50 text-purple-700 border-purple-200',   dot: 'bg-purple-500'  },
    DELIVERED: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',dot: 'bg-emerald-500' },
    CANCELLED: { bg: 'bg-red-50 text-red-700 border-red-200',            dot: 'bg-red-400'     },
  };
  const { bg, dot } = cfg[status] || cfg.PENDING;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status || 'PENDING'}
    </span>
  );
};

export default AdminDashboard;
