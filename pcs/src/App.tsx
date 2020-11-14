import React, { useContext } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import Dashboard from './components/Administrator/Dashboard';
import PageAdminManagement from './components/Administrator/PageAdminManagement';
import PageCategoryManagement from './components/Administrator/PageCategoryManagement';
import PageFullTimerManagement from './components/Administrator/PageFullTimerManagement';
import PagePartTimerManagement from './components/Administrator/PagePartTimerManagement';
import PagePetOwnerManagement from './components/Administrator/PagePetOwnerManagement';
import PageStarPerformer from './components/Administrator/PageStarPerformer';
import PageSignIn from './components/Authentication/PageSignIn';
import PageSignUp from './components/Authentication/PageSignUp';
import CareTakerManagement from './components/CareTaker/CareTakerManagement';
import CareTakerSalary from './components/CareTaker/CareTakerSalary';
import FTLeaveManagement from './components/CareTaker/FTLeaveManagement';
import PTAvailabilityManagement from './components/CareTaker/PTAvailabilityManagement';
import Home from './components/Home/Home';
import PagePetManagement from './components/PetOwner/PagePetManagement';
import UserProfile from './components/UserProfile/UserProfile';
import { AppContext } from './contexts/AppContext';
import { MainContextProvider } from './contexts/MainContext';

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
  const { user, isAuthenticated } = useContext(AppContext);
  return (
    <ThemeProvider theme={theme}>
      <div className="application">
        <BrowserRouter>
          <Switch>
            {isAuthenticated ?
              <MainContextProvider>
                {/* Re-routing the default page */}
                <Route path="/main" component={user ?.user_role === 'ADMIN' ? Dashboard : user ?.user_role === 'PO' ? PagePetManagement : CareTakerSalary } exact />
                <Route path="/profile" component={UserProfile} exact />

                {/* Admin Pages */}
                <Route path="/dashboard" component={Dashboard} exact />
                <Route path="/petcategorymanagement" component={PageCategoryManagement} exact />
                <Route path="/adminmanagement" component={PageAdminManagement} exact />
                <Route path="/petownermanagement" component={PagePetOwnerManagement} exact />
                <Route path="/parttimermanagement" component={PagePartTimerManagement} exact />
                <Route path="/fulltimermanagement" component={PageFullTimerManagement} exact />
                <Route path="/starperformers" component={PageStarPerformer} exact />

                {/* Pet Owner Pages */}
                <Route path="/petmanagement" exact>
                  <PagePetManagement />
                </Route>

                {/* Care Takers Pages */}
                <Route path="/bidsmanagement" component={CareTakerManagement} exact />
                <Route path="/caretakerconsole" component={CareTakerSalary} exact />
                <Route path="/leavemanagement" component={FTLeaveManagement} exact />
                <Route path="/availabilitymanagement" component={PTAvailabilityManagement} exact />
              </MainContextProvider> :
              <>
                <Route path="/" component={Home} exact />
                <Route path="/signup" component={PageSignUp} exact />
                <Route path="/signin" component={PageSignIn} exact />
              </>}
          </Switch>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
