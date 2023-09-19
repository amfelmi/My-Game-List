import React, { useState, useEffect } from 'react';
import "./ListNav.css"


const ListNav = () => {
    const [activeLink, setActiveLink] = useState('mylist');

    const handleListLink = (link) => {
        setActiveLink(link);
    };

    useEffect(() => {
        //Getting the pathname to know which path we are currently on
        const currentPath = window.location.pathname;

        switch (currentPath) {
            case '/mylist':
                setActiveLink('mylist');
                break;
            case '/completed-list':
                setActiveLink('completed-list');
                break;
            case '/onhold-list':
                setActiveLink('onhold-list');
                break;
            case '/backlog-list':
                setActiveLink('backlog-list');
                break;
            case '/dropped-list':
                setActiveLink('dropped-list');
                break;
            default:
                setActiveLink('mylist');
        }
    }, []);

    return (
        <div className='gamelist-container'>
            <nav className='gamelist-nav-items'>
                <a
                    className={`gamelist-nav-link nav-link-2 ${activeLink === 'mylist' ? 'active' : ''}`}
                    href="/mylist"
                    onClick={() => handleListLink('mylist')}
                >My List</a>
                <a
                    className={`gamelist-nav-link nav-link-2 ${activeLink === 'completed-list' ? 'active' : ''}`}
                    href="/completed-list"
                    onClick={() => handleListLink('completed-list')}
                >Completed</a>
                <a
                    className={`gamelist-nav-link nav-link-2 ${activeLink === 'onhold-list' ? 'active' : ''}`}
                    href="/onhold-list"
                    onClick={() => handleListLink('onhold-list')}
                >On Hold</a>
                <a
                    className={`gamelist-nav-link nav-link-2 ${activeLink === 'backlog-list' ? 'active' : ''}`}
                    href="/backlog-list"
                    onClick={() => handleListLink('backlog-list')}
                >Backlogs</a>
                <a
                    className={`gamelist-nav-link nav-link-2 ${activeLink === 'dropped-list' ? 'active' : ''}`}
                    href="/dropped-list"
                    onClick={() => handleListLink('dropped-list')}
                >Dropped</a>
            </nav>
        </div>
    )
}

export default ListNav
