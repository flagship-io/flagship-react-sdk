import React, { ErrorInfo } from 'react';
import { FsLogger } from '@flagship.io/js-sdk-logs';
import ReactErrorBoundaryContainer from './components/ReactErrorBoundaryContainer';
// eslint-disable-next-line import/no-cycle
import { FlagshipReactSdkConfig } from './FlagshipContext';

type State = {
    error: Error | null;
    errorInfo: ErrorInfo | null;
    isCollapse: boolean;
};

export type HandleErrorBoundaryDisplay = (props: {
    debugMode: boolean;
    isCollapse: boolean;
    error: Error | null;
    onClickCollapse(): void;
}) => React.ReactNode;

type Props = {
    children: React.ReactNode;
    handleDisplay?: HandleErrorBoundaryDisplay;
    customerChildren: React.ReactNode;
    onError(error: Error): void;
    error: Error | null;
    sdkSettings: FlagshipReactSdkConfig;
    log: FsLogger;
};

class FlagshipErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            error: this.props.error,
            errorInfo: null,
            isCollapse: false
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.props.log.fatal(
            `An error occurred. The SDK is switching into safe mode:\n${error.stack}`
        );
        this.setState({
            error,
            errorInfo
        });
    }

    static getDerivedStateFromError(error: Error): { error: Error } {
        // Update state so the next render will show the fallback UI.
        return {
            error
        };
    }

    componentDidUpdate(prevProps: Props, prevState: State): void {
        if (this.state.error !== prevState.error) {
            this.props.onError(this.state.error as Error);
        }
        if (this.props.error !== prevProps.error) {
            this.props.log.fatal(
                `An error occurred. The SDK is switching into safe mode:\n${
                    (this.props.error as Error).stack
                }`
            );
        }
    }

    render(): React.ReactNode {
        const { error, isCollapse } = this.state;
        const {
            children,
            handleDisplay,
            customerChildren,
            error: errorProp,
            sdkSettings: { nodeEnv, enableErrorLayout }
        } = this.props;
        if (errorProp || error) {
            const errorCopy = errorProp || error;
            if (handleDisplay) {
                return handleDisplay({
                    debugMode: nodeEnv !== 'production' && enableErrorLayout,
                    isCollapse,
                    error: errorCopy,
                    onClickCollapse: () => {
                        this.setState({
                            ...this.state,
                            isCollapse: !isCollapse
                        });
                    }
                });
            }
            return (
                <ReactErrorBoundaryContainer
                    debugMode={nodeEnv !== 'production' && enableErrorLayout}
                    isCollapse={isCollapse}
                    error={errorCopy}
                    onClickCollapse={() => {
                        this.setState({
                            ...this.state,
                            isCollapse: !isCollapse
                        });
                    }}
                >
                    {customerChildren}
                </ReactErrorBoundaryContainer>
            );
        }

        return children;
    }
}

export default FlagshipErrorBoundary;
