const Footer = () => {
    return (
      <footer className="bg-white shadow-inner mt-8">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} Product Store. All rights reserved.
        </div>
      </footer>
    );
}
export default Footer;