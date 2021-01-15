
export type CoursePrototype = {
  id: string;
  dept: string;
  no: string;
  title: string;
  units: number;
  // Due to circular dependency reasons, this is not 
  // using the interface defined in course.model
  berkeleytimeData: {
    berkeleytimeId: string;
    grade: string;
    semestersOffered: string[];
  };
  tagIds: string[];
  equivIds: string[];
};
