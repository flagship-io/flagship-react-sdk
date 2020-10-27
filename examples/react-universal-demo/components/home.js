import { useFsModifications } from '@flagship.io/react-sdk';
import styles from '../styles/Home.module.css';

function Home() {
    const defaultValue = '#000000';
    const { color, 'btn-text': btnText } = useFsModifications([{ key: 'color', defaultValue }]);

    console.log('flags: ', { color, btnText });
    return (
        <main className={styles.main}>
            <h1 style={{ margin: 0 }}>Welcome to Flagship React SDK, universal demo.</h1>
            <h4>
                This app was creating using <a href="https://nextjs.org">Next.js!</a>
            </h4>
            <p style={{ color: 'black' }}>
                The button below is customized with some modifications (<code>color</code>) because the current visitor
                context that we setup in the app matches a Flagship campaign.
            </p>
            <button
                style={{
                    backgroundColor: color,
                    color: 'inherit',
                    minHeight: '5vh',
                    fontSize: '24px',
                    minWidth: '200px'
                }}
            >
                {defaultValue === color
                    ? `I'm a button with a the default color (${color}) because I didn't received modifications from Flagship.`
                    : `I'm a button with a customized color (${color}) because I received modifications from Flagship.`}
            </button>
        </main>
    );
}

export default Home;
