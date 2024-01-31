import {useEffect, useRef} from 'react';

const useDidMountEffect: any = (func: () => void, deps: any) => {
  const didMount = useRef(false);

  useEffect(() => {
    didMount.current ? func() : (didMount.current = true);
  }, deps);
};

export default useDidMountEffect;
