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

const show = async (hootId) => {
  try {
    const res = await fetch(`${BASE_URL}/${hootId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

// Next we’ll build out the create service function. This will differ from previous service functions in this code-along, as it will require a POST request method. When using the Fetch API to make POST requests, we’ll need to include a few additional properties in our request:

// method: The method property specifies the method of our request. With the Fetch API, this property is necessary whenever making a request other than the default GET.

// body: The body property specifies the form data to include in the request. We’ll make use of the JSON.stringify() method here. Check out this link for more info on the JSON object.

// 'Content-Type': Within our headers object, we’ll also need to specify the data type of the information included in the body property. In this case, we’ll set it to 'application/json'
const create = async (hootFormData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hootFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

// Time to build out the service function. Despite being another resource, our comment service functions will live inside src/services/hootService.js. This is because all of the endpoints for comments will share the same BASE_URL as hoots ('/hoots'). We’ll append more specific endpoints to each comment service function as necessary.
const createComment = async (hootId, commentFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${hootId}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const deleteHoot = async (hootId) => {
  try {
    const res = await fetch(`${BASE_URL}/${hootId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export { index, show, create, createComment, deleteHoot };
