import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UpperLine from './header_upperline';
import '../css/header.css';
import { TbGridDots } from 'react-icons/tb';
import logo_default_small from '../images/logo_small.png';
import logo_hover_small from '../images/logo_hover_small.png';

const Header = () => {
    return (
        <div>
            <UpperLine/>
            <div className='header'>
                <Logo/>
                <div className='header-menu-items-container'>
                    <LinkItem
                        title={`Convert`}
                        url={`/convert`}
                    />
                </div>
                {/*<ExpandingMenu/>*/}
            </div>
        </div>
    );
};

const Logo = () => {
    const [logo, setLogo] = useState(logo_default_small);

    const mouseEnter = () => {
        setLogo(logo_hover_small);
    }

    const mouseLeave = () => {
        setLogo(logo_default_small);
    }

    return (
        <Link
            to={`/`}
            className={`logo`}
        >
            <img
                onMouseEnter={mouseEnter}
                onMouseLeave={mouseLeave}
                src={logo}
                alt='site-logo'
            />
        </Link>
    );
};

const LinkItem = ({title, url}) => {
    const location = useLocation();
    const [isHovered, setIsHovered] = useState(false);
    const isActive = location.pathname === url;

    let condition = '';
    if (isHovered) {
        condition = 'hovered';
    }
    if (isActive) {
        condition = 'active';
    }

    return (
        <Link
            className={`header-menu-item ${condition}`}
            to={url}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {title}
            <div className={`header-menu-item-underline ${condition}`}></div>
        </Link>
    );
};

const ExpandingMenu = () => {
    const [isHovered, setIsHovered] = useState(false);

    let buttonCondition = '';
    let menuCondition = 'hidden';
    if (isHovered) {
        buttonCondition = 'hovered';
        menuCondition = '';
    }

    const mouseEnter = (from) => {
        if (from === 'button') {
            setIsHovered(true);
        }
        else if (from === 'menu') {
            if (menuCondition !== 'hidden') {
                setIsHovered(true);
            }
        }
    }

    return (
        <div>
            <div
                className={`expanding-menu-button-container`}
                onMouseEnter={() => mouseEnter('button')}
                onMouseLeave={() => setIsHovered(false)}
            >
                <TbGridDots className={`expanding-menu-button ${buttonCondition}`}/>
            </div>
            <div
                className={`expanding-menu-container ${menuCondition}`}
                onMouseEnter={() => mouseEnter('menu')}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className={`expanding-menu ${menuCondition}`}>
                    {isHovered ? (
                        <div className={`expanding-menu-options-container`}>

                        </div>
                        )
                        :
                        null}
                </div>
            </div>
        </div>
    );
};

export default Header;
