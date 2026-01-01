import { NavLink } from "react-router-dom";
import LogoIcon from "../../assets/logo-2.svg";

function Logo() {
  return (
    <NavLink
      to="/"
      className="flex gap-2 items-center  font-medium py-2 px-2 mb-8"
    >
      <img
        src={LogoIcon}
        alt="PhotoBooth"
        className="h-5 md:h-6 object-contain"
      />

      <h2 className="font-bold text-[16px] lg:text-lg">Photo Bloom</h2>
    </NavLink>
  );
}

export default Logo;
