// Where the app talks to. The API in /api runs on port 3100.
// Nothing else in the app hard-codes a URL — everything reads `environment.apiUrl`.
export const environment = {
  apiUrl: 'http://localhost:3100/api',
  limit: 10, // articles per page (the API also defaults to 10)
}
