import React from 'react';

import './ReportForm.css';

function ReportForm(): React.ReactElement {
  return (
    <iframe
      className="ReportForm"
      title="Report an Error Google Form"
      src="https://docs.google.com/forms/d/e/1FAIpQLSeZsGAMmgIWgtsmN0tu8CEU5k1r7DjFHRJWOMqLGLDETEIU8A/viewform?embedded=true"
    >
      Loading&#8230;
    </iframe>
  );
}

export default ReportForm;
