import { Course } from './course.model';

/**
 * reqFulfillment defines the status of the
 * Requuirement. courseFulfillment is application to coursePool
 * requirements only (is null otherwise) and maps courses to
 * their respective fulfillment status.
 */
export type FulfillmentType = {
  reqFulfillment: 'fulfilled' | 'unfulfilled' | 'possible';
  courseFulfillment?: Set<Course>[];
};
