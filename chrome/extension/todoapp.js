import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import './todoapp.css';

chrome.storage.local.set({bigtest: {test: 'bigtest'}}, function(result){
  console.log('localstorage set currentUser: ', result);
  chrome.storage.local.get('bigtest', function(result){
    console.log('localstorage get currentUser: ', result);
  });
});

chrome.storage.local.get('state', obj => {
  const { state } = obj;
  const initialState = JSON.parse(state || '{}');

  const createStore = require('../../app/store/configureStore');
  ReactDOM.render(
    <Root store={createStore(initialState)} />,
    document.querySelector('#root')
  );
});
