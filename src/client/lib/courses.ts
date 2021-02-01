import memoize from 'memoizee';

import { CoursePrototype } from '../../common/prototypes/course.prototype';
import { Course } from '../models/course.model';
import Tags from './tags';
import { get } from './utils';

namespace Courses {
  const COURSE_API_ENDPOINT = '/api/courses';

  /**
   * Takes in data, map linkTags to it, and turns all objects in the data into
   * an instance of the Course class.
   */
  export const getCoursesMap = memoize(
    async (): Promise<Map<string, Course>> => {
      const [res, tagsMap] = await Promise.all([get(COURSE_API_ENDPOINT), Tags.getTagsMap()]);
      const data = (await res.json()) as CoursePrototype[];
      const courseArr = data.map((courseProto) => Course.fromProto(courseProto, tagsMap));
      const coursesMap = new Map<string, Course>(courseArr.map((course) => [course.id, course]));
      data.forEach((courseProto) => {
        const course = coursesMap.get(courseProto.id)!;
        course.equiv = courseProto.equivIds
          .filter((equivId) => {
            if (!coursesMap.has(equivId)) {
              console.error(`Course ${course.id} references unknown equivalent course ${equivId}`);
              return false;
            }
            return true;
          })
          .map((equivId) => coursesMap.get(equivId)!);
      });
      return coursesMap;
    },
  );

  export const getCourses = memoize(
    async (): Promise<Course[]> => {
      const coursesMap = await getCoursesMap();
      return Array.from(coursesMap.values());
    },
    { promise: true },
  );
}

export default Courses;
