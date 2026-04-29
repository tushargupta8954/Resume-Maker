const Loader = ({ size = 'medium', fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="text-center">
          <div className={`spinner mx-auto ${sizeClasses[size]}`}></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <div className={`spinner ${sizeClasses[size]}`}></div>;
};

export default Loader;