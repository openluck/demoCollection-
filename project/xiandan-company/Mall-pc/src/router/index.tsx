import React, {Suspense, lazy} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

const Main = lazy(()=>import('../component/Main'));
const Information = lazy(() => import('../component/Information'));
const SearchResult = lazy(() => import('../component/SearchResult'));
const CompanyResume = lazy(() => import('../component/company/CompanyResume'));
const Platform =lazy(() => import('../component/company/Platform'));

const loading = () => {
    return ""
}

const BasicRoute = () => (
    <BrowserRouter>
      <Suspense fallback={loading()}>
            <Switch>
                <Route path="/main" component={Main} />
                <Route path="/information" component={Information}/>
                <Route strict path="/searchResult/:keys" component={SearchResult}/>
                <Route exact path="/companyResume" component={CompanyResume}/>
                <Route exact path='/platform' component={Platform}/>
                <Redirect strict path="*" to="/main"/>
            </Switch>
        </Suspense>
    </BrowserRouter>
);

export default BasicRoute;