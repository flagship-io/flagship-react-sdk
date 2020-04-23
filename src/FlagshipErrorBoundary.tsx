import React, { ErrorInfo } from 'react';
import { FsLogger } from '@flagship.io/js-sdk';
// eslint-disable-next-line import/no-cycle
import { FlagshipReactSdkConfig } from './FlagshipContext';

const btnStyle = {
    display: 'inline-block',
    verticalAlign: 'middle',
    border: '1px solid transparent',
    padding: '0.375rem 0.75rem',
    fontSize: '1rem',
    lineHeight: 1.5,
    borderRadius: '0.25rem',
    marginLeft: '16px',
    transition: `background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out`
};

type State = {
    error: Error | null;
    errorInfo: ErrorInfo | null;
    isCollapse: boolean;
};

type Props = {
    children: React.ReactNode;
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
        this.props.onError(error);
        this.props.log.fatal(
            `An error occurred. The SDK is switching into safe mode:\n${error.stack}`
        );
        this.setState({
            error,
            errorInfo
        });
    }

    componentDidUpdate(prevProps: Props): void {
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
            customerChildren,
            error: errorProp,
            sdkSettings: { nodeEnv, enableErrorLayout }
        } = this.props;
        if (errorProp || error) {
            const errorCopy = errorProp || error;
            return (
                <>
                    {nodeEnv !== 'production' && enableErrorLayout && (
                        <div
                            className="fsErrorDebugContainer"
                            style={{
                                backgroundColor: 'red',
                                minHeight: '6vh',
                                position: 'fixed',
                                zIndex: 9999,
                                bottom: 0,
                                width: '100%',
                                opacity: isCollapse ? 1 : 0.4,
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '0px 16px',
                                transition: 'opacity 0.5s ease-in-out'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                    marginBottom: '8px',
                                    marginTop: '8px'
                                }}
                            >
                                <h3 style={{ color: 'white' }}>
                                    Flagship React SDK has crashed.
                                </h3>
                                <button
                                    style={{ ...btnStyle }}
                                    onClick={() => {
                                        this.setState({
                                            ...this.state,
                                            isCollapse: !isCollapse
                                        });
                                    }}
                                >
                                    {isCollapse
                                        ? 'Hide details'
                                        : 'Show details'}
                                </button>
                            </div>

                            {errorCopy && (
                                <div
                                    style={{
                                        maxHeight: isCollapse ? 200 : 0,
                                        overflow: 'auto',
                                        color: 'wheat',
                                        whiteSpace: 'pre-line',
                                        transition:
                                            'max-height 0.5s ease-in-out'
                                    }}
                                >
                                    {`${(errorCopy as Error).stack}`}
                                </div>
                            )}
                        </div>
                    )}
                    <div>{customerChildren}</div>
                </>
            );
        }

        return children;
    }
}

export default FlagshipErrorBoundary;
