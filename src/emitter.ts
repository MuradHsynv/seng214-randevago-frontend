import mitt from 'mitt';

type Events = {
  authChange: void; 
};

const emitter = mitt<Events>();

export default emitter;