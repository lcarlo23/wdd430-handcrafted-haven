import Link from 'next/link';
import Image from 'next/image';
import NavLinks from '@/components/navlinks';

export default function NavBar() {
  return (
    <div className='navbar'>
      <Link className='navbar-home-link' href='/'>
        <div className='navbar-logo'>
          <Image
            src='/logo.png'
            alt='Handcrafted Haven logo'
            width={200}
            height={75}
            loading='eager'
          />
        </div>
      </Link>
      <div className='nav-links'>
        <NavLinks />
      </div>
    </div>
  );
}
