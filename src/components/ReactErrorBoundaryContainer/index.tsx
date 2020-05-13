import React from 'react';

interface Props {
    children: React.ReactNode;
    debugMode: boolean;
    isCollapse: boolean;
    onClickCollapse(): void;
    error?: Error | null;
}

export const ReactErrorBoundaryContainer: React.SFC<Props> = ({
    children,
    debugMode,
    isCollapse,
    onClickCollapse,
    error
}: Props) => {
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

    return (
        <>
            {debugMode && (
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
                            onClick={onClickCollapse}
                        >
                            {isCollapse ? 'Hide details' : 'Show details'}
                        </button>
                    </div>

                    {error && (
                        <div
                            style={{
                                maxHeight: isCollapse ? 200 : 0,
                                overflow: 'auto',
                                color: 'wheat',
                                whiteSpace: 'pre-line',
                                transition: 'max-height 0.5s ease-in-out'
                            }}
                        >
                            {`${(error as Error).stack}`}
                        </div>
                    )}
                </div>
            )}
            <div id="flagshipSafeModeContainer">{children}</div>
        </>
    );
};

ReactErrorBoundaryContainer.defaultProps = {};

export default ReactErrorBoundaryContainer;
