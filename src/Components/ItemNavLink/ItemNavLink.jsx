import { NavLink } from "react-router-dom";

export const ItemNavLink = ({ route, content, myStyles = "" }) => {
  return (
    <NavLink
      to={route}
      className={({ isActive }) =>
        `${myStyles} ${isActive ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-700"}`
      }
      
    >
      {content}
    </NavLink>
  );
};
