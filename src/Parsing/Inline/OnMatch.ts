export interface OnMatch {
  (
    match: string,
    isTouchingWordEnd: boolean,
    isTouchingWordStart: boolean,
    ...captures: string[]
  ): void
}
