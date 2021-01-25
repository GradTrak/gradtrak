import { Course } from './course.model';

export type FulfillmentType = 'fulfilled' | 'possible' | 'unfulfilled';

export type CourseFulfillmentMethodType = {
  method: 'courses';
  coursesUsed: Set<Course>;
};

export type ManualFulfillmentMethodType = {
  method: 'manual';
};

export type FulfillmentMethodType = CourseFulfillmentMethodType | ManualFulfillmentMethodType;
