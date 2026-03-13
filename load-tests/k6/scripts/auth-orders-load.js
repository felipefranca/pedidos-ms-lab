import { sleep } from 'k6';
import { check } from 'k6';
import exec from 'k6/execution';
import { ensureAuthenticatedUser, createOrder, listOrders } from '../lib/helpers.js';

export const options = {
  scenarios: {
    auth_and_orders_ramp: {
      executor: 'ramping-vus',
      startVUs: Number(__ENV.START_VUS || 1),
      gracefulRampDown: '10s',
      stages: [
        { duration: __ENV.STAGE1_DURATION || '30s', target: Number(__ENV.STAGE1_TARGET || 5) },
        { duration: __ENV.STAGE2_DURATION || '1m', target: Number(__ENV.STAGE2_TARGET || 10) },
        { duration: __ENV.STAGE3_DURATION || '30s', target: Number(__ENV.STAGE3_TARGET || 0) },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1500', 'p(99)<2500'],
  },
};

const sessions = new Map();

function getSession() {
  const key = `${exec.vu.idInTest}`;
  if (!sessions.has(key)) {
    sessions.set(key, ensureAuthenticatedUser(`k6-load-vu-${key}`));
  }
  return sessions.get(key);
}

export default function () {
  const session = getSession();

  const createResponse = createOrder(session.token, `Load Order ${__VU}-${__ITER}`, 99.9 + (__ITER % 3));
  check(createResponse, {
    'create order succeeded': (res) => [200, 201].includes(res.status),
  });

  const listResponse = listOrders(session.token);
  check(listResponse, {
    'list orders succeeded': (res) => res.status === 200,
    'list orders returns array': (res) => Array.isArray(res.json()),
  });

  sleep(Number(__ENV.SLEEP_SECONDS || 1));
}
