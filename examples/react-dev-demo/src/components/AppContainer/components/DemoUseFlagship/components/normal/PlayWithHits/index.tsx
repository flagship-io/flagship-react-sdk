import React from 'react';
import { Button, Nav } from 'react-bootstrap';
import CodeBlock from '../../../../../../common/CodeBlock';
import { TransactionHit, ScreenHit, ItemHit, EventHit } from '@flagship.io/js-sdk';
import { useFlagship } from '@flagship.io/react-sdk';

const PlayWithHits: React.FC = () => {
    const { hit: fsHit } = useFlagship();
    const multipleHitBundle = {
        multipleCodeString: `<Button
    onClick={() => {
        const transactionHit = {
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
        const eventHit = {
            type: 'Event',
            data: {
                category: 'User Engagement',
                action: 'signOff',
                label: 'test label ;)',
                value: 123,
                documentLocation:
                    'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                pageTitle: 'TestTitle'
            }
        };
        fsHit.sendMultiple([transactionHit, eventHit]);
    }}
>
    Send multiple transaction hits
</Button>`,
        multipleComponent: (
            <Button
                variant="secondary"
                onClick={() => {
                    const transactionHit = {
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
                            documentLocation: 'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                            pageTitle: 'myScreen'
                        }
                    } as {
                        type: 'Transaction';
                        data: TransactionHit;
                    };
                    const eventHit = {
                        type: 'Event',
                        data: {
                            category: 'User Engagement',
                            action: 'signOff',
                            label: 'test label ;)',
                            value: 123,
                            documentLocation: 'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                            pageTitle: 'TestTitle'
                        }
                    } as {
                        type: 'Event';
                        data: EventHit;
                    };
                    fsHit.sendMultiple([transactionHit, eventHit]);
                }}
            >
                Send multiple mixed hits
            </Button>
        )
    };
    const transactionHitBundle = {
        simpleCodeString: `<Button
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
</Button>`,
        simpleComponent: (
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
                            documentLocation: 'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
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
        )
    };
    const screenHitBundle = {
        simpleCodeString: `<Button
    onClick={() => {
        const mockHit = {
            type: 'Screen',
            data: {
                documentLocation: 'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                pageTitle: 'TestScreen',
            },
        };
        fsHit.send(mockHit);
    }}
>
    Send a screen hit
</Button>`,
        simpleComponent: (
            <Button
                variant="secondary"
                onClick={() => {
                    const mockHit = {
                        type: 'Screen',
                        data: {
                            documentLocation: 'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                            pageTitle: 'TestScreen'
                        }
                    } as {
                        type: 'Screen';
                        data: ScreenHit;
                    };
                    fsHit.send(mockHit);
                }}
            >
                Send a screen hit
            </Button>
        )
    };
    const itemHitBundle = {
        simpleCodeString: `<Button
    onClick={() => {
        const mockHit = {
            type: 'Item',
            data: {
              transactionId: '12451342423',
              name: 'testItem',
              price: 999,
              code: 'testCode',
              category: 'testCategory',
              quantity: 1234444,
              documentLocation: 'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
              pageTitle: 'TestScreen',
            }
        };
        fsHit.send(mockHit);
    }}
>
    Send a item hit
</Button>`,
        simpleComponent: (
            <Button
                variant="secondary"
                onClick={() => {
                    const mockHit = {
                        type: 'Item',
                        data: {
                            transactionId: '12451342423',
                            name: 'testItem',
                            price: 999,
                            code: 'testCode',
                            category: 'testCategory',
                            quantity: 1234444,
                            documentLocation: 'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                            pageTitle: 'TestScreen'
                        }
                    } as {
                        type: 'Item';
                        data: ItemHit;
                    };
                    fsHit.send(mockHit);
                }}
            >
                Send a item hit
            </Button>
        )
    };

    const eventHitBundle = {
        simpleCodeString: `<Button
    onClick={() => {
        const mockHit = {
            type: 'Event',
            data: {
                category: 'User Engagement',
                action: 'signOff',
                label: 'test label ;)',
                value: 123,
                documentLocation:
                    'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                pageTitle: 'TestTitle'
            }
        };
        fsHit.send(mockHit);
    }}
>
    Send a page hit
</Button>`,
        simpleComponent: (
            <Button
                variant="secondary"
                onClick={() => {
                    const mockHit = {
                        type: 'Event',
                        data: {
                            category: 'User Engagement',
                            action: 'signOff',
                            label: 'test label ;)',
                            value: 123,
                            documentLocation: 'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                            pageTitle: 'TestTitle'
                        }
                    } as {
                        type: 'Event';
                        data: EventHit;
                    };
                    fsHit.send(mockHit);
                }}
            >
                Send a item hit
            </Button>
        )
    };
    const [currentTestedHit, setHitToTest] = React.useState<{
        simpleCodeString: string;
        simpleComponent: React.ReactNode;
    }>(transactionHitBundle);
    return (
        <>
            <div className="mb3">
                If you're not familiar with the payload that you should a provide to the hit you want to send, you'll
                have all details available in the{' '}
                <a href="https://github.com/abtasty/flagship-react-sdk#shape-of-possible-hits-to-send">
                    SDK Hit documentation
                </a>
                .
            </div>
            <div>
                <b>NOTE:</b>
                <p>
                    It is not necessary to provide parameters to <i>useFlagship</i> if your purpose is only to send
                    hits.
                </p>
                <CodeBlock
                    className="mv3"
                    codeString={`import { useFlagship } from '@flagship.io/react-sdk';
const { hit: fsHit } = useFlagship();`}
                />
            </div>
            <p>Send a hit, demo: </p>
            <Nav variant="tabs" defaultActiveKey="hitTransaction">
                <Nav.Item>
                    <Nav.Link eventKey="hitTransaction" onClick={() => setHitToTest(transactionHitBundle)}>
                        Transaction Hit
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="hitScreen" onClick={() => setHitToTest(screenHitBundle)}>
                        Screen Hit
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="hitEvent" onClick={() => setHitToTest(eventHitBundle)}>
                        Event Hit
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="hitItem" onClick={() => setHitToTest(itemHitBundle)}>
                        Item Hit
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            <CodeBlock className="mv3" codeString={currentTestedHit.simpleCodeString} />
            <div>{currentTestedHit.simpleComponent}</div>
            <div className="mt3">Send multiple mixed hit, demo: </div>
            <CodeBlock className="mv3" codeString={multipleHitBundle.multipleCodeString} />
            <div>{multipleHitBundle.multipleComponent}</div>
        </>
    );
};

export default PlayWithHits;
