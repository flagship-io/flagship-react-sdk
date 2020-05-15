import products from "../data/products";
import Link from "next/link";

export default function Contact() {
  return (
    <>
      <div className="bg-light py-3">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-0">
              <Link href="/">
                <a>Home </a>
              </Link>
              <span className="mx-2 mb-0">/</span>{" "}
              <strong className="text-black">About</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="h3 mb-3 text-black">Get In Touch</h2>
            </div>
            <div className="col-md-7">
              <form action="#" method="post">
                <div className="p-3 p-lg-5 border">
                  <div className="form-group row">
                    <div className="col-md-6">
                      <label htmlFor="c_fname" className="text-black">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="c_fname"
                        name="c_fname"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="c_lname" className="text-black">
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="c_lname"
                        name="c_lname"
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-12">
                      <label htmlFor="c_email" className="text-black">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="c_email"
                        name="c_email"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-12">
                      <label htmlFor="c_subject" className="text-black">
                        Subject{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="c_subject"
                        name="c_subject"
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-12">
                      <label htmlFor="c_message" className="text-black">
                        Message{" "}
                      </label>
                      <textarea
                        name="c_message"
                        id="c_message"
                        cols="30"
                        rows="7"
                        className="form-control"
                      ></textarea>
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-lg-12">
                      <input
                        type="submit"
                        className="btn btn-primary btn-lg btn-block"
                        value="Send Message"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-md-5 ml-auto">
              <div className="p-4 border mb-3">
                <span className="d-block text-primary h6 text-uppercase">
                  New York
                </span>
                <p className="mb-0">
                  203 Fake St. Mountain View, San Francisco, California, USA
                </p>
              </div>
              <div className="p-4 border mb-3">
                <span className="d-block text-primary h6 text-uppercase">
                  London
                </span>
                <p className="mb-0">
                  203 Fake St. Mountain View, San Francisco, California, USA
                </p>
              </div>
              <div className="p-4 border mb-3">
                <span className="d-block text-primary h6 text-uppercase">
                  Canada
                </span>
                <p className="mb-0">
                  203 Fake St. Mountain View, San Francisco, California, USA
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
