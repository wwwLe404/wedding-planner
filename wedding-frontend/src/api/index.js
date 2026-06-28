const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

// Wedding Plans
export const weddingPlanApi = {
  getAll: ()            => request('/wedding-plans'),
  getById: (id)         => request(`/wedding-plans/${id}`),
  create: (data)        => request('/wedding-plans', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data)    => request(`/wedding-plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id)          => request(`/wedding-plans/${id}`, { method: 'DELETE' }),
  getGuests: (id)       => request(`/wedding-plans/${id}/guests`),
  getTasks: (id)        => request(`/wedding-plans/${id}/tasks`),
}

// Guests
export const guestApi = {
  getAll: ()                        => request('/guests'),
  getById: (id)                     => request(`/guests/${id}`),
  create: (data)                    => request('/guests', { method: 'POST', body: JSON.stringify(data) }),
  createForWeddingPlan: (weddingPlanId, data) =>
    request(`/guests/wedding-plan/${weddingPlanId}`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data)                => request(`/guests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id)                      => request(`/guests/${id}`, { method: 'DELETE' }),
}

// Tasks
export const taskApi = {
  getAll: ()                        => request('/tasks'),
  getById: (id)                     => request(`/tasks/${id}`),
  create: (data)                    => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  createForWeddingPlan: (weddingPlanId, data) =>
    request(`/tasks/wedding-plan/${weddingPlanId}`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data)                => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id)                      => request(`/tasks/${id}`, { method: 'DELETE' }),
}

export const weatherApi = {
  getByCity: (city) => request(`/weather?city=${encodeURIComponent(city)}`)
}