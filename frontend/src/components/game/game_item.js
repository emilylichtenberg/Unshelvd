import React from "react";

class GameItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    const { currentUser, game, openModal } = this.props;
    return(
      <li className="library-index-item" onClick={() => openModal(game)}>
        <img src={game.image} alt={game.image} id="game-img--library"/>
        <h1 id={game.image === "https://github.com/Bill-the-dev/Unshelvd_MERN/blob/main/z-images/game-piece-1.png?raw=true" ? "game-title--user-created" : "game-title--library"}>{game.name}</h1>
      </li>
    )
  }

}


export default GameItem;