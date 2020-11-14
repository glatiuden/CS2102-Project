import React from 'react';
import { Helmet } from 'react-helmet';

import LOGO from './images/PCSLogo.png';

const Home = () => {
    return (
        <>
            <Helmet>
                <link rel="stylesheet" href="dist/css_slider.css" />
                <link rel="stylesheet" href="dist/style.css" />
                <link rel="stylesheet" href="dist/font-awesome.min.css" />
                <link rel="stylesheet" type="text/css" href="dist/bootstrap.css" />
            </Helmet>

            <div className="main-top">
                <div className="container d-lg-flex" id="home">
                    <h1 className="logo-style-res float-left">
                        <a className="navbar-brand" href="./index">
                            <img src={LOGO} alt="" className="img-fluid logo-img"></img>
                            Web Application <span>Pet Caring Service</span>
                        </a>
                    </h1>
                    <div className="nav_w3ls mx-lg-auto">
                        <nav>
                            <label className="toggle">Menu</label>
                            <input type="checkbox" id="drop" />
                            <ul className="menu mx-lg-auto">
                                <li>
                                    <a href="#home" className="active">
                                        Home
                                 </a>
                                </li>
                                <li>
                                    <a href="#about ">About Us</a>
                                </li>
                                <li>
                                    <a href="#gallery">Steps</a>
                                </li>
                                <li>
                                    <a href="#contact">Contact Us</a>
                                </li>
                                <li>
                                    <a href="./signin">Login</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="text-center">
                        <a
                            href="./signup"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="login-button-2 text-uppercase text-wh mt-lg-0 mt-2">
                            <span className="fa fa-download text-wh mr-2"></span>Register
                        </a>
                    </div>
                </div>
            </div>
            <div className="banner_w3lspvt">
                <div className="csslider infinity" id="slider1">
                    <input type="radio" name="slides" checked={true} id="slides_1" />
                    <ul className="banner banner1">
                        <li className="banner-top1">
                            <div className="container">
                                <div className="banner-info_w3ls">
                                    <h5 className="text-li">Your Pets, Our Concern </h5>
                                    <h3 className="text-wh font-weight-bold mt-2 mb-5">
                                        Pet Caring Service
                                    </h3>
                                    <p>
                                        {" "}
                                        Search for a caretaker with a single click</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div className="navigation">
                        <div></div>
                    </div>
                </div>
            </div>
            <section className="about-bottom" id="services">
                <div className="container pb-lg-4">
                    <div className="row bg-colors text-center">
                        <div className="col-md-4 service-subgrids">
                            <div className="w3ls-about-grid py-lg-5 py-md-4 py-5 px-3">
                                <h4 className="text-wh font-weight-bold mb-3">
                                    Browsing Caretakers
                </h4>
                                <p className="text-li">
                                    {" "}
                                    Find a caretaker who stays around you, able to take care of your pets and
                                    at an extremely affordable rates!
                </p>
                            </div>
                            <span className="fa fa-users" aria-hidden="true"></span>
                        </div>
                        <div className="col-md-4 service-subgrids bg-li">
                            <div className="w3ls-about-grid py-lg-5 py-md-4 py-5 px-3">
                                <h4 className="text-bl font-weight-bold mb-3">
                                    Bidding
                                </h4>
                                <p className="text-secondary">
                                    {" "}
                                    Pet Owners can place a bid for caretaker's services! As easy as a single click!
                                </p>
                            </div>
                            <span className="fa fa-linode" aria-hidden="true"></span>
                        </div>
                        <div className="col-md-4 service-subgrids">
                            <div className="w3ls-about-grid py-lg-5 py-md-4 py-5 px-3">
                                <h4 className="text-wh font-weight-bold mb-3">
                                    Assigning of Caretakers
                                </h4>
                                <p className="text-li">
                                    We will ensure our caretakers are always readily available and ready to serve!
                                </p>
                            </div>
                            <span className="fa fa-book" aria-hidden="true"></span>
                        </div>
                    </div>
                    <div className="row bg-colors text-center">
                        <div className="col-md-4 service-subgrids bg-li">
                            <div className="w3ls-about-grid py-lg-5 py-md-4 py-5 px-3">
                                <h4 className="text-bl font-weight-bold mb-3">
                                    Centralised Platform
                                </h4>
                                <p className="text-secondary">
                                    Linking up caretakers and pet owners together!
                                </p>
                            </div>
                            <span className="fa fa-laptop" aria-hidden="true"></span>
                        </div>
                        <div className="col-md-4 service-subgrids">
                            <div className="w3ls-about-grid py-lg-5 py-md-4 py-5 px-3">
                                <h4 className="text-wh font-weight-bold mb-3">Ratings</h4>
                                <p className="text-li">
                                    {" "}
                                    Honest and reliable ratings to reflect our caretakers' quality.
                                </p>
                            </div>
                            <span className="fa fa-thumbs-o-up" aria-hidden="true"></span>
                        </div>
                        <div className="col-md-4 service-subgrids bg-li">
                            <div className="w3ls-about-grid py-lg-5 py-md-4 py-5 px-3">
                                <h4 className="text-bl font-weight-bold mb-3">
                                    Flexible Payment Methods
                                </h4>
                                <p className="text-secondary">
                                    Cash or Credit Card? You choose!
                                </p>
                            </div>
                            <span className="fa fa-magic" aria-hidden="true"></span>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w3ls-bnrbtm py-5" id="about">
                <div className="container py-xl-5 py-lg-3">
                    <div className="row">
                        <div className="col-lg-4 pr-xl-5">
                            <h5 className="text-colors let-spa mt-5">Pet Caring Service</h5>
                            <h3 className="text-bl font-weight-bold mb-5">
                                What is PCS?
              </h3>
                        </div>
                        <div className="col-lg-8 pl-xl-5 mt-lg-0 mt-4">
                            <p>
                                In the modern age, pets are part of our everyday lives and part of our families.
                                We know that the demands of caring for our growing families can leave us feeling guilty when our pups aren't getting the exercise and play time they deserve.
              </p>
                            <p className="pt-4 mt-4 border-top">
                                The <b>pet caring service (PCS)</b> application is a platform that allows caretakers to offer pet sitting services for pet owners.
              </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="teams text-center py-5" id="gallery">
                <div className="container py-xl-5 py-lg-3">
                    <h3 className="text-bl font-weight-bold mb-2">Our Applications</h3>
                    <h6 className="text-colors let-spa mb-5">3 Easy Step!</h6>
                    <div className="row inner-sec-w3ls-w3pvt-aminfo pt-sm-4">
                        <div className="col-md-4 col-sm-4 p-0">
                            <span className="fa fa-search mb-3" style={{ fontSize: 75 }} aria-hidden="true"></span>
                            <h4>Browse</h4>
                            Browse the huge range of caretakers!
                        </div>
                        <div className="col-md-4 col-sm-4 p-0 top-tem">
                            <span className="fa fa-shopping-cart mb-3" style={{ fontSize: 75 }} aria-hidden="true"></span>
                            <h4>Bid</h4>
                            Express interest to render their services
                        </div>
                        <div className="col-md-4 col-sm-4 p-0 mt-sm-0 mt-5">
                            <span className="fa fa-car mb-3" style={{ fontSize: 75 }} aria-hidden="true"></span>
                            <h4>Success</h4>
                            Pay, and liase on the pet transfer method! It's that easy!
                        </div>
                    </div>
                </div>
            </section>

            <section className="clients" id="testi">
                <div className="row no-gutters pb-4">
                    <div className="col-lg-6 col-md-8 left-test-w3pvt p-sm-5 p-4">
                        <div className="my-4 py-xl-5 py-lg-3">
                            <div className="feedback-info">
                                <div className="feedback-top">
                                    <h4 style={{ color: "black" }}>We are here to help</h4>
                                    <p>Need last minute service? Need someone to take care of your pets? Fred not, use our services today and we will find you the most suitable caretaker</p>
                                    <a href="./signup"><h4 className="mt-4 text-wh font-weight-bold mb-4" style={{ color: "black" }}>Register Here</h4></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-4"></div>
                </div>
            </section>


            <section className="contact pb-5" id="contact">
                <div className="container pb-xl-5 pb-lg-3">
                    <br />
                    <h3 className="text-bl text-center font-weight-bold mb-2">
                        Contact Us
          </h3>
                    <h6 className="text-colors text-center let-spa mb-5">Get In Touch</h6>
                    <div className="row mx-sm-0 mx-2">
                        <div
                            className="col-lg-12 main_grid_contact"
                            data-aos="flip-left"
                            data-aos-easing="ease-out-cubic"
                            data-aos-duration="2000">
                            <div className="form-w3ls p-md-5 p-4">
                                <h4 className="mb-4 sec-title-w3 let-spa text-bl">
                                    Send us a message
                </h4>
                                <form action="https://formspree.io/koh_vinleon@outlook.com" method="post">
                                    <div className="row">
                                        <div className="col-sm-6 form-group pr-sm-1">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="Name"
                                                placeholder="Name"
                                            />
                                        </div>
                                        <div className="col-sm-6 form-group pl-sm-1">
                                            <input
                                                className="form-control"
                                                type="email"
                                                name="Email"
                                                placeholder="Email"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="Subject"
                                            placeholder="Subject"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <textarea name="message" placeholder="Message"></textarea>
                                    </div>
                                    <div className="input-group1 text-right">
                                        <button className="btn" type="submit">
                                            Submit
                                    </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="copyright-w3ls py-4">
                <div className="container">
                    <div className="row">
                        <p className="col-lg-12 copy-right-grids text-bl text-center">
                            © 2019 Studies. All Rights Reserved | Design by <a href="https://w3layouts.com/" target="_blank" rel="noopener noreferrer" className="text-colors">W3layouts</a>
                        </p>
                    </div>
                </div>
            </div>
            <a href="#home" className="move-top text-center"> </a>
        </>
    );
};

export default Home;
