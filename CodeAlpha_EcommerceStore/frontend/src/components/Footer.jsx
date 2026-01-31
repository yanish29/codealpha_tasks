import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
                <div className="social-links">
                    <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                    <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                    <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
