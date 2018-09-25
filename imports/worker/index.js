import { Meteor } from 'meteor/meteor';
import { queues } from './queues';
import { processorInitialisers } from './processors';

if (Meteor.isServer) {
  Object.entries(queues).forEach(([queueName, queue]) => {
    console.log(`Worker listening to '${queueName}' queue`);
    queue.process(processorInitialisers[queueName]());
  });
}
