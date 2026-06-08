import { api } from './api.js';

/**
 * Create an order (public)
 * OrderRequest: { name, address, mobile, email, productId, packIndex, quantity }
 * Returns Order: { id, name, address, mobile, email, quantity, totalAmount, product, selectedPack, status, date, paymentId }
 */
export const createOrder = (orderRequest) =>
  api.post('/user/orders', orderRequest);

/**
 * Get order by id (public)
 */
export const getOrder = (id) => api.get(`/user/orders/${id}`);

/**
 * Get orders by customer email (public)
 */
export const getOrdersByEmail = (email) => api.get(`/user/orders/email/${email}`);

// ─── Payment APIs ─────────────────────────────────────────────

/**
 * Create Razorpay payment order for a product order
 * Returns PaymentOrderResponse: { razorpayOrderId, referenceId, amount (paise), currency, keyId, description }
 */
export const createOrderPayment = (orderId) =>
  api.post(`/user/payments/order/${orderId}`);

/**
 * Verify payment after Razorpay checkout success
 * PaymentVerifyRequest: { razorpayOrderId, razorpayPaymentId, razorpaySignature, referenceId }
 */
export const verifyPayment = (verifyRequest) =>
  api.post('/user/payments/verify', verifyRequest);

// ─── Admin order management (JWT required) ────────────────────

/**
 * Get all orders (admin)
 */
export const getAllOrdersAdmin = () => api.get('/admin/orders');

/**
 * Update order status (admin)
 * status: PENDING | CONFIRMED | SHIPPED | DELIVERED | CANCELLED
 */
export const updateOrderStatusAdmin = (id, status) =>
  api.putQuery(`/admin/orders/${id}/status?status=${status}`);

// ─── Razorpay helpers ─────────────────────────────────────────

/**
 * Dynamically load the Razorpay checkout.js script
 */
export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src   = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

/**
 * Open Razorpay checkout and return a Promise that resolves with payment data on success
 * or rejects with an error if the user dismisses or payment fails.
 */
export const openRazorpayCheckout = (paymentOrderResponse, customerInfo) =>
  new Promise((resolve, reject) => {
    const options = {
      key:         paymentOrderResponse.keyId,
      amount:      paymentOrderResponse.amount,       // in paise
      currency:    paymentOrderResponse.currency || 'INR',
      name:        'Sutra Holistic Care',
      description: paymentOrderResponse.description || 'Product Order',
      order_id:    paymentOrderResponse.razorpayOrderId,
      prefill: {
        name:    customerInfo.name,
        email:   customerInfo.email,
        contact: customerInfo.mobile,
      },
      theme: { color: '#C9A84C' },
      handler: (response) => {
        resolve({
          razorpayOrderId:   response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          referenceId:       paymentOrderResponse.referenceId,
        });
      },
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled by user.')),
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (resp) => reject(new Error(resp.error?.description || 'Payment failed.')));
    rzp.open();
  });
