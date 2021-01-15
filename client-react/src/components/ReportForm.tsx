import React from 'react';

type ReportFormProps = {};

function ReportForm(props: ReportFormProps): React.ReactElement {
  return (
    <iframe
      className="report-form"
      src="https://docs.google.com/forms/d/e/1FAIpQLSeZsGAMmgIWgtsmN0tu8CEU5k1r7DjFHRJWOMqLGLDETEIU8A/viewform?embedded=true"
    >
      Loading&#8230;
    </iframe>
  );
}

export default ReportForm;
