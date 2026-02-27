import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__logo">HG</div>
      <p className="footer__text">
        © {new Date().getFullYear()} Hannah Giles Photography. All rights reserved.
      </p>
    </footer>
  );
}