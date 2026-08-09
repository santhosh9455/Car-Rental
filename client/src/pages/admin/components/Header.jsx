import PropTypes from 'prop-types';
import { addVehicleClicked } from '../../../redux/adminSlices/actions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';



const Header = ({category,title}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
      {category && (
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">
          {category}
        </p>
      )}
      <p className="text-slate-800 text-3xl font-extrabold tracking-tight">
        {title}
      </p>
      </div>      
    </div>
  )
}
Header.propTypes = {
  category:PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default Header