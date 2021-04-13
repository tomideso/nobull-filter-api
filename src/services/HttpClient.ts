const axios = require("axios");

const base_uri = "api.webflow.com";

// instance.defaults.crossdomain = true;
// axios.defaults.withCredentials = true;

class HttpClient {
  private access_token;
  private client;

  constructor(token) {
    this.client = axios.create({
      baseURL: base_uri,
      timeout: 20000,
      headers: { "Content-Type": "application/json" },
    });
    this.access_token = token;
  }

  setToken(token) {
    this.access_token = token;
    return this;
  }

  getToken() {
    return this.access_token;
  }

  get(endpoint) {
    return this.client
      .get("/v3" + endpoint, {
        headers: { Authorization: "Bearer " + this.access_token },
      })
      .then((res) => {
        return res.data;
      });
  }

  post(endpoint, body) {
    if (!body) {
      body = {};
    }
    return this.client
      .post("/v3" + endpoint, body, {
        headers: { Authorization: "Bearer " + this.access_token },
      })
      .then((res) => {
        return res.data;
      });
  }

  put(endpoint, body) {
    if (!body) {
      body = {};
    }
    return this.client
      .put("/v3" + endpoint, body, {
        headers: { Authorization: "Bearer " + this.access_token },
      })
      .then((res) => {
        return res.data;
      });
  }

  delete(endpoint, body) {
    return this.client
      .delete(endpoint, {
        data: body,
        headers: { Authorization: "Bearer " + this.access_token },
      })
      .then((res) => {
        return res.data;
      });
  }

  getAccessToken(code) {
    return this.client({
      method: "post",
      url: "/oauth/access_token",
      data: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
      },
    }).then((res) => {
      this.setToken(res.data.access_token);
      return res.data;
    });
  }
}

export default HttpClient;
