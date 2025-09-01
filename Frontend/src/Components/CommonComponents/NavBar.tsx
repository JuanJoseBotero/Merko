import { Link } from 'react-router-dom'
import Icon from '../../Images/Icon.png'

export default function NavBar() {

    console.log(Icon);
  return (
    <div className='flex flex-row py-3 px-8 justify-between shadow-sm bg-white/10 backdrop-blur-md fixed top-0 w-full z-10'>
      <h1 className='text-2xl font-extrabold'><Link to="/">Merko</Link></h1>
      <nav className=''>
        <ul className='flex space items-center gap-10 font-medium'>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/catalog">Catalog</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <img src={Icon} alt="" className='h-9 w-9 rounded-full border-2 border-gray-300'/>
        </ul>
      </nav>
    </div>
  )
}
