export type CoursePrototype = {
  id: string;
  dept: string;
  no: string;
  title: string;
  units: number;
  berkeleyTimeData: {
    berkeleyTimeId: string;
    averageGrade: string;
    semestersOffered: string[];
  };
  tagIds: string[];
  equivIds: string[];
}
