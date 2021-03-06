import React from 'react';
import SuggestItem from './suggest_item';

class SuggestForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            currentUserGroups: [],
            library: '',
            numPlayers: '',
            category: [],
            gameType: [],
            errors: {},
            filteredGames: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearedErrors = false 
        this.categoryUpdate = this.categoryUpdate.bind(this);
        this.typeUpdate = this.typeUpdate.bind(this);
        this.clearForm = this.clearForm.bind(this);
    }

    componentDidMount(){
        this.props.fetchUser(this.props.sessionUser.id)
        this.props.fetchUsers()
        this.props.fetchGames()
        this.props.fetchGroups()
        .then(() => this.setState({currentUserGroups: Object.values(this.props.currentGroups).filter(group => group.users.includes(this.props.sessionUser.id))}))
    }

    update(field) {
        return e => this.setState({
            [field]: e.currentTarget.value
        });
    }

    categoryUpdate(e) {
        let selection = e.currentTarget
        let stateCopy = [...this.state.category]
        
        if (selection.checked) {
            this.setState({
                category: this.state.category.concat(selection.value)
            })
        } else {
            this.setState({
                category: stateCopy.filter(word => word !== selection.value)
            })
        }
    }

    typeUpdate(e) {
        let selection = e.currentTarget
        let stateCopy = [...this.state.gameType]
        if (selection.checked) {
            this.setState({
                gameType: this.state.gameType.concat(selection.value)
            })
        } else {
            this.setState({
                gameType: stateCopy.filter(word => word !== selection.value)
            })
        }
    }

    clearForm() {
        document.getElementById("suggest-form").reset();
    }


    handleSubmit(e) {
        const {allUsers, currentGroups, allGames} = this.props;

        e.preventDefault();
        let preferences = {
            library: this.state.library,
            numPlayers: this.state.numPlayers,
            category: this.state.category, 
            gameType: this.state.gameType 
        };
        let filteredGames = []
        
        const userPoolId = currentGroups[this.state.library]?.users
        let gamePool = []

        for (let i = 0; i < userPoolId?.length; i++) {
            gamePool = gamePool.concat(allUsers[userPoolId[i]]?.games)
            // debugger
        }
        // const realGamePool = gamePool.filter(item => {if (item) return item})
        const realGamePool = gamePool
        // debugger
        for (let i = 0; i < realGamePool.length; i++) {
            if (!filteredGames.includes(allGames[realGamePool[i]])) {
                filteredGames.push(allGames[realGamePool[i]])
            }
        }

        const categoryFilter = (game, player) => {
            for (const ele of player) {
                if (game.includes(ele)) return true
            }
            return false
        }

        const typeFilter = (game, player) => {
            for (const ele of player) {
                if (game.includes(ele)) return true
            }
            return false
        }

        let userFiltered = []

        filteredGames.forEach(game => {
            if ( 
                game?.playerCount.max >= parseInt(preferences?.numPlayers) && 
                game?.playerCount.min <= parseInt(preferences?.numPlayers) &&
                categoryFilter(game.category, preferences.category) &&
                typeFilter(game.gameType, preferences.gameType)
                ) userFiltered.push(game)
        })
        this.setState({
            filteredGames: userFiltered
        })
    }

    renderErrors() {
        // debugger
        return(
            <ul>
                {Object.keys(this.state.errors).map((error, i) => (
                    <li key={`error-${i}`}>
                        {this.state.errors[error]}
                    </li>
                ))}
            </ul>
        )
    }


    render() {
        const categories = ["Board Game", "Playing Cards", "Dice", "Pen & Paper", "App", "Party", "Word", "Puzzle", "Quick", "Team Play", "Bluffing", "Deduction"]
        return (
            <div className='suggest-form-container'>

                <div className='suggest-form-header'>
                    Get a Suggestion
                </div>

                <form id="suggest-form" className='suggest-form' onSubmit={this.handleSubmit}>

                    {/* LIBRARY SELECTOR */}
                    <div className='suggest-form-library'>
                        <h3>Choose a library:</h3>
                        <div>
                            <select onChange={this.update("library")}>
                                    <option value ></option>
                                {this.state.currentUserGroups.map((group, i) => {
                                    return <option key={i} value={group._id}>{group.name}</option>
                            })}
                            </select>
                        </div>
                    </div>

                    {/* NUMBER OF PLAYERS SELECTOR */}
                    <div className='suggest-form-numplayers'>
                        <h3>Number of Players:</h3>
                            <div>
                                <select onChange={this.update("numPlayers")}>
                                    <option value ></option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12+</option>
                                </select>
                            </div>
                    </div>


                    {/* CATEGORY SELECTOR */}
                    <div className='suggest-form-category'>
                        
                        <h2>Category:</h2>
                            <div className='category-grid'>
                                {categories.map((category) => (
                                    <label className='category-grid-item'>
                                        {category}
                                        <input type="checkbox" onChange = {(e) => this.categoryUpdate(e)} className='category-checkbox' value={category}/>
                                    </label>
                                ))}
                            </div>
                    </div>

                    {/* TYPE SELECTOR */}
                    <div className='suggest-form-type'>
                        <h2>What setting are you playing in?</h2>
                        <div>
                            <label>
                                Unplugged
                                <input type="checkbox" onChange = {(e) => this.typeUpdate(e)} className='type-checkbox' value={"Unplugged"}></input>
                            </label>
                        
                            <label>
                                Connected
                                <input type="checkbox" onChange = {(e) => this.typeUpdate(e)} className='type-checkbox' value={"Connected"}></input>
                            </label>
                        </div>
                    </div>

                    {/* FORM SUBMIT */}
                    <div className='suggest-form-submit'>
                        <input className="button button--go-fish" type="submit" value="Go Fish"/>
                        {this.renderErrors()}
                    </div>

                    <div className='suggest-form-clearform'>
                        <button className="button button--go-fish" onClick={() => this.clearForm()}>Clear selections</button>
                    </div>

                    {/* RESULTS OUTPUT */}
                    <div className='suggest-results'>
                    {
                        (this.state.filteredGames.length > 0 ) ?
                        <div className='results-container'>
                            <ul className='list-head'>
                            {this.state.filteredGames.map((game) => {
                                return(
                                <li key={ game.id}>
                                    <SuggestItem game={game} openModal={this.props.openModal}/>
                                </li>
                                )
                            })}
                            </ul>
                        </div> 
                        : 
                        <div className='result-null'>
                            {/* Go Fish to find games! */}
                        </div>
                    }
                    </div>

                </form>

            </div>
        )
    }
}

export default SuggestForm