import React from "react";
import { Link } from "react-router-dom";


class LibraryItem extends React.Component {
  constructor(props) {
    super(props);
  }


  render(){
    const { currentUser, game } = this.props;
    return(
      <div>
        <Link to={`/library/games/${game._id}`}>
          <li className="library-index-item">

            <img src={game.image} alt={game.image} id="game-img--library" />
              <h1 id={game.image === "https://github.com/Bill-the-dev/Unshelvd_MERN/blob/main/z-images/game-piece-1.png?raw=true" ? "game-title--user-created" : "game-title--library"}>{game.name}</h1>
          </li>
        </Link>
      </div>
    )
  }

}


export default LibraryItem;