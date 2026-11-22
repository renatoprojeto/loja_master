import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'

function Header() {
    return (
        <Navbar bg="light" expand="lg" id="header">
            <img
              alt=""
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtojiDmGH_g-0mKnjJIwDqIRHaGDkfPh7ocD4mCpbs1w&s=10"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
          <Navbar.Brand href="#home">RENATO</Navbar.Brand>
      </Navbar>
    );
}

export default Header