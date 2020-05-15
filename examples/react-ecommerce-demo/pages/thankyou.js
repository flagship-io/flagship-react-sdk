import Link from 'next/link';

export default function ThankYou() {
    return (
        <>
            <div className="bg-light py-3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mb-0">
                            <Link href="/">
                                <a>Home </a>
                            </Link>
                            <span className="mx-2 mb-0">/</span>{' '}
                            <strong className="text-black">Confirmation</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div className="site-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <span className="icon-check_circle display-3 text-success"></span>
                            <h2 className="display-3 text-black">Thank you!</h2>
                            <p className="lead mb-5">
                                You order was successfully completed.
                            </p>
                            <p>
                                <Link href="/shop">
                                    <a className="btn btn-sm btn-primary">
                                        Back to shop
                                    </a>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
