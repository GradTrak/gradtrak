import { BerkeleytimeData } from './berkeleytime-data';

export type CoursePrototype = {
  id: string;
  dept: string;
  no: string;
  title: string;
  berkeleytimeData: BerkeleytimeData;
  units: number;
  tagIds: string[];
  equivIds: string[];
};
