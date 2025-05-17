import mitt from 'mitt';

type Events = {
  authChange: void; // No data needed for this simple case
};

const emitter = mitt<Events>();

export default emitter;