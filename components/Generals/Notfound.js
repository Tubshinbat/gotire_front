import { faInbox } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const NotFound = () => {
  return (
    <>
      <section>
        <div className="container">
          <div className="notFound">
            <FontAwesomeIcon icon={faInbox} />
            <h2> Өгөгдөл </h2>
            <p> олдсонгүй </p>
            <Link href="/"> Нүүр хуудас</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
