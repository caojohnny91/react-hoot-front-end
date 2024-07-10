const BASE_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/hoots`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    // Notice the inclusion of the headers property. The headers property is an object containing any headers that need to be sent along with the request. In this case, we are including an 'Authorization' header with a bearer token. This token is decoded by the verifyToken middleware function on our server, allowing us to indentify the logged in user, and ensuring that only a logged in user can access this functionality.
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export { index };
