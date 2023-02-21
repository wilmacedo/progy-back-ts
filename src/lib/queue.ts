import * as jobs from '../jobs';

const queues = Object.values(jobs).map(job => new job().buildQueue());

const add = (name: string, data: any) => {
  const queue = queues.find(queue => queue.name === name);
  if (!queue) {
    throw new Error('Queue not found');
  }

  return queue.bull.add(data);
};

const process = () =>
  queues.forEach(queue => {
    queue.bull.process(job => {
      queue.handle(job.data);
    });

    queue.bull.on('failed', (job, err) => {
      console.log('Job Failed', queue.name, job.data);
      console.log(err);
    });
  });

export default { queues, add, process };
