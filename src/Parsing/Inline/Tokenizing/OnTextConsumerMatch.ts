export interface OnTextConsumerMatch {
  (
    match: string,
    isTouchingWordEnd: boolean,
    isTouchingWordStart: boolean,
    ...captures: string[]
  ): void
}
