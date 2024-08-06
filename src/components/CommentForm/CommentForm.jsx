// src/components/CommentForm/CommentForm.jsx
import { useState, useEffect } from "react";
import * as hootService from "../../services/hootService";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./CommentForm.module.css";

const CommentForm = (props) => {
  const [formData, setFormData] = useState({ text: "" });
  const { hootId, commentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHoot = async () => {
      try {
        const hootData = await hootService.show(hootId);
        // Find comment in fetched hoot data
        const commentToEdit = hootData.comments.find((comment) => comment._id === commentId);
        if (commentToEdit) {
          setFormData({ text: commentToEdit.text });
        }
      } catch (error) {
        console.error("Failed to fetch hoot or comment data:", error);
      }
    };
    if (hootId && commentId) fetchHoot();
  }, [hootId, commentId]);
  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (hootId && commentId) {
      try {
        // Update the comment
        const updatedComment = await hootService.updateComment(hootId, commentId, formData);

        // Update the state in the parent component (if passed as a prop)
        if (props.handleUpdateCommentInState) {
          props.handleUpdateCommentInState(updatedComment);
        }

        // Navigate back to the hoot details page
        navigate(`/hoots/${hootId}`);
      } catch (error) {
        console.error("Failed to update comment:", error);
      }
    } else {
      // Handle adding a new comment
      props.handleAddComment(formData);
    }

    setFormData({ text: "" });
  };

  if (hootId && commentId)
    return (
      <main className={styles.container}>
        <form onSubmit={handleSubmit}>
          <h1>Edit Comment</h1>
          <label htmlFor="text-input">Your comment:</label>
          <textarea required type="text" name="text" id="text-input" value={formData.text} onChange={handleChange} />
          <button type="submit">SUBMIT</button>
        </form>
      </main>
    );

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="text-input">Your comment:</label>
      <textarea required type="text" name="text" id="text-input" value={formData.text} onChange={handleChange} />
      <button type="submit">SUBMIT COMMENT</button>
    </form>
  );
};

export default CommentForm;
