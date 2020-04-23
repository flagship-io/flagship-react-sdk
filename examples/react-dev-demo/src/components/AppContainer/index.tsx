import React from 'react';
import { Container } from 'react-bootstrap';

import { DemoInitialization } from './components/DemoInitialization';
import { DemoUseFsActivate } from './components/DemoUseFsActivate';
import { DemoUseFsModifications } from './components/DemoUseFsModifications';
import { DemoUseFsSynchronize } from './components/DemoUseFsSynchronize';
import { DemoUseFlagship } from './components/DemoUseFlagship';
import { DemoErrorBoundary } from './components/DemoErrorBoundary';

export const AppContainer: React.FC = () => {
    return (
        <Container className="mt3">
            <DemoInitialization />
            <DemoUseFlagship />
            <DemoUseFsModifications />
            <DemoUseFsActivate />
            <DemoUseFsSynchronize />
            <DemoErrorBoundary />
        </Container>
    );
};
