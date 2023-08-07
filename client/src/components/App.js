import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './Header';
import Landing from './pages/Landing';
import About from './pages/About';
import Shop from './shop/Shop';
import Chatbot from './chatbot/Chatbot';

const App = () => {
    return (<div>
        <BrowserRouter>
            <div className='container'>
                <Header />
                <Routes>
                        <Route exact path="/" Component={Landing} />
                        <Route exact path="/about" Component={About} />
                        <Route exact path="/shop" Component={Shop} />
                </Routes>
                <Chatbot />
            </div>

        </BrowserRouter>
    </div>)
}

export default App;