import App from 'next/app';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import Header from '../components/header';
import Footer from '../components/footer';
import { getClient } from '../services/flagship';

function MyApp({ Component, pageProps, cartObj, fsFlags }) {
    return (
        <>
            <Head>
                /* ************** Tag ABTast ************** */
                <script type="text/javascript" src="https://try.abtasty.com/887ea4f558dc29f53bbe24e5a24e3c8d.js"></script>
                <title>Shoppers &mdash; Colorlib e-Commerce Template</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Mukta:300,400,700" />
                <link rel="stylesheet" href="/fonts/icomoon/style.css" />

                <link rel="stylesheet" href="/css/bootstrap.min.css" />
                <link rel="stylesheet" href="/css/magnific-popup.css" />
                <link rel="stylesheet" href="/css/jquery-ui.css" />
                <link rel="stylesheet" href="/css/owl.carousel.min.css" />
                <link rel="stylesheet" href="/css/owl.theme.default.min.css" />

                <link rel="stylesheet" href="/css/aos.css" />

                <link rel="stylesheet" href="/css/style.css" />
                <link
                    rel="stylesheet"
                    href="https://storage.googleapis.com/flagship-dev-public-storage/demo/flagship-panel/flagship-panel.css"
                />
            </Head>
            <div className="site-wrap">
                <Header cartObj={cartObj} />
                <Component {...pageProps} cartObj={cartObj} fsFlags={fsFlags} />
                <Footer />
            </div>

            <script src="/js/jquery-3.3.1.min.js"></script>
            <script src="/js/jquery-ui.js"></script>
            <script src="/js/popper.min.js"></script>
            <script src="/js/bootstrap.min.js"></script>
            <script src="/js/owl.carousel.min.js"></script>
            <script src="/js/jquery.magnific-popup.min.js"></script>
            <script src="/js/aos.js"></script>

            <script src="/js/main.js"></script>

            <script src="https://storage.googleapis.com/flagship-dev-public-storage/demo/flagship-panel/flagship-panel.js"></script>
        </>
    );
}

MyApp.getInitialProps = async (appContext) => {
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await App.getInitialProps(appContext);
    const { cart, fscookie } = parseCookies(appContext.ctx);

    let fsFlags = {};
    if (appContext.ctx.pathname !== '/_error') {
        if (fscookie) {
            try {
                let fsCookie = JSON.parse(Buffer.from(fscookie, 'base64').toString('utf8'));
                const fsClient = getClient(fsCookie.environment_id);

                const fsVisitor = fsClient.newVisitor(fsCookie.visitor_id, fsCookie.context);
                await fsVisitor.synchronizeModifications();

                fsFlags =
                    (fsVisitor &&
                        fsVisitor.getModifications &&
                        fsVisitor.getModifications([
                            { key: 'btn-color', defaultValue: '#7971ea' },
                            { key: 'btn-text', defaultValue: 'Shop now' }
                        ])) ||
                    {};
            } catch (e) {
                console.log('error on parsing fscookie : ', e.message);
            }
        }
    }

    let cartObj = {};
    if (cart) {
        cartObj = JSON.parse(cart);
    }

    return { ...appProps, cartObj, fsFlags };
};

export default MyApp;
