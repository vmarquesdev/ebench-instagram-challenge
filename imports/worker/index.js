import { queues, RAKE_TAGS } from './queues';
import { processorInitialisers } from './processors';

Object.entries(queues).forEach(([queueName, queue]) => {
  console.log(`Worker listening to '${queueName}' queue`); /* eslint-disable-line */
  queue.process(processorInitialisers[queueName]());
});

// Check outdated tags every 60 seconds.
queues[RAKE_TAGS].add({}, { repeat: { every: 60 * 1000 }, removeOnComplete: true });
