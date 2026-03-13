import http from 'k6/http';
import { check, fail } from 'k6';
import { AUTH_LOGIN_PATH, AUTH_REGISTER_PATH, BASE_URL, ORDERS_PATH, PASSWORD, uniqueEmail } from './config.js';

const jsonHeaders = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export function registerUser(email, name = 'K6 User') {
  const payload = JSON.stringify({
    name,
    email,
    password: PASSWORD,
  });

  return http.post(`${BASE_URL}${AUTH_REGISTER_PATH}`, payload, jsonHeaders);
}

export function loginUser(email) {
  const payload = JSON.stringify({
    email,
    password: PASSWORD,
  });

  return http.post(`${BASE_URL}${AUTH_LOGIN_PATH}`, payload, jsonHeaders);
}

export function ensureAuthenticatedUser(prefix = 'k6-user') {
  const email = uniqueEmail(prefix);
  const registerResponse = registerUser(email);

  check(registerResponse, {
    'register returned 200/201/409': (res) => [200, 201, 409].includes(res.status),
  });

  const loginResponse = loginUser(email);

  check(loginResponse, {
    'login returned 200': (res) => res.status === 200,
    'login has token': (res) => Boolean(res.json('token')),
  });

  if (loginResponse.status !== 200) {
    fail(`Nao foi possivel autenticar o usuario de teste. Status: ${loginResponse.status}`);
  }

  return {
    email,
    token: loginResponse.json('token'),
    authType: loginResponse.json('type') || 'Bearer',
  };
}

export function authHeaders(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
}

export function createOrder(token, productName, quantity = 1) {
  return http.post(
    `${BASE_URL}${ORDERS_PATH}`,
    JSON.stringify({ productName, quantity }),
    authHeaders(token),
  );
}

export function listOrders(token) {
  return http.get(`${BASE_URL}${ORDERS_PATH}`, authHeaders(token));
}
