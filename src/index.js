import React from 'react';
import ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker'; //脚手架自动，跑服务器
import { AppContainer } from 'react-hot-loader'; //热更新

import thunk from 'redux-thunk'; //thunk是中间件，为了异步操作
import { createStore, applyMiddleware } from 'redux'; //redux相关
import reducer from './reducer'; 
import { Provider } from 'react-redux';

import Page from './Page';
import './style/lib/animate.css';

// redux 注入操作
const middleware = [thunk];
const store = createStore(reducer, applyMiddleware(...middleware));

const render = Component => {   // 增加react-hot-loader保持状态刷新操作，如果不需要可去掉并把下面注释的打开
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <Component store={store} />
            </Provider>
        </AppContainer>
        ,
        document.getElementById('root')
    );
};

render(Page);

// Webpack Hot Module Replacement API
if (module.hot) {
    // 隐藏You cannot change <Router routes>; it will be ignored 错误提示
    // react-hot-loader 使用在react-router 3.x上引起的提示，react-router 4.x不存在
    // 详情可参照https://github.com/gaearon/react-hot-loader/issues/298
    const orgError = console.error; // eslint-disable-line no-console
    console.error = (...args) => { // eslint-disable-line no-console
        if (args && args.length === 1 && typeof args[0] === 'string' && args[0].indexOf('You cannot change <Router routes>;') > -1) {
            // React route changed
        } else {
            // Log the error as normally
            orgError.apply(console, args);
        }
    };
    module.hot.accept('./Page', () => {
        render(Page);
    })
}

registerServiceWorker();
