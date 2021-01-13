import { CoursePrototype } from 'common/prototypes/course.prototype';
import { Course } from '../models/course.model';
import { Tag } from '../models/tag.model';
import Tags from './tags';

namespace Courses {
  const COURSE_API_ENDPOINT = '/api/courses';

  let coursesMap: Map<string, Course> = null;

  /**
   * Takes in data, map linkTags to it, and turns all objects in the data into
   * an instance of the Course class.
   */
  async function fetchCourseData(): Promise<Map<string, Course>> {
    const [res, tagsMap] = await Promise.all([fetch(COURSE_API_ENDPOINT), Tags.getTagsMap()]);
    const data = await res.json();
    const courseArr = data.map((courseProto) => Course.fromProto(courseProto, tagsMap));
    return new Map<string, Course>(courseArr.map((course) => [course.id, course]));
  }

  export async function getCourses(): Promise<Course[]> {
    if (!coursesMap) {
      coursesMap = await this.fetchCourseData();
    }
    return Array.from(coursesMap.values());
  }

  export async function getCoursesMap(): Promise<Map<string, Course>> {
    if (!coursesMap) {
      coursesMap = await this.fetchCourseData();
    }
    return coursesMap;
  }
}

export default Courses;
