import Head from 'next/head';
import flagship from '@flagship.io/js-sdk';
import { FlagshipProvider } from '@flagship.io/react-sdk';
import Home from '../components/home';

import styles from '../styles/Home.module.css';

const fsEnvId = 'bn1ab7m56qolupi5sa0g';
const fsApiKey = 'M2FYdfXsJ12tjJQuadw7y9DZojqNGBvecpjGXY93';
const visitorId = 'visitor1';
const visitorContext = {
    isAwesome: false,
    isEvil: false
};

function Index({ initialModifications }) {
    console.log('Flagship modifs: ', initialModifications);
    return (
        <FlagshipProvider
            envId={fsEnvId}
            apiKey={fsApiKey} // <= Required in next major release
            visitorData={{
                id: visitorId,
                context: visitorContext
            }}
            initialModifications={initialModifications}
            enableConsoleLogs={true}
            decisionMode="Bucketing"
            pollingInterval={10}
            fetchNow={true}
        >
            <div className={styles.container}>
                <Head>
                    <title>Create Next App</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Home />
            </div>
        </FlagshipProvider>
    );
}

export async function getServerSideProps(context) {
    const fsInstance = flagship.start(fsEnvId, fsApiKey, {
        /* sdk settings */
    });

    const fsVisitorInstance = fsInstance.newVisitor('visitor1', visitorContext);

    const getBtnProps = new Promise((resolve) => {
        fsVisitorInstance.on('ready', () => {
            console.log('visitor is ready ! ✨');
            resolve(fsVisitorInstance.fetchedModifications);
        });
    });

    const initialModifications = await getBtnProps;

    return {
        props: { initialModifications } // will be passed to the page component as props
    };
}

export default Index;
