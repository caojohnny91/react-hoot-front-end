// src/components/HootForm/HootForm.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as hootService from "../../services/hootService";
import styles from "./HootForm.module.css";

const HootForm = (props) => {
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    category: "News",
  });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (hootId) {
      props.handleUpdateHoot(hootId, formData);
    } else {
      props.handleAddHoot(formData);
    }
  };

  const { hootId, commentId } = useParams();

  // The first modification we’ll make to the functionality of the component relates to its initial state. If the user is updating a hoot, the inputs of our form should be prefilled with any existing hoot details. This will require calling upon the hootService.show() service within src/components/HootForm/HootForm.jsx
  // Notice the if condition and the inclusion of hootId in the dependency array. If a hootId is present, we make a request to our server, and use the hootData response to setFormData state. If there is no hootId, we leave the initial state of formData unchanged.
  useEffect(() => {
    const fetchHoot = async () => {
      const hootData = await hootService.show(hootId);
      setFormData(hootData);
    };
    if (hootId) fetchHoot();
  }, [hootId]);

  return (
    <main className={styles.container}>
      <form onSubmit={handleSubmit}>
        <h1>{hootId ? "Edit Hoot" : "New Hoot"}</h1>

        <label htmlFor="title-input">Title</label>
        <input required type="text" name="title" id="title-input" value={formData.title} onChange={handleChange} />
        <label htmlFor="text-input">Text</label>
        <textarea required type="text" name="text" id="text-input" value={formData.text} onChange={handleChange} />
        <label htmlFor="category-input">Category</label>
        <select required name="category" id="category-input" value={formData.category} onChange={handleChange}>
          <option value="News">News</option>
          <option value="Games">Games</option>
          <option value="Music">Music</option>
          <option value="Movies">Movies</option>
          <option value="Sports">Sports</option>
          <option value="Television">Television</option>
        </select>
        <button type="submit">SUBMIT</button>
      </form>
    </main>
  );
};

export default HootForm;
