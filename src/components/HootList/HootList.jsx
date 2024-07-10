import { Link } from "react-router-dom";

const HootList = (props) => {
  return (
    // Notice how we are wrapping the <article> with a Link component. The to property specifies the URL a user should be directed to when the Link is clicked. Think of the value assigned to the to property as an argument passed into a function. Once we add params (:hootId) on a corresponding client side route, this Link will direct a user to a details page for a specific hoot whenever they click on a card.
    <main>
      {props.hoots.map((hoot) => (
        <Link key={hoot._id} to={`/hoots/${hoot._id}`}>
          <article>
            <header>
              <h2>{hoot.title}</h2>
              <p>
                {hoot.author.username} posted on{" "}
                {new Date(hoot.createdAt).toLocaleDateString()}
              </p>
            </header>
            <p>{hoot.text}</p>
          </article>
        </Link>
      ))}
    </main>
  );
};
export default HootList;
