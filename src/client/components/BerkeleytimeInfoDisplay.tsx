import React from 'react';
import { Button, Modal } from 'react-bootstrap';

import { Course } from '../models/course.model';

import './BerkeleytimeInfoDisplay.css';

/* Make sure you modify hasAllFields below. */
type FieldType = 'grade' | 'semesters-offered' | 'grade-distribution';

type BerkeleytimeInfoDisplayProps = {
  course: Course;
  fields?: FieldType[];
};

type BerkeleytimeInfoDisplayState = {
  allInfoModalOpen: boolean;
};

class BerkeleytimeInfoDisplay extends React.Component<BerkeleytimeInfoDisplayProps, BerkeleytimeInfoDisplayState> {
  constructor(props: BerkeleytimeInfoDisplayProps) {
    super(props);

    this.state = {
      allInfoModalOpen: false,
    };
  }

  isAvailable = (): boolean => {
    if (
      this.props.course.berkeleytimeData.berkeleytimeId === null ||
      this.props.course.berkeleytimeData.berkeleytimeId === undefined
    ) {
      return false;
    }
    let badBerkeleytime = !this.props.course.berkeleytimeData.grade;
    badBerkeleytime =
      badBerkeleytime &&
      !(
        Array.isArray(this.props.course.berkeleytimeData.semestersOffered) &&
        this.props.course.berkeleytimeData.semestersOffered.length
      );
    if (badBerkeleytime) {
      // If berkeleytime returns poop...
      return false;
    }
    return true;
  };

  /**
   * Returns whether the component has the given field.
   *
   * @param {FieldType} The field.
   * @return {boolean} Whether the component has the field.
   */
  hasField = (field: FieldType): boolean => {
    return !this.props.fields || this.props.fields.includes(field);
  };

  /**
   * Returns whether all fields are present.
   *
   * @return {boolean} Whether all fields are present.
   */
  hasAllFields = (): boolean => {
    return (
      !this.props.fields ||
      (this.props.fields.includes('grade') &&
        this.props.fields.includes('semesters-offered') &&
        this.props.fields.includes('grade-distribution'))
    );
  };

  /**
   * Opens a modal with all info displayed.
   */
  openAllInfo = (): void => {
    this.setState({
      allInfoModalOpen: true,
    });
  };

  /**
   * Closes the modal with all info displayed.
   */
  closeAllInfo = (): void => {
    this.setState({
      allInfoModalOpen: false,
    });
  };

  private renderGrade = (): React.ReactNode => {
    return `Average grade: ${this.props.course.berkeleytimeData.grade || 'unavailable'}`;
  };

  private renderSemestersOffered = (): React.ReactNode => {
    let text: string;
    if (
      !Array.isArray(this.props.course.berkeleytimeData.semestersOffered) ||
      this.props.course.berkeleytimeData.semestersOffered.length === 0
    ) {
      text = 'Unavailable';
    } else {
      text = this.props.course.berkeleytimeData.semestersOffered.slice(0, 5).join(', ');
    }
    return `Semesters offered: ${text}`;
  };

  private renderGradeDistribution = (): React.ReactNode => {
    const defaultUrl = 'https://berkeleytime.com/grades';
    if (!this.props.course.berkeleytimeData.berkeleytimeId) {
      return defaultUrl;
    }
    const url = `https://berkeleytime.com/grades/0-${this.props.course.berkeleytimeData.berkeleytimeId}-all-all`;
    return (
      <iframe
        className="BerkeleytimeInfoDisplay__grade-distribution-iframe"
        title="Berkeleytime Grade Distribution"
        src={url}
      >
        Loading&#8230;
      </iframe>
    );
  };

  render(): React.ReactElement {
    return (
      <div>
        <h6>
          {this.props.course.getName()}
          {!this.hasAllFields() ? (
            <Button className="px-0 py-0" variant="link" onClick={this.openAllInfo}>
              <i className="material-icons BerkeleytimeInfoDisplay__all-button">launch</i>
            </Button>
          ) : null}
        </h6>
        {this.isAvailable() ? (
          <>
            {this.hasField('grade') ? (
              <>
                {this.renderGrade()}
                <br />
              </>
            ) : null}
            {this.hasField('semesters-offered') ? (
              <>
                {this.renderSemestersOffered()}
                <br />
              </>
            ) : null}
            {this.hasField('grade-distribution') ? (
              <>
                {this.renderGradeDistribution()}
                <br />
              </>
            ) : null}
          </>
        ) : (
          'This course does not have Berkeleytime information available.'
        )}
        <Modal size="xl" show={this.state.allInfoModalOpen} onHide={this.closeAllInfo}>
          <Modal.Body>
            <BerkeleytimeInfoDisplay course={this.props.course} />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default BerkeleytimeInfoDisplay;
