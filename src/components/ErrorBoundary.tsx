import { Component } from 'react';

interface IErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<{}, IErrorBoundaryState> {

    constructor(props: never) {
        super(props);
        this.state = {
            hasError: false,
        }
    }

    public componentDidCatch(error: Error | null, info: object) {
        this.setState({
            hasError: true,
        });
    }

    public render() {
        if (this.state.hasError) {
            return <h1>Oops, something went wrong</h1>
        } else {
            return this.props.children;
        }
    }
}
export default ErrorBoundary;