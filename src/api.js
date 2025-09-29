// Simple mock API file. Replace fetchers with real API calls.
export async function fetchDashboard() {
return Promise.resolve({
totalBookings: 124,
revenue: 452900000,
availableCars: 28,
})
}


export async function fetchCars() {
return Promise.resolve([
{ id: 1, plate: '30A-12345', model: 'Toyota Innova', status: 'available' },
{ id: 2, plate: '29X-88888', model: 'Hyundai Accent', status: 'rented' },
])
}


export async function fetchBookings(query = {}) {
return Promise.resolve([
{ id: 101, customer: 'Nguyen Van A', car: 'Toyota Innova', from: '2025-09-20', to: '2025-09-22', status: 'pending' },
])
}