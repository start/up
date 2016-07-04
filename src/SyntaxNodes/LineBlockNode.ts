import { Line } from './Line'


export class LineBlockNode  {
  OUTLINE_SYNTAX_NODE(): void { }
  private LINE_BLOCK: any = null
  
  constructor(public lines: Line[] = []) { }
}
