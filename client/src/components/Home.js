import {Link, NavLink} from 'react-router-dom';

function Home() {
 
    return(
      <>
          <div className='flex justify-center align-center'>
            <Link className='links' to='/Signin'>Sign In</Link>
            <Link className='links'  to='/Signup'>Sign Up</Link>
        </div>
      </>
    )
}

export default Home;
