export const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
export const AUTH_REGISTER_PATH = __ENV.AUTH_REGISTER_PATH || '/api/auth/register';
export const AUTH_LOGIN_PATH = __ENV.AUTH_LOGIN_PATH || '/api/auth/login';
export const ORDERS_PATH = __ENV.ORDERS_PATH || '/api/orders';
export const ORDER_STATUS_PATH_TEMPLATE = __ENV.ORDER_STATUS_PATH_TEMPLATE || '/api/orders/{id}/status';
export const PASSWORD = __ENV.TEST_PASSWORD || 'pedidos123!';

export function uniqueEmail(prefix = 'k6-user') {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  return `${prefix}-${suffix}@playground.local`;
}
