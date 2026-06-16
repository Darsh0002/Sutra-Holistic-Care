import React, { useState } from 'react';
import {
  ShoppingBag, Eye, X, Check, HelpCircle, Leaf, Star,
  User, Phone, Mail, MapPin, Package, CreditCard,
  CheckCircle, AlertCircle, Loader2, ArrowRight, ChevronDown
} from 'lucide-react';
import {
  createOrder,
  createOrderPayment,
  verifyPayment,
  loadRazorpayScript,
  openRazorpayCheckout,
} from '../services/orderService.js';



// ─── Buy checkout states ───────────────────────────────────────────────────
const CHECKOUT_STEP = { FORM: 'form', PROCESSING: 'processing', SUCCESS: 'success', ERROR: 'error' };

// ─── Main Component ────────────────────────────────────────────────────────
const ProductList = ({ products, onProductInquiry }) => {
  const [selectedProduct, setSelectedProduct]   = useState(null); // for detail modal
  const [buyProduct, setBuyProduct]             = useState(null); // for checkout modal
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);
  const [checkoutStep, setCheckoutStep]         = useState(CHECKOUT_STEP.FORM);
  const [checkoutError, setCheckoutError]       = useState('');
  const [completedOrder, setCompletedOrder]     = useState(null);

  const [orderForm, setOrderForm] = useState({
    name: '', email: '', mobile: '', address: '', quantity: 1,
  });

  const openBuyModal = (product, packIdx = 0) => {
    setBuyProduct(product);
    setSelectedPackIndex(packIdx);
    setCheckoutStep(CHECKOUT_STEP.FORM);
    setCheckoutError('');
    setCompletedOrder(null);
    setOrderForm({ name: '', email: '', mobile: '', address: '', quantity: 1 });
  };

  const closeBuyModal = () => {
    setBuyProduct(null);
    setCheckoutStep(CHECKOUT_STEP.FORM);
    setCheckoutError('');
    setCompletedOrder(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── Full checkout flow ──────────────────────────────────────────────────
  const handleBuySubmit = async (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.email || !orderForm.mobile || !orderForm.address) {
      setCheckoutError('Please fill in all required fields.');
      return;
    }

    setCheckoutStep(CHECKOUT_STEP.PROCESSING);
    setCheckoutError('');

    const orderRequest = {
      name:      orderForm.name,
      address:   orderForm.address,
      mobile:    orderForm.mobile,
      email:     orderForm.email,
      productId: buyProduct.id,
      packIndex: selectedPackIndex,
      quantity:  parseInt(orderForm.quantity, 10) || 1,
    };

    let createdOrder = null;
    try {
      // Step 1 — Create order in backend
      createdOrder = await createOrder(orderRequest);
    } catch (err) {
      setCheckoutError(err.message || 'Failed to create order. Please try again.');
      setCheckoutStep(CHECKOUT_STEP.ERROR);
      return;
    }

    // Step 2 — Try Razorpay payment
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Razorpay script failed to load.');

      const paymentOrder = await createOrderPayment(createdOrder.id);

      // If backend returns a valid Razorpay order ID, open checkout
      if (paymentOrder?.razorpayOrderId && paymentOrder.keyId && !paymentOrder.keyId.startsWith('YOUR_')) {
        const paymentResult = await openRazorpayCheckout(paymentOrder, {
          name:   orderForm.name,
          email:  orderForm.email,
          mobile: orderForm.mobile,
        });

        // Step 3 — Verify payment
        await verifyPayment(paymentResult);
        setCompletedOrder({ ...createdOrder, paymentStatus: 'paid' });
        setCheckoutStep(CHECKOUT_STEP.SUCCESS);
      } else {
        // Razorpay not configured — order is placed, redirect to WhatsApp for payment
        setCompletedOrder({ ...createdOrder, paymentStatus: 'whatsapp' });
        setCheckoutStep(CHECKOUT_STEP.SUCCESS);
      }
    } catch (err) {
      if (err.message === 'Payment cancelled by user.') {
        // Order exists but not paid — show WhatsApp option
        setCompletedOrder({ ...createdOrder, paymentStatus: 'cancelled' });
        setCheckoutStep(CHECKOUT_STEP.SUCCESS);
      } else {
        // Still show success for order; payment can be done via WhatsApp
        setCompletedOrder({ ...createdOrder, paymentStatus: 'whatsapp' });
        setCheckoutStep(CHECKOUT_STEP.SUCCESS);
      }
    }
  };

  // WhatsApp fallback for a placed order
  const openWhatsAppPayment = (order) => {
    const pack = buyProduct?.packs?.[selectedPackIndex];
    const msg = encodeURIComponent(
      `Hi Dr. Keval, I have placed an order on your SUTRA Holistic Care portal.\n\nOrder ID: ${order?.id || 'N/A'}\nProduct: ${buyProduct?.name}\nPack: ${pack ? `${pack.weight}g` : ''}\nQty: ${orderForm.quantity}\nName: ${orderForm.name}\nPhone: ${orderForm.mobile}\nAddress: ${orderForm.address}\n\nPlease share the payment link. Thank you!`
    );
    window.open(`https://wa.me/919537051626?text=${msg}`, '_blank');
  };

  return (
    <section id="products" className="py-20 bg-bg-cream relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-primary-dark font-sans uppercase">DOCTOR FORMULATED</span>
          <h2 className="mt-3 font-serif text-4xl font-extrabold tracking-tight text-text-dark sm:text-5xl">
            Blend Sutra Products
          </h2>
          <p className="mt-4 text-base text-text-light max-w-xl mx-auto">
            Handcrafted in small batches by Dr. Keval Dankhara. Made from 100% wild-harvested herbs, 
            preservative-free, and designed to heal the root cause of chronic issues.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const firstPack = product.packs?.[0];
            const displayPrice = firstPack?.price || product.price || 0;
            const isAvailable = product.active !== false && product.inStock !== false;

            return (
              <div
                key={product.id || product.name}
                className="rounded-2xl bg-white border border-primary/10 hover:border-primary/30 shadow-xs hover:shadow-xl p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
              >
                {!product.image && (
                  <div className="absolute top-4 right-4 text-primary/20 group-hover:text-primary/40 transition-colors">
                    <Leaf className="h-10 w-10 stroke-1" />
                  </div>
                )}

                <div>
                  {/* Product Image */}
                  {product.image && (
                    <div className="h-48 w-full mb-6 rounded-xl overflow-hidden flex items-center justify-center bg-slate-50/50 p-2">
                      <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}

                  {/* Stock tag */}
                  <div className="mb-4">
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        <Check className="h-3 w-3" /> In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-serif text-2xl font-bold text-text-dark group-hover:text-primary-dark transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-primary-dark font-semibold tracking-wider font-sans uppercase mt-1">
                    Radhe Clinic Special
                  </p>
                  <p className="mt-3 text-sm text-text-light line-clamp-2 leading-relaxed">
                    {product.description || 'Doctor-formulated holistic blend.'}
                  </p>

                  {/* Pack size chips */}
                  {product.packs && product.packs.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {product.packs.map((pack, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold bg-primary/10 text-primary-dark rounded-full px-2.5 py-0.5 border border-primary/20"
                        >
                          {pack.weight}g — ₹{pack.price}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pricing & Footer Actions */}
                <div className="mt-6 pt-6 border-t border-primary/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-text-light block leading-none">Starting at</span>
                    <span className="font-serif text-2xl font-extrabold text-text-dark">
                      ₹{displayPrice}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {/* Detail eye button */}
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-primary/30 text-text-dark hover:border-primary-dark hover:text-primary-dark transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {/* Buy Now button */}
                    <button
                      onClick={() => openBuyModal(product, 0)}
                      disabled={!isAvailable}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-text-dark font-semibold hover:bg-primary-dark hover:text-white px-4 py-2.5 text-xs uppercase tracking-wider transition-all duration-200"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Detail Modal ───────────────────────────────────────────────── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-bg-cream rounded-3xl overflow-hidden shadow-2xl border border-primary/20 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-primary/15 bg-white flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-primary-dark uppercase block">Product Details</span>
                <h3 className="font-serif text-2xl font-bold text-text-dark">{selectedProduct.name}</h3>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-text-light hover:text-text-dark hover:bg-slate-100 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
              {selectedProduct.image && (
                <div className="w-full h-64 rounded-2xl overflow-hidden bg-slate-50/50 flex items-center justify-center p-4">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold tracking-wider text-text-dark uppercase font-sans mb-2">Description</h4>
                <p className="text-sm text-text-light leading-relaxed">{selectedProduct.description || 'Crafted with premium organic herbs.'}</p>
              </div>

              {/* Ingredients */}
              {selectedProduct.ingredients?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-text-dark uppercase font-sans mb-3 flex items-center gap-1.5">
                    <Leaf className="h-4 w-4 text-emerald-600" /> Key Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.ingredients.map((ing) => (
                      <span key={ing} className="bg-emerald-50/50 border border-emerald-600/10 rounded-lg px-3 py-1.5 text-xs text-emerald-800 font-medium">{ing}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {selectedProduct.benefits?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-text-dark uppercase font-sans mb-3 flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-primary-dark" /> Key Benefits
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedProduct.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-text-light">
                        <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Usage */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-3">
                <HelpCircle className="h-5 w-5 text-primary-dark shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-text-dark font-sans uppercase">Dosage &amp; Usage Instructions</h5>
                  <p className="text-xs text-text-light mt-1 leading-relaxed">{selectedProduct.usage || 'Consult Dr. Keval Dankhara for personalized dosage instructions.'}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-primary/15 bg-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] text-text-light block leading-none">Starting at</span>
                <span className="font-serif text-2xl font-extrabold text-text-dark">₹{selectedProduct.packs?.[0]?.price || selectedProduct.price}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setSelectedProduct(null)} className="rounded-lg border border-slate-200 hover:bg-slate-50 px-5 py-2.5 text-xs font-semibold tracking-wider text-text-light uppercase">Close</button>
                <button
                  onClick={() => { openBuyModal(selectedProduct, 0); setSelectedProduct(null); }}
                  disabled={selectedProduct.active === false || selectedProduct.inStock === false}
                  className="flex items-center gap-2 rounded-lg bg-primary disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-text-dark font-bold hover:bg-primary-dark hover:text-white px-6 py-2.5 text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                >
                  <ShoppingBag className="h-4 w-4" /> Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Buy / Checkout Modal ────────────────────────────────────────── */}
      {buyProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-bg-cream rounded-3xl overflow-hidden shadow-2xl border border-primary/20 max-h-[95vh] flex flex-col">
            
            {/* Header */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary-dark to-primary shrink-0" />
            <div className="px-6 py-5 border-b border-primary/15 bg-white flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-primary-dark uppercase block">
                  {checkoutStep === CHECKOUT_STEP.SUCCESS ? 'Order Placed!' : 'Place Order'}
                </span>
                <h3 className="font-serif text-xl font-bold text-text-dark">{buyProduct.name}</h3>
              </div>
              <button onClick={closeBuyModal} className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-text-light hover:text-text-dark hover:bg-slate-100 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">

              {/* ── FORM STEP ── */}
              {checkoutStep === CHECKOUT_STEP.FORM && (
                <form onSubmit={handleBuySubmit} className="p-6 space-y-5 text-left">

                  {/* Pack Selector */}
                  {buyProduct.packs && buyProduct.packs.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                        <Package className="h-3.5 w-3.5 inline mr-1" />
                        Select Pack Size
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {buyProduct.packs.map((pack, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedPackIndex(i)}
                            className={`flex flex-col items-center p-3 rounded-xl border text-xs transition-all ${
                              selectedPackIndex === i
                                ? 'bg-primary border-primary text-text-dark font-bold shadow-md'
                                : 'bg-white border-primary/20 text-text-light hover:border-primary/50'
                            }`}
                          >
                            <span className="font-bold text-sm">{pack.weight}g</span>
                            <span className="font-serif font-extrabold text-base mt-0.5">₹{pack.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <label htmlFor="order-qty" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Quantity</label>
                    <input
                      type="number" id="order-qty" name="quantity"
                      value={orderForm.quantity} onChange={handleFormChange}
                      min="1" max="20" required
                      className="block w-24 rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden font-bold"
                    />
                  </div>

                  {/* Order Summary */}
                  {buyProduct.packs && buyProduct.packs[selectedPackIndex] && (
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-text-light">Order Total</p>
                        <p className="font-serif text-2xl font-extrabold text-text-dark">
                          ₹{(buyProduct.packs[selectedPackIndex].price * (parseInt(orderForm.quantity) || 1)).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-text-light">{buyProduct.packs[selectedPackIndex].weight}g × {orderForm.quantity}</p>
                        <p className="text-xs font-semibold text-primary-dark">₹{buyProduct.packs[selectedPackIndex].price} each</p>
                      </div>
                    </div>
                  )}

                  <hr className="border-primary/10" />
                  <p className="text-xs font-bold text-text-dark uppercase tracking-wider">Delivery Details</p>

                  {/* Name */}
                  <div>
                    <label htmlFor="ord-name" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">Full Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-light/50"><User className="h-4 w-4" /></div>
                      <input type="text" id="ord-name" name="name" value={orderForm.name} onChange={handleFormChange} placeholder="e.g. Priyasheel Patel" required className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 pl-10 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label htmlFor="ord-email" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">Email *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-light/50"><Mail className="h-4 w-4" /></div>
                        <input type="email" id="ord-email" name="email" value={orderForm.email} onChange={handleFormChange} placeholder="you@example.com" required className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 pl-10 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden" />
                      </div>
                    </div>
                    {/* Mobile */}
                    <div>
                      <label htmlFor="ord-mobile" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">WhatsApp *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-light/50"><Phone className="h-4 w-4" /></div>
                        <input type="tel" id="ord-mobile" name="mobile" value={orderForm.mobile} onChange={handleFormChange} placeholder="+91 95370 51626" required className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 pl-10 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden" />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="ord-address" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">Delivery Address *</label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none text-text-light/50"><MapPin className="h-4 w-4" /></div>
                      <textarea id="ord-address" name="address" value={orderForm.address} onChange={handleFormChange} rows="2" placeholder="Full address with pincode" required className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 pl-10 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden resize-none" />
                    </div>
                  </div>

                  {checkoutError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md text-xs text-red-700 font-semibold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />{checkoutError}
                    </div>
                  )}

                  <div className="pt-2 flex gap-3">
                    <button type="button" onClick={closeBuyModal} className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 py-3 text-xs font-bold uppercase tracking-wider text-text-light">Cancel</button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-primary text-text-dark font-bold hover:bg-primary-dark hover:text-white py-3.5 text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" /> Place Order &amp; Pay
                    </button>
                  </div>

                  <p className="text-[10px] text-text-light text-center">
                    🔒 Secured by Razorpay. If online payment isn't available, you'll be guided via WhatsApp.
                  </p>
                </form>
              )}

              {/* ── PROCESSING STEP ── */}
              {checkoutStep === CHECKOUT_STEP.PROCESSING && (
                <div className="p-12 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary-dark mx-auto mb-4" />
                  <h4 className="font-serif text-xl font-bold text-text-dark">Processing your order…</h4>
                  <p className="text-sm text-text-light mt-2">Please wait while we create your order and prepare payment.</p>
                </div>
              )}

              {/* ── SUCCESS STEP ── */}
              {checkoutStep === CHECKOUT_STEP.SUCCESS && completedOrder && (
                <div className="p-8 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-text-dark">
                    {completedOrder.paymentStatus === 'paid' ? 'Order Confirmed & Paid! 🎉' : 'Order Placed Successfully!'}
                  </h4>
                  {completedOrder.id && (
                    <p className="text-[10px] font-mono text-slate-400">Order ID: {completedOrder.id}</p>
                  )}
                  <p className="text-sm text-text-light leading-relaxed">
                    Thank you, <strong>{orderForm.name}</strong>. Your order for <strong>{buyProduct.name}</strong> has been received.
                    {completedOrder.paymentStatus !== 'paid' && (
                      <> Our team will contact you on <strong>{orderForm.mobile}</strong> to confirm and process payment.</>
                    )}
                  </p>

                  {/* WhatsApp tracking notice */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-start gap-2 text-left">
                      <svg className="h-4 w-4 shrink-0 fill-current text-emerald-600 mt-0.5" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      <span>Once your order ships, you'll receive a <strong>WhatsApp message</strong> with your courier tracking ID so you can track your package.</span>
                  </div>

                  {/* WhatsApp button if not paid online */}
                  {completedOrder.paymentStatus !== 'paid' && (
                    <button
                      onClick={() => openWhatsAppPayment(completedOrder)}
                      className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 text-sm uppercase tracking-wider shadow-md transition-all"
                    >
                      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      Complete Payment via WhatsApp
                    </button>
                  )}

                  <button
                    onClick={closeBuyModal}
                    className="w-full rounded-xl border border-slate-200 hover:bg-slate-50 py-3 text-xs font-bold uppercase tracking-wider text-text-light"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* ── ERROR STEP ── */}
              {checkoutStep === CHECKOUT_STEP.ERROR && (
                <div className="p-8 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500 mb-4">
                    <AlertCircle className="h-10 w-10" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-text-dark">Order Failed</h4>
                  <p className="text-sm text-red-600">{checkoutError}</p>
                  <button onClick={() => setCheckoutStep(CHECKOUT_STEP.FORM)} className="w-full rounded-xl bg-primary text-text-dark font-bold hover:bg-primary-dark hover:text-white py-3 text-xs uppercase tracking-wider">Try Again</button>
                  <button onClick={closeBuyModal} className="w-full rounded-xl border border-slate-200 hover:bg-slate-50 py-2.5 text-xs font-bold uppercase tracking-wider text-text-light">Cancel</button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductList;
