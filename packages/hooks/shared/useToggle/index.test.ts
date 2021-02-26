import { useToggle } from '.';
import { useSetup } from '../../../.test';

describe('useToggle', () => {
  it('should be defined', () => {
    expect(useToggle).toBeDefined();
  });

  it('should be update toggle', () => {
    useSetup(() => {
      const [state, toggle] = useToggle();
      expect(state.value).toBeFalsy();
      toggle();
      expect(state.value).toBeTruthy();
      state.value = false;
      expect(state.value).toBeFalsy();
      toggle();
      console.log('expect(state.value)', state.value);
      expect(state.value).toBeTruthy();
    });
  });
});
