import React from 'react';

import './RequirementPane.css';

type CreatorRequirementPaneProps = {
  manuallyFulfilled: Map<string, Set<string>>;
};

type CreatorRequirementPaneState = {
  showGoalSelector: boolean;
};

class CreatorRequirementPane extends React.Component<CreatorRequirementPaneProps, CreatorRequirementPaneState> {
  constructor(props: CreatorRequirementPaneProps) {
    super(props);

    this.state = {
      showGoalSelector: false,
    };
  }

  render(): React.ReactElement {
    /**
     * Uses the goals to return a list of all required requirement sets by
     * recursively looking up {@link RequirementSet#parent} until it reaches the
     * root.
     *
     * @return {RequirementSet[]} An array of all required requirement sets.
     */

    return (
      <div/>
    );
  }
}

export default CreatorRequirementPane;
