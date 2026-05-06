import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

const ResumePreview = ({ resume }) => {
  const renderTemplate = () => {
    switch (resume.template) {
      case 'modern':
        return <ModernTemplate resume={resume} />;
      case 'classic':
        return <ClassicTemplate resume={resume} />;
      case 'minimal':
        return <MinimalTemplate resume={resume} />;
      default:
        return <ModernTemplate resume={resume} />;
    }
  };

  return (
    <div
      id="resume-preview"
      className="bg-white shadow-2xl mx-auto"
      style={{
        width: '8.5in',
        minHeight: '11in',
      }}
    >
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;