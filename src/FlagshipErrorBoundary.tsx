import React, { ErrorInfo } from 'react';

type State = {
    error: Error | null;
    errorInfo: ErrorInfo | null;
};

type Props = {
    children: React.ReactNode;
    customerChildren: React.ReactNode;
    onError(error: Error): void;
};

class FlagshipErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.props.onError(error);
        this.setState({
            error,
            errorInfo
        });
    }

    render(): React.ReactNode {
        const { error, errorInfo } = this.state;
        const { children, customerChildren } = this.props;
        if (errorInfo) {
            // You can render any custom fallback UI
            return (
                <>
                    <div
                        style={{
                            backgroundColor: 'red',
                            minHeight: '30vh'
                        }}
                    >
                        <h1 style={{ color: 'white' }}>
                            Something went wrong.
                        </h1>
                    </div>
                    <div>{customerChildren}</div>
                </>
            );
        }

        return children;
    }
}

export default FlagshipErrorBoundary;
