import axios from "axios";

const TOKEN = "cgc7p29r01qsquh3ft3gcgc7p29r01qsquh3ft40";

export default axios.create({
  baseURL: "https://finnhub.io/api/v1",
  params: {
    token: TOKEN
  }
});
