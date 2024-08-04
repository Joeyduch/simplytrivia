
// packages
import React from "react";

// components
import ErrorFallback from "./ErrorFallback/ErrorFallback";



interface Props {
    children?: React.ReactNode;
}

interface State {
    hasError: boolean;
}



export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props:any) {
        super(props);
        this.state = { hasError:false };
    }

    static getDerivedStateFromError(_:Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error("++ error boundary caught ++ ", error, errorInfo);
    }


    stopError = () => {
        this.setState({hasError: false});
    }


    render() {
        if(this.state.hasError) {
            return <ErrorFallback onExitCallback={this.stopError}/>;
        }

        return this.props.children;
    }
}