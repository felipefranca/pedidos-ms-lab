import { sleep } from 'k6';
import { check } from 'k6';
import { ensureAuthenticatedUser, createOrder, listOrders } from '../lib/helpers.js';

export const options = {
  vus: Number(__ENV.VUS || 1),
  iterations: Number(__ENV.ITERATIONS || 1),
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
  const session = ensureAuthenticatedUser('k6-smoke');

  const createResponse = createOrder(session.token, `Smoke Order ${__VU}-${__ITER}`, 1);
  check(createResponse, {
    'create order status 200/201': (res) => [200, 201].includes(res.status),
    'create order has id': (res) => Boolean(res.json('id')),
  });

  const listResponse = listOrders(session.token);
  check(listResponse, {
    'list orders status 200': (res) => res.status === 200,
    'list orders returns array': (res) => Array.isArray(res.json()),
  });

  sleep(1);
}
