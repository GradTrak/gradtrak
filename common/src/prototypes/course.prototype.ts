export type CoursePrototype = {
  id: string;
  dept: string;
  no: string;
  title: string;
  units: number;
  berkeleytimeData: {
    berkeleytimeId: string;
    grade: string;
    semestersOffered: string[];
  };
  tagIds: string[];
  equivIds: string[];
}
