import { Line } from './Line'


export class LineBlockNode  {
  OUTLINE_SYNTAX_NODE(): void { }
  
  constructor(public lines: Line[] = []) { }

  private LINE_BLOCK: any = null
}
