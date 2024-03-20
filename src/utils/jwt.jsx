const { jwtDecode } = require("jwt-decode");

export const decodedToken = (token) => {
  return jwtDecode(token);
};
