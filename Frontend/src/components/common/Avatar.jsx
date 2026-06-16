import { getInitials } from "../../utils/helpers.js";

const Avatar = ({
  src,
  firstName = "",
  lastName = "",
  size = "md",
  className = "",
  showStatus = false,
  status = "online",
}) => {
  const sizes = {
    xs: "w-7 h-7 text-xs",
    sm: "w-9 h-9 text-sm",
    md: "w-11 h-11 text-base",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
    "2xl": "w-28 h-28 text-3xl",
  };

  const statusColors = {
    online: "bg-emerald-400",
    offline: "bg-slate-300",
    busy: "bg-red-400",
    away: "bg-amber-400",
  };

  const statusSizes = {
    xs: "w-2 h-2 border",
    sm: "w-2.5 h-2.5 border",
    md: "w-3 h-3 border-2",
    lg: "w-3.5 h-3.5 border-2",
    xl: "w-4 h-4 border-2",
    "2xl": "w-5 h-5 border-2",
  };

  const initials = getInitials(firstName, lastName);

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={`${firstName} ${lastName}`}
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-white shadow-md`}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className={`
          ${sizes[size]} rounded-full 
          gradient-bg
          flex items-center justify-center 
          text-white font-semibold
          ring-2 ring-white shadow-md
          ${src ? "hidden" : "flex"}
        `}
      >
        {initials || "?"}
      </div>
      {showStatus && (
        <div
          className={`
            absolute bottom-0 right-0 rounded-full border-white
            ${statusColors[status]}
            ${statusSizes[size]}
          `}
        />
      )}
    </div>
  );
};

export default Avatar;