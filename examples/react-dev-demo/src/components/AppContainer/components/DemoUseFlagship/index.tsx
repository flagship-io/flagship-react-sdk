import { useFlagship, UseFlagshipOutput } from '@flagship.io/react-sdk';
import React from 'react';
import { Alert, Col, Row, Button } from 'react-bootstrap';
import CodeBlock from '../../../common/CodeBlock';
import { TransactionHit } from '@flagship.io/js-sdk';

export const DemoUseFlagship = () => {
    const fsParams = {
        modifications: {
            requested: [
                {
                    key: 'btnColor',
                    defaultValue: 'green',
                    activate: false
                }
            ]
        }
    };
    const output = useFlagship(fsParams);
    const {
        modifications: fsModifications,
        status: fsStatus,
        hit: fsHit
    } = output;
    const demoHookName = 'useFlagship';
    return (
        <Row>
            <Col>
                <div className="fsAnchor" id={demoHookName} />
                <Alert variant="dark" className="fs-alert demoHook">
                    <Alert.Heading>{demoHookName}</Alert.Heading>
                    <p>
                        Use <b>{demoHookName}</b> hook to get access to further
                        stuff such as <i>modifications</i>, <i>sdk status</i>,{' '}
                        <i>hits</i> :
                    </p>
                    <CodeBlock
                        className="mv3"
                        codeString={`import { useFlagship } from '@flagship.io/react-sdk';
const fsParams = {
    modifications: {
        requested: [
            {
                key: 'btnColor',
                defaultValue: 'green',
                activate: false
            }
        ]
    }
}
const {
    modifications: fsModifications,
    status: fsStatus,
    hit: fsHit,
} = useFlagship(fsParams);`}
                    />
                    <h3>
                        1 - Playing with <i>fsModifications</i>
                    </h3>
                    <p>demo: </p>
                    <div>
                        <Button
                            variant="secondary"
                            style={{
                                backgroundColor: fsModifications.btnColor
                            }}
                        >
                            {`I'm a button customized with Flagship (backgroundColor=${fsModifications.btnColor})`}
                        </Button>
                    </div>
                    <CodeBlock
                        className="mv3"
                        codeString={`<Button
    variant="secondary"
    style={{
        backgroundColor: fsModifications.btnColor
    }}
>
    {\`I'm a button customized with Flagship (backgroundColor=\${fsModifications.btnColor})\`}
</Button>`}
                    />
                    <h3>
                        2 - Playing with <i>fsStatus</i>
                    </h3>
                    <div style={{ marginBottom: 16 }}>
                        If you're not familiar with the payload that you should
                        a provide to the hit you want to send, you'll have all
                        details available in the{' '}
                        <a href="https://github.com/abtasty/flagship-js-sdk/blob/master/README.md#shape-of-possible-hits-to-send-1">
                            SDK JS Hit documentation
                        </a>
                        .
                    </div>
                    <p>demo with Transaction Hit: </p>
                    <CodeBlock
                        className="mv3"
                        codeString={`
fsStatus=${JSON.stringify(fsStatus, null, 2)};
                        `}
                    />
                    <h3>
                        3 - Playing with <i>hits</i>
                    </h3>
                    <p>demo: </p>
                    <CodeBlock
                        className="mv3"
                        codeString={`<Button
    onClick={() => {
        const mockHit = {
            type: 'Transaction',
            data: {
                transactionId: '12451342423',
                affiliation: 'myAffiliation',
                totalRevenue: 999,
                shippingCost: 888,
                shippingMethod: 'myShippingMethod',
                currency: 'myCurrency',
                taxes: 1234444,
                paymentMethod: 'myPaymentMethod',
                itemCount: 2,
                couponCode: 'myCOUPON',
                documentLocation:
                    'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                pageTitle: 'myScreen'
            }
        };
        fsHit.send(mockHit);
    }}
>
    Send a transaction hit
</Button>`}
                    />
                    <div>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                const mockHit = {
                                    type: 'Transaction',
                                    data: {
                                        transactionId: '12451342423',
                                        affiliation: 'myAffiliation',
                                        totalRevenue: 999,
                                        shippingCost: 888,
                                        shippingMethod: 'myShippingMethod',
                                        currency: 'myCurrency',
                                        taxes: 1234444,
                                        paymentMethod: 'myPaymentMethod',
                                        itemCount: 2,
                                        couponCode: 'myCOUPON',
                                        documentLocation:
                                            'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                                        pageTitle: 'myScreen'
                                    }
                                } as {
                                    type: 'Transaction';
                                    data: TransactionHit;
                                };
                                fsHit.send(mockHit);
                            }}
                        >
                            Send a transaction hit
                        </Button>
                    </div>
                    <CodeBlock
                        className="mv3"
                        codeString={`<Button
    onClick={() => {
        const mockHit1 = {
            type: 'Transaction',
            data: {
                transactionId: '12451342423',
                affiliation: 'myAffiliation',
                totalRevenue: 999,
                shippingCost: 888,
                shippingMethod: 'myShippingMethod',
                currency: 'myCurrency',
                taxes: 1234444,
                paymentMethod: 'myPaymentMethod',
                itemCount: 2,
                couponCode: 'myCOUPON',
                documentLocation:
                    'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                pageTitle: 'myScreen'
            }
        };
        const mockHit2 = { ...mockHit1 };
        mockHit2.data.transactionId = '999';
        fsHit.sendMultiple([mockHit1, mockHit2]);
    }}
>
    Send multiple transaction hits
</Button>`}
                    />
                    <div>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                const mockHit1 = {
                                    type: 'Transaction',
                                    data: {
                                        transactionId: '12451342423',
                                        affiliation: 'myAffiliation',
                                        totalRevenue: 999,
                                        shippingCost: 888,
                                        shippingMethod: 'myShippingMethod',
                                        currency: 'myCurrency',
                                        taxes: 1234444,
                                        paymentMethod: 'myPaymentMethod',
                                        itemCount: 2,
                                        couponCode: 'myCOUPON',
                                        documentLocation:
                                            'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                                        pageTitle: 'myScreen'
                                    }
                                } as {
                                    type: 'Transaction';
                                    data: TransactionHit;
                                };
                                const mockHit2 = { ...mockHit1 } as {
                                    type: 'Transaction';
                                    data: TransactionHit;
                                };
                                mockHit2.data.transactionId = '999';
                                fsHit.sendMultiple([mockHit1, mockHit2]);
                            }}
                        >
                            Send multiple transaction hits
                        </Button>
                    </div>
                </Alert>
            </Col>
        </Row>
    );
};
