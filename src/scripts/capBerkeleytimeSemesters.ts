import Course from '../server/models/course';
import RequirementSet from '../server/models/requirement-set';
import Tag from '../server/models/tag';
import User from '../server/models/user';
import { connect } from '../server/config/db';
import fs from 'fs'
const courseData = JSON.parse(fs.readFileSync('./dummy/berkeleyTime.json', 'utf8'))

/**
 * btimeInfo should be the course information from the berkeleytime API.
 * queries the courses and converts it by adding a berkeleytime field, and saves it back
 */
const main = async () => {
  courseData.forEach((course: any) => {
    if (!course.berkeleytimeData) {
      course.berkeleytimeData = {};
    }
    course.berkeleytimeData.semestersOffered = course.berkeleytimeData.semestersOffered && course.berkeleytimeData.semestersOffered.map((s:string) => s.charAt(0).toUpperCase() + s.slice(1))
  })
  fs.writeFileSync('./dummy/berkeleyTime.json', JSON.stringify(courseData, null, 2))
}
main()
