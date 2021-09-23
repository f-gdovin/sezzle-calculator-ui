import { FunctionComponent } from 'react';
import ErrorBoundary from './ErrorBoundary';
import Calculator from './Calculator';

const MainPage: FunctionComponent = () => {
    return <div>
            <ErrorBoundary>
                <Calculator/>
            </ErrorBoundary>
        </div>
}

export default MainPage;