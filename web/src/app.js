import React, { useState } from 'react';
import Header from './containers/Header/Header';
import ItemList from './containers/ItemList/ItemList';
import ItemsContext from './containers/ItemsContext';
import Login from './containers/Login/Login';

import './styles/main.scss';

const App = () => {
    const [login, setLogin] = useState(false);
    const authenticate = () => {
        setLogin(true);
    }
    return (
        <div className="App">
            {login
                ? <ItemsContext>
                    <Header />
                    <ItemList />
                </ItemsContext>
                : <Login authenticate={authenticate} />
            }
        </div>
    );
}

export default App;
