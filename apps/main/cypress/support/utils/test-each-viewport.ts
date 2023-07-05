export type Viewport = {
  width: number;
  height: number;
};

const defaultViewports: Viewport[] = [
  {
    width: 400,
    height: 800,
  },
  {
    width: 1200,
    height: 800,
  },
];

export const testEachViewport = (
  title: string,
  tests: () => void,
  viewports?: Viewport[]
) => {
  (viewports ?? defaultViewports).forEach(({ width, height }) => {
    describe(
      `${title ? `${title} ` : ''} when viewport is ${width}x${height}`,
      {
        viewportHeight: height,
        viewportWidth: width,
      },
      tests
    );
  });
};
