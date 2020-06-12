import React, { Component } from 'react'

import styled from 'styled-components';

const Sprite = styled.img`
    width: 5em;
    height: 5em;
`;

export default class PokemonCard extends Component {

    state = {
        name: '',
        url: '',
        imageurl: '',
        pokemonIndex: '',
        imageLoading: true,
        toManyRequests: false
    };

    componentDidMount() {
        const { name, url } = this.props;

        const pokemonIndex = url.split('/')[url.split('/').length - 2];

        const imageUrl = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`

        this.setState({
            name,
            imageUrl,
            pokemonIndex
        });
    }

    render() {

        return (
            <div className="col-md-3 col-sm-6 mb-5">
                <div className="card">
                    <h5 className="card-header bg-danger text-light">{this.state.pokemonIndex}</h5>
                    <Sprite className="card-img-top rounded mx-auto mt-2"
                        onLoad={() => this.setState({ imageLoading: false })}
                        onError={() => this.setState({ toManyRequests: true })}
                        src={this.state.imageUrl}
                        style={
                            this.state.toManyRequests ? {display: "none"} :
                            this.state.imageLoading ? null : {display: "block"}
                        }
                    />
                    {this.state.toManyRequests ? (
                        <h6 className="mx-auto"><span className="badge badge-danger mt-2">Too Many Requests</span></h6>
                    ) : null}

                    <div className="card-body mx-auto">
                        <h6 className="card-title">
                            {this.state.name
                                .toLowerCase()
                                .split(' ')
                                .map(
                                    letter => letter.charAt(0).toUpperCase() + letter.substring(1)
                                )
                                .join(' ')
                            }
                        </h6>
                    </div>
                </div>
            </div>
        )
    }
}
