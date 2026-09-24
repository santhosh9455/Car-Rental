
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock } from 'react-icons/ai';
import { FiShoppingBag, FiEdit, FiPieChart } from 'react-icons/fi';
import { BsKanban, BsBarChart  } from 'react-icons/bs';
import { BiColorFill } from 'react-icons/bi';
import { IoMdContacts } from 'react-icons/io';
import { RiContactsLine, RiStockLine } from 'react-icons/ri';
import { IoHomeOutline } from "react-icons/io5";
import { GiLouvrePyramid } from 'react-icons/gi';
import { IoSettingsOutline } from "react-icons/io5";




export const links = [
    {
      title: 'Dashboard',
      links: [
        {
          name:'adminHome',
          icon:<IoHomeOutline />,
        },
        {
          name: 'allProduct',
          title: 'Vehicles',
          icon: <FiShoppingBag />,
        },
        {
          name: 'allUsers',
          icon: <IoMdContacts />,
        },
        
        {
          name: 'orders',
          icon: <AiOutlineShoppingCart />,
        },
        {
          name: 'payments',
          icon: <AiOutlineShoppingCart />,
        },
        {
          name: 'settings',
          icon: <IoSettingsOutline />,
        },
        {
          name: 'damageDetection',
          icon: <FiEdit />,
        },
      ]
    }
  ];
    
    