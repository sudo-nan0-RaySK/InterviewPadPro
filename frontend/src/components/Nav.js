import React from 'react';
import './Nav.css'
class Nav extends React.Component {
    render() {
        return (
            <nav>
                <ul>
                    <li><a href="#">Home </a></li>
                    <li><a href="#">About </a></li>
                    <li><a href="#">Contact </a></li>
                    <li><a href="#">Images </a></li>
                    <li><a href="#">Test </a></li>
                    <li><a href="#">Practice </a></li>
                    <li>
                        <a href="#">
                            <i class="fa fa-bars"></i>
                        </a>
                    </li>
                    <input type="search" />
                </ul>
            </nav>
        );
    }
}
export default Nav;