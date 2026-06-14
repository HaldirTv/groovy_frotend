const GATEWAY_URL = 'https://localhost:7005';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: string;
}

export async function register(data: RegisterData) {
  const res = await fetch(`${GATEWAY_URL}/auth/register`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'include' 
  });

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(result?.Message || result?.title || `Помилка з'єднання: ${res.status}`);
  }

  return result;
}

export interface ConfirmData {
  email: string;
  code: string;
}

export async function confirmRegister(data: ConfirmData) {
  const res = await fetch(`${GATEWAY_URL}/auth/confirmregister`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'include'
  });

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(result?.Message || result?.title || `Помилка з'єднання: ${res.status}`);
  }

  return result;
}