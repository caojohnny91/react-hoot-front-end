import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as hootService from "../../services/hootService";

const HootDetails = (props) => {
  const { hootId } = useParams(); // find the params on the url and expose them in an object

  // Confirm that you have access to the hootId in src/components/HootDetails/HootDetails.jsx.
  // Now that we have the hootId, we should be able to retrieve details for that hoot from out backend using a new service function.
  console.log("hootId", hootId);

  // Create a new useState() variable called hoot with an initial value of null
  const [hoot, setHoot] = useState(null);

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

  //   If you included the console.log() in the step above, you might notice that the hoot state is null when the component first mounts. This can cause some issues if we try to render data that is not yet present in the component. Let’s add a condition to account for that.
  if (!hoot) return <main>Loading...</main>;

  return (
    <main>
      <header>
        <p>{hoot.category.toUpperCase()}</p>
        <h1>{hoot.title}</h1>
        <p>
          {hoot.author.username} posted on
          {new Date(hoot.createdAt).toLocaleDateString()}
        </p>
      </header>
      <p>{hoot.text}</p>

      {/* Notice the <section> tag at the bottom. This will act as our ‘Comments’ section. The commentSchema is embedded within hootSchema, so the relevant comment data should already exist within this component’s hoot state. */}
      <section>
        {/* To display a hoot’s associated comments, we’ll want to map() over hoot.comments and produce a list of <article> tags.
        
        Each comment’s <article> tag should include a few things:

        The username of the comment’s author.
        The createdAt date property of the the comment.
        The text content of the comment. */}
        <h2>Comments</h2>

        {!hoot.comments.length && <p>There are no comments.</p>}

        {hoot.comments.map((comment) => (
          <article key={comment._id}>
            <header>
              <p>
                {comment.author.username} posted on{" "}
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </header>
            <p>{comment.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default HootDetails;
