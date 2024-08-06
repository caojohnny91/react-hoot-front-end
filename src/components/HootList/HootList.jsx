import { Link } from "react-router-dom";
import styles from "./HootList.module.css";
import Icon from "../Icon/Icon";
import AuthorInfo from "../../components/AuthorInfo/AuthorInfo";

const HootList = (props) => {
  return (
    // Notice how we are wrapping the <article> with a Link component. The to property specifies the URL a user should be directed to when the Link is clicked. Think of the value assigned to the to property as an argument passed into a function. Once we add params (:hootId) on a corresponding client side route, this Link will direct a user to a details page for a specific hoot whenever they click on a card.
    <main className={styles.container}>
      {props.hoots.map((hoot) => (
        <Link key={hoot._id} to={`/hoots/${hoot._id}`}>
          <article>
            <header>
              <div>
                <h2>{hoot.title}</h2>
                <Icon category={hoot.category} />
              </div>
              <AuthorInfo content={hoot} />
            </header>
            <p>{hoot.text}</p>
          </article>
        </Link>
      ))}
    </main>
  );
};
export default HootList;
