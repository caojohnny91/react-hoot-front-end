import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import * as hootService from "../../services/hootService";
import CommentForm from "../CommentForm/CommentForm";
import { AuthedUserContext } from "../../App";
import { Link } from "react-router-dom";
import styles from "./HootDetails.module.css";
import Loading from "../Loading/Loading";
import Icon from "../Icon/Icon";
import AuthorInfo from "../../components/AuthorInfo/AuthorInfo";

const HootDetails = (props) => {
  const { hootId } = useParams(); // find the params on the url and expose them in an object

  // Confirm that you have access to the hootId in src/components/HootDetails/HootDetails.jsx.
  // Now that we have the hootId, we should be able to retrieve details for that hoot from out backend using a new service function.
  console.log("hootId", hootId);

  // Create a new useState() variable called hoot with an initial value of null
  const [hoot, setHoot] = useState(null);
  const user = useContext(AuthedUserContext);

  useEffect(() => {
    const fetchHoot = async () => {
      const hootData = await hootService.show(hootId);
      console.log("hootData", hootData);
      setHoot(hootData);
    };
    fetchHoot();
  }, [hootId]);

  // Verify that hoot state is being set correctly:
  console.log("hoot state:", hoot);

  const handleAddComment = async (commentFormData) => {
    // console.log("commentFormData", commentFormData);
    const newComment = await hootService.createComment(hootId, commentFormData);
    // Within the hoot object, there is a comments property containing an array of comment objects. This array is the property we need to add our newComment to. To do so, we copy the existing hoot.comments array (again, using the spread operator), include the newComment at the end of the array, and finally assign this array to the comments property of the hoot
    // Set state to an empty object:
    // setHoot({});

    // Set state to an object that includes all properties currently in Hoot state:
    // setHoot({ ...hoot });

    // Much like the step above, except now the comments property of the object
    // being set to state has its value set to an empty array:
    // setHoot({ ...hoot, comments: [] });

    // Now the comments property of the object will include a copy of all
    // the comments that already exist in hoot state.
    // setHoot({ ...hoot, comments: [...hoot.comments] });

    // And finally, we include the newComment at the end of the array:
    setHoot({ ...hoot, comments: [...hoot.comments, newComment] });
  };

  const handleDeleteComment = async (commentId) => {
    console.log("commentId:", commentId);

    try {
      // Call the deleteComment service function with hootId and commentId
      await hootService.deleteComment(hoot._id, commentId);

      // Update the state to filter out the deleted comment
      setHoot({
        ...hoot,
        comments: hoot.comments.filter((comment) => comment._id !== commentId),
      });
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  // If you included the console.log() in the step above, you might notice that the hoot state is null when the component first mounts. This can cause some issues if we try to render data that is not yet present in the component. Let’s add a condition to account for that.
  if (!hoot) return <Loading />;

  return (
    <main className={styles.container}>
      {/* Notice the <section> tag at the bottom. This will act as our ‘Comments’ section. The commentSchema is embedded within hootSchema, so the relevant comment data should already exist within this component’s hoot state. */}
      <section>
        <header>
          <p>{hoot.category.toUpperCase()}</p>
          <h1>{hoot.title}</h1>
          <div>
            <AuthorInfo content={hoot} />
            {/* Time to add some conditional rendering for our button.
        For our conditional rendering, we’ll make use of the Logical AND ( && ) operator.
        If the hoot.author._id matches user._id, this piece of UI should be visible. If not, the UI should not be rendered. This means only the author of this particular hoot will be able to access the UI for updating or deleting a Hoot */}
            {hoot.author._id === user._id && (
              <>
                <Link to={`/hoots/${hootId}/edit`}>
                  <Icon category="Edit" />
                </Link>
                <button onClick={() => props.handleDeleteHoot(hootId)}>
                  <Icon category="Trash" />
                </button>
              </>
            )}
          </div>
        </header>
        <p>{hoot.text}</p>
      </section>
      <section>
        {/* To display a hoot’s associated comments, we’ll want to map() over hoot.comments and produce a list of <article> tags.
        
        Each comment’s <article> tag should include a few things:

        The username of the comment’s author.
        The createdAt date property of the the comment.
        The text content of the comment. */}
        <h2>Comments</h2>
        <CommentForm handleAddComment={handleAddComment} />

        {!hoot.comments.length && <p>There are no comments.</p>}

        {hoot.comments.map((comment) => (
          <article key={comment._id}>
            <header>
              <div>
                <AuthorInfo content={comment} />

                {comment.author._id === user._id && (
                  <>
                    <Link to={`/hoots/${hootId}/comments/${comment._id}/edit`}>
                      <Icon category="Edit" />
                    </Link>
                    <button onClick={() => handleDeleteComment(comment._id)}>
                      <Icon category="Trash" />
                    </button>
                  </>
                )}
              </div>
            </header>
            <p>{comment.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default HootDetails;
