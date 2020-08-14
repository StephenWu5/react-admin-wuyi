import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import AllComponents from '../components';
import routesConfig from './config';

export default class CRouter extends Component {
    // 这里负责登录验证和权限管理
    requireAuth = (permission, component) => {
        const { auth } = this.props;
        console.log(auth,'auth')
        const { permissions } = auth === null ? { permissions : auth } : auth.data;
        if (!permissions || !permissions.includes(permission)) return <Redirect to={'404'} />;
        return component;
    };
    requireLogin = (component, permission) => {
        const { auth } = this.props;
        console.log(auth,'auth')
        const { permissions } = auth === null ? { permissions : auth } : auth.data;
        //如果auth为null或者其他情况 立刻重定向到登录页面
        if([null].includes(auth) || JSON.stringify(auth.data) === '{}'){
            return <Redirect to={'/login'} />;
        }

        //每次build的时候运行这个
        if (process.env.NODE_ENV === 'production' && !permissions) { // 线上环境判断是否登录
            return <Redirect to={'/login'} />;
        }
        return permission ? this.requireAuth(permission, component) : component;
    };
    render() {
        return (
            <Switch>
                {
                    Object.keys(routesConfig).map(key => 
                        routesConfig[key].map(r => {
                            const route = r => {
                                const Component = AllComponents[r.component];
                                return (
                                    <Route
                                        key={r.route || r.key}
                                        exact
                                        path={r.route || r.key}
                                        component={props => r.login ? 
                                            <Component {...props} />
                                            : this.requireLogin(<Component {...props} />, r.auth)}
                                    />
                                )
                            }
                            return r.component ? route(r) : r.subs.map(r => route(r));
                        })
                    )
                }

                <Route render={() => <Redirect to="/404" />} />
            </Switch>
        )
    }
}
