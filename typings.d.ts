declare module '@semantic-release/error' {
  export default class SemanticReleaseError {
    constructor(
      error: string,
      code: string,
      message: string,
    );
  }
}

declare module 'plist' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plist: any;
  export default plist;
}
