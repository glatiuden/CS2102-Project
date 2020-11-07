import React, { useContext } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import Dashboard from './components/Administrator/Dashboard';
import PageAdminManagement from './components/Administrator/PageAdminManagement';
import PageCategoryManagement from './components/Administrator/PageCategoryManagement';
import PageFullTimerManagement from './components/Administrator/PageFullTimerManagement';
import PagePartTimerManagement from './components/Administrator/PagePartTimerManagement';
import PagePetOwnerManagement from './components/Administrator/PagePetOwnerManagement';
import PageSignIn from './components/Authentication/PageSignIn';
import SignUp from './components/Authentication/PageSignUp';
import CareTakerManagement from './components/CareTaker/CareTakerManagement';
import CareTakerSalary from './components/CareTaker/CareTakerSalary';
import FTLeaveManagement from './components/CareTaker/FTLeaveManagement';
import PTAvailabilityManagement from './components/CareTaker/PTAvailabilityManagement';
import Home from './components/Home/Home';
import PagePetManagement from './components/PetOwner/PagePetManagement';
import UserProfile from './components/UserProfile/UserProfile';
import { AppContext } from './contexts/AppContext';
import { CareTakerContextProvider } from './contexts/CareTakerContext';
import { MainContextProvider } from './contexts/MainContext';
import { PetOwnerContextProvider } from './contexts/PetOwnerContext';

/**
 *  Override and Customize the theme color here
 *  Dark Blue: #355C7D
 *  Dark Purple: #6C5B7B
 *  Dark Magenta: #C06C84
 *  Coral: #F67280
 *  Beige: #F8B195
 */
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#355C7D', //Dark Blue
      contrastText: '#FFFFFF' // White
    },
    secondary: {
      main: '#6C5B7B', // Dark Purple
      contrastText: '#FFFFFF' // White
    }
  },
});

function App() {
  const { user } = useContext(AppContext);
  return (
    <ThemeProvider theme={theme}>
      <div className="application">
        <BrowserRouter>
          <Switch>
            <Route path="/signup" component={SignUp} exact />
            <Route path="/signin" component={PageSignIn} exact />
            <MainContextProvider>
              <Route path="/" component={user ?.user_role === 'ADMIN' ? Dashboard : user ?.user_role === 'PO' ? PagePetManagement : CareTakerSalary } exact />
              <Route path="/dashboard" component={Dashboard} exact />
              <Route path="/home" component={Home} exact />
              <Route path="/petmanagement" exact>
                <PetOwnerContextProvider>
                  <PagePetManagement />
                </PetOwnerContextProvider>
              </Route>
              <Route path="/leavemanagement" component={FTLeaveManagement} exact />
              <Route path="/availabilitymanagement" component={PTAvailabilityManagement} exact />
              <Route path="/petcategorymanagement" component={PageCategoryManagement} exact />
              <Route path="/adminmanagement" component={PageAdminManagement} exact />
              <Route path="/petownermanagement" component={PagePetOwnerManagement} exact />
              <Route path="/parttimermanagement" component={PagePartTimerManagement} exact />
              <Route path="/fulltimermanagement" component={PageFullTimerManagement} exact />
              <Route path="/bidsmanagement" exact >
                <CareTakerContextProvider>
                  <CareTakerManagement />
                </CareTakerContextProvider>
              </Route>
              <Route path="/caretakerconsole" component={CareTakerSalary} exact />
              <Route path="/profile" component={UserProfile} exact />
            </MainContextProvider>
          </Switch>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
