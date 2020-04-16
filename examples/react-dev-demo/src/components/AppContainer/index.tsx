import React from 'react';
import { Container } from 'react-bootstrap';

import { DemoInitialization } from './components/DemoInitialization';
import { DemoUseFsActivate } from './components/DemoUseFsActivate';
import { DemoUseFsModifications } from './components/DemoUseFsModifications';
import { DemoUseFsModificationsCache } from './components/DemoUseFsModificationsCache';

export const AppContainer = () => {
    return (
        <Container className="mt3">
            <DemoInitialization />
            <DemoUseFsModifications />
            <DemoUseFsModificationsCache />
            <DemoUseFsActivate />
        </Container>
    );
};
