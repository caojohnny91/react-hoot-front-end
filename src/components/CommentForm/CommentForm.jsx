// src/components/CommentForm/CommentForm.jsx
import { useState, useEffect } from "react";
import * as hootService from "../../services/hootService";
import { useParams } from "react-router-dom";
import * as hootService from "../../services/hootService";

const CommentForm = (props) => {
  const [formData, setFormData] = useState({ text: "" });
  const { hootId, commentId } = useParams();

  // Fetch existing comment data if commentId exists
  useEffect(() => {
    if (commentId) {
      const fetchComment = async () => {
        const commentData = await hootService.getComment(hootId, commentId);
        setFormData({ text: commentData.text });
      };
      fetchComment();
    }
  }, [hootId, commentId]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (commentId) {
      // handleUpdateComment if commentId exists
      props.handleUpdateComment(commentId, formData);
    } else {
      // handleAddComment if no commentId (new comment)
      props.handleAddComment(formData);
    }
    setFormData({ text: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="text-input">Your comment:</label>
      <textarea required type="text" name="text" id="text-input" value={formData.text} onChange={handleChange} />
      <button type="submit">SUBMIT COMMENT</button>
    </form>
  );
};

export default CommentForm;
