import logo from '../../assets/icons/humanoid.png'
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
    return (


        <footer className="bg-white dark:bg-gray-900 m-4 animation-view">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="flex flex-col items-center justify-center ">
                        <ul id='contact-us' className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6"><FacebookIcon fontSize='large' color='info' /></a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6"><WhatsAppIcon fontSize='large' color='success' /></a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6"><InstagramIcon fontSize='large' color='secondary' /></a>
                            </li>
                        </ul>

                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <a href="/" className="hover:underline">Annotation Tool</a>. All Rights Reserved.</span>
            </div>
        </footer>


    )
}