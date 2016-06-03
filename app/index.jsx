import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/header';
import style from './style';

ReactDOM.render((
  <div>
    <Header />
    <section className={style.content}>
      
    </section>
  </div>
), document.getElementById('app'));
