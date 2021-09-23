import { FunctionComponent } from 'react';
import MainPage from '../components/MainPage';
import ErrorBoundary from '../components/ErrorBoundary';

const App: FunctionComponent = () => {
    return <ErrorBoundary>
            <MainPage/>
        </ErrorBoundary>
}

export default App;
