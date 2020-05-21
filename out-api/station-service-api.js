var axios = require("axios");

const authApi = axios.create({
  baseURL: 'https://project-helios.eu.auth0.com',
  timeout: 1000,
  headers: { 'content-type': 'application/json' }
});

const stationServiceApi = axios.create({
  baseURL: process.env.STATION_API_URL,
  timeout: 1000,
  headers: { 'content-type': 'application/json' }
});

exports.getToken = async () => {
  return authApi.post('/oauth/token', {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    audience: process.env.STATION_API_AUDIENCE,
    grant_type: "client_credentials"
  })
    .then(response => {
      const token = response.data;
      stationServiceApi.defaults.headers.common['Authorization'] = `${token.token_type} ${token.access_token}`;
      authApi.defaults.headers.common['Authorization'] = `${token.token_type} ${token.access_token}`;
      return response.data;
    })
    .catch(error => {
      console.log(error)
    })
}

exports.getStations = async () => {
  return stationServiceApi.get('/stations')
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error)
    })
}

exports.createStation = async (station) => {
  return stationServiceApi.post('/stations',station)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error)
    })
}