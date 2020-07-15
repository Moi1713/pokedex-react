import React, { Component } from 'react';
import axios from 'axios';

const TYPE_COLORS = {
    bug: 'B1C12E',
    dark: '4F3A2D',
    dragon: '755EDF',
    electric: 'FCBC17',
    fairy: 'F4B1F4',
    fighting: '82351D',
    fire: 'E73B0C',
    flying: 'A3B3F7',
    ghost: '6060B2',
    grass: '74C236',
    ground: 'D3B357',
    ice: 'A3E7FD',
    normal: 'C8C4BC',
    poison: '934594',
    psychic: 'ED4882',
    rock: 'B9A156',
    steel: 'B5B5C3',
    water: '3295F6'
}

export default class Pokemon extends Component {
    state = {
        name: '',
        pokemonIndex: '',
        imageUrl: '',
        types: [],
        description: '',
        stats: {
            hp: '',
            attack: '',
            defense: '',
            specialAttack: '',
            specialDefense: '',
            speed: '',
        },
        height: '',
        weight: '',
        eggGroups: '',
        abilities: '',
        genderRatioMale: '',
        genderRatioFemale: '',
        evs: '',
        hatchSteps: '',
    };

    async componentDidMount() {
        const { pokemonIndex } = this.props.match.params;

        //Urls
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;
        //Get pokemon info
        const pokemonRes = await axios.get(pokemonUrl);

        const name = pokemonRes.data.name;
        const imageUrl = pokemonRes.data.sprites.front_default;

        let { hp, attack, defense, specialAttack, specialDefense, speed } = '';
        this.setState({name});

        pokemonRes.data.stats.map(stat => {
            switch(stat.stat.name) {
                case 'hp':
                    hp = stat['base_stat'];
                    break;
                case 'attack':
                    attack = stat['base_stat'];
                    break;
                case 'defense':
                    defense = stat['base_stat'];
                    break;
                case 'special-attack':
                    specialAttack = stat['base_stat'];
                    break;
                case 'special-defense':
                    specialDefense = stat['base_stat'];
                    break;
                case 'speed':
                    speed = stat['base_stat'];
                    break;
            }
        });

        //convert Decimeters to Meters
        const height = pokemonRes.data.height / 10;

        const weight = Math.round((pokemonRes.data.weight * 0.220462 + 0.0001) * 100) / 100;

        const types = pokemonRes.data.types.map(type => type.type.name);

        const abilities = pokemonRes.data.abilities.map(ability => {
            return ability.ability.name
                .toLowerCase()
                .split('-')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');
        });

        const evs = pokemonRes.data.stats.filter(stat => {
            if(stat.effort > 0) {
                return true;
            }
            return false;
        }).map(stat => {
            return `${stat.effort} ${stat.stat.name}`
                .toLowerCase()
                .split('-')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');
        }).join(', ');

        //Get pokemon description, get the "text_flavor" param

        await axios.get(pokemonSpeciesUrl).then(res => {
            let description = '';
            res.data.flavor_text_entries.some(flavor => {
                if(flavor.language.name === 'en') {
                    description = flavor.flavor_text;
                    return;
                }
            });
        
            //Gender ratio: female in eights
            const femaleRate = res.data['gender_rate']; 
            const genderRatioFemale = 12.5 * femaleRate;
            const genderRatioMale = 12.5 * (8 - femaleRate);

            const catchRate = Math.round((100/255) * res.data['capture_rate']);

            const eggGroups = res.data['egg_groups'].map(group => {
                return group.name
                    .toLowerCase()
                    .split('-')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');
            }).join(', ');

            const hatchSteps = 255 * (res.data['hatch_counter'] + 1);

            this.setState({
                description,
                genderRatioFemale,
                genderRatioMale,
                catchRate,
                eggGroups,
                hatchSteps
            });

        });

        this.setState({
            imageUrl,
            pokemonIndex,
            name,
            types,
            stats: {
                hp,
                attack,
                defense,
                specialAttack,
                specialDefense,
                speed
            },
            height,
            weight,
            abilities,
            evs
        });

    }

    render() {
        return (
            <div className="col">
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-5">
                                <h5>{this.state.pokemonIndex} - {this.state.name}</h5>
                            </div>
                            <div className="col-7">
                                <div className="float-right">
                                    {this.state.types.map(type =>(
                                        <span key={type}
                                            className="badge badge-pill mr-1"
                                            style={{backgroundColor: `#${TYPE_COLORS[type]}`,
                                            color: 'white'
                                            }}
                                        >
                                            {type
                                            .toLowerCase()
                                            .split('-')
                                            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                            .join(' ')
                                            }
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-3">
                                <img src={this.state.imageUrl}
                                    className="card-img-top rounded mx-auto mt-2"
                                />
                            </div>
                            <div className="col-md-9">
                                <h4 className="mx-auto">{this.state.name
                                    .toLowerCase()
                                    .split('-')
                                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                    .join(' ')}
                                </h4>
                                
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">HP</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar"
                                                role="progressBar" style={{
                                                    width: `${this.state.stats.hp/2.55}%`
                                                }}
                                                aria-valuenow="25"
                                                aria-valuemin="0"
                                                aria-valuemax="255"
                                            ><small>{this.state.stats.hp}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">Attack</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar"
                                                role="progressBar" style={{
                                                    width: `${this.state.stats.attack/2.55}%`
                                                }}
                                                aria-valuenow="25"
                                                aria-valuemin="0"
                                                aria-valuemax="255"
                                            ><small>{this.state.stats.attack}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">Defense</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar"
                                                role="progressBar" style={{
                                                    width: `${this.state.stats.defense/2.55}%`
                                                }}
                                                aria-valuenow="25"
                                                aria-valuemin="0"
                                                aria-valuemax="255"
                                            ><small>{this.state.stats.defense}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">Special Attack</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar"
                                                role="progressBar" style={{
                                                    width: `${this.state.stats.specialAttack/2.55}%`
                                                }}
                                                aria-valuenow="25"
                                                aria-valuemin="0"
                                                aria-valuemax="255"
                                            ><small>{this.state.stats.specialAttack}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">Special Defense</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar"
                                                role="progressBar" style={{
                                                    width: `${this.state.stats.specialDefense/2.55}%`
                                                }}
                                                aria-valuenow="25"
                                                aria-valuemin="0"
                                                aria-valuemax="255"
                                            ><small>{this.state.stats.specialDefense}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row align-items-center">
                                    <div className="col-12 col-md-3">Speed</div>
                                    <div className="col-12 col-md-9">
                                        <div className="progress">
                                            <div className="progress-bar"
                                                role="progressBar" style={{
                                                    width: `${this.state.stats.speed/2.55}%`
                                                }}
                                                aria-valuenow="25"
                                                aria-valuemin="0"
                                                aria-valuemax="255"
                                            ><small>{this.state.stats.speed}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}
