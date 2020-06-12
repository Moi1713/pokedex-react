import React, { Component } from 'react';
import styled from 'styled-components';

export default class NavBar extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark">
                    <a className="navbar-brand col-sm-3 col md-2 mr-0 align-items-center text-light">Pokedex</a>
                </nav>
            </div>
        )
    }
}
